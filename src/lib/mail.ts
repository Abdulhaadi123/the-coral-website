import nodemailer, { type Transporter } from 'nodemailer';

/**
 * SMTP transport for outbound enquiry notifications.
 *
 * Required env vars:
 *   SMTP_HOST        e.g. "smtp.gmail.com"
 *   SMTP_USER        the mailbox that authenticates, e.g. "you@gmail.com"
 *   SMTP_PASSWORD    Gmail App Password (NOT the account password) — 2FA must be on
 * Optional:
 *   SMTP_PORT        465 (implicit TLS, default) or 587 (STARTTLS)
 *   SMTP_SECURE      "true" | "false" — inferred from the port when omitted
 *   CONTACT_TO_EMAIL where enquiries are delivered; defaults to SMTP_USER
 *   CONTACT_FROM_EMAIL  envelope From; defaults to SMTP_USER.
 *                       Gmail rejects a From that isn't the authenticated user
 *                       or one of its verified aliases, so override with care.
 */

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);

// Port 465 is implicit TLS; 587 upgrades via STARTTLS after connecting.
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : SMTP_PORT === 465;

export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || SMTP_USER;
export const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || SMTP_USER;

/** True when enough is configured to actually send. */
export const mailConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASSWORD);

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (!mailConfigured) {
    throw new Error('SMTP is not configured (need SMTP_HOST, SMTP_USER, SMTP_PASSWORD)');
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }
  return transporter;
}

/** Escape user-supplied text before interpolating it into the HTML body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strip CR/LF so a submitted value can't inject extra headers (e.g. a rogue Bcc)
 * when it is used in Subject or Reply-To.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
  hasBrief?: string;
}

const ROWS: Array<[string, keyof ContactSubmission]> = [
  ['Name', 'firstName'],
  ['Email', 'email'],
  ['Phone / WhatsApp', 'phone'],
  ['Company or brand', 'company'],
  ['Website or social', 'website'],
  ['Has a project brief', 'hasBrief'],
];

export async function sendContactEmail(data: ContactSubmission) {
  const fullName = headerSafe(`${data.firstName} ${data.lastName}`.trim());
  const replyTo = headerSafe(data.email);

  const values: Record<string, string> = {
    firstName: fullName,
    email: data.email,
    phone: data.phone || '—',
    company: data.company || '—',
    website: data.website || '—',
    hasBrief: data.hasBrief || '—',
  };

  const rowsHtml = ROWS.map(
    ([label, key]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${escapeHtml(values[key] ?? '—')}</td>
      </tr>`
  ).join('');

  const messageHtml = data.message
    ? `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;">
         <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">What they need help with</p>
         <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
       </div>`
    : '';

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;padding:32px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
        <p style="margin:0 0 4px;color:#78B249;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">New enquiry</p>
        <h1 style="margin:0 0 24px;color:#111827;font-size:22px;font-weight:700;">The Coral Room — Book a Call</h1>
        <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        ${messageHtml}
      </div>
    </div>`;

  const text = [
    'New enquiry — The Coral Room (Book a Call)',
    '',
    ...ROWS.map(([label, key]) => `${label}: ${values[key] ?? '—'}`),
    '',
    `What they need help with:\n${data.message || '—'}`,
  ].join('\n');

  return getTransporter().sendMail({
    from: `"The Coral Room" <${CONTACT_FROM_EMAIL}>`,
    to: CONTACT_TO_EMAIL,
    // Replying in the mail client goes straight back to the enquirer.
    replyTo: replyTo ? `"${fullName}" <${replyTo}>` : undefined,
    subject: `New enquiry from ${fullName || replyTo}`,
    text,
    html,
  });
}
