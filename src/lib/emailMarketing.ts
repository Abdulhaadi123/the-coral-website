import * as XLSX from 'xlsx';
import prisma from '@/lib/db';
import { getTransporter, mailConfigured, CONTACT_FROM_EMAIL } from '@/lib/mail';
import { SITE_URL } from '@/lib/site';

/** Pragmatic email format check — good enough to catch typos and garbage rows
 * without rejecting anything a real mail server would actually accept. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export interface ParsedContact {
  email: string;
  name: string | null;
  valid: boolean;
}

export interface ParseResult {
  contacts: ParsedContact[];
  /** Rows skipped entirely because every cell was blank. */
  blankRowsSkipped: number;
  /** Rows dropped because the same email (case-insensitive) already appeared earlier in this same file. */
  duplicatesSkipped: number;
}

/** Import takes about 1 ms per row (measured), and the web server's proxy gives up on a request after ~60 s. */
export const MAX_ROWS_PER_FILE = 25000;

/** Header text reduced to lowercase letters only: "E-mail Address *" and "email_address" both become "emailaddress". */
const normaliseHeader = (h: string) => h.toLowerCase().replace(/[^a-z]/g, '');

const EMAIL_EXACT = new Set(['email', 'emailaddress', 'emailaddresses', 'emailid', 'emailids', 'emails', 'mail', 'mailid', 'mailaddress']);
const NAME_EXACT = new Set(['name', 'fullname', 'firstname', 'contactname', 'customername', 'clientname', 'recipientname', 'displayname']);
/** "Mailing address", "Postal mail" etc. contain "mail" but are not the email column. */
const NOT_AN_EMAIL = /mailing|postal|street|home|office|physical|city|country/;

/** Picks the email column: an exact known header first, then one starting with "email", then any other containing "mail". */
function findEmailKey(headers: string[]): string | null {
  const norm = headers.map((h) => [h, normaliseHeader(h)] as const);
  const hit =
    norm.find(([, n]) => EMAIL_EXACT.has(n)) ||
    norm.find(([, n]) => n.startsWith('email')) ||
    norm.find(([, n]) => n.includes('mail') && !NOT_AN_EMAIL.test(n));
  return hit ? hit[0] : null;
}

function findNameKey(headers: string[]): string | null {
  const hit = headers.map((h) => [h, normaliseHeader(h)] as const).find(([, n]) => NAME_EXACT.has(n));
  return hit ? hit[0] : null;
}

/**
 * Reads a CSV/TSV or Excel file. For text files we decode the bytes ourselves —
 * handed raw bytes, SheetJS assumes a legacy single-byte encoding and turns UTF-8
 * (Urdu, accents, emoji — what Google Sheets exports, usually without a BOM)
 * into mojibake. Real .xlsx (zip) and .xls (OLE) files are binary and go straight in.
 */
function readWorkbook(buffer: Buffer): XLSX.WorkBook {
  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b;
  const isOle = buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
  if (isZip || isOle) return XLSX.read(buffer, { type: 'buffer' });

  let text: string;
  if (buffer[0] === 0xff && buffer[1] === 0xfe) text = new TextDecoder('utf-16le').decode(buffer);
  else if (buffer[0] === 0xfe && buffer[1] === 0xff) text = new TextDecoder('utf-16be').decode(buffer);
  else {
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
      text = new TextDecoder('windows-1252').decode(buffer); // legacy Excel "CSV" export
    }
  }
  return XLSX.read(text.replace(/^﻿/, ''), { type: 'string' });
}

/**
 * Parses an uploaded CSV or Excel (.xlsx/.xls) file into a deduplicated,
 * validated contact list. Throws a message safe to show the admin directly
 * when the file has no recognisable email column.
 */
export function parseContactsFile(buffer: Buffer): ParseResult {
  const workbook = readWorkbook(buffer);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('The file has no sheet/rows to read.');

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  if (rows.length === 0) throw new Error('The file has no data rows.');
  if (rows.length > MAX_ROWS_PER_FILE) {
    throw new Error(
      `This file has ${rows.length.toLocaleString('en-US')} rows — the limit is ${MAX_ROWS_PER_FILE.toLocaleString('en-US')} per list. Split it into smaller files and upload each as its own list.`
    );
  }

  const headers = Object.keys(rows[0]);
  const emailKey = findEmailKey(headers);
  if (!emailKey) {
    throw new Error(
      `Couldn't find an email column. The first row should have a header like "Email" — found: ${headers.join(', ') || '(none)'}.`
    );
  }
  const nameKey = findNameKey(headers);

  const seen = new Set<string>();
  const contacts: ParsedContact[] = [];
  let blankRowsSkipped = 0;
  let duplicatesSkipped = 0;

  for (const row of rows) {
    const rawEmail = String(row[emailKey] ?? '').trim();
    const rawName = nameKey ? String(row[nameKey] ?? '').trim() : '';

    // For CSV specifically, a fully-blank line is already dropped by
    // sheet_to_json before this loop ever sees it (verified in testing), so
    // this branch mainly catches a blank row that survives from an Excel
    // file. Either way the row never reaches `contacts` — this only affects
    // whether it's counted in the admin-facing "blank rows skipped" total.
    if (!rawEmail && !rawName) {
      blankRowsSkipped++;
      continue;
    }
    if (!rawEmail) {
      // A name with no email at all can't be mailed — treat like a blank row.
      blankRowsSkipped++;
      continue;
    }

    const key = rawEmail.toLowerCase();
    if (seen.has(key)) {
      duplicatesSkipped++;
      continue;
    }
    seen.add(key);

    contacts.push({
      email: rawEmail,
      name: rawName || null,
      valid: isValidEmail(rawEmail),
    });
  }

  if (contacts.length === 0) {
    throw new Error('No usable rows found after removing blanks and duplicates.');
  }

  return { contacts, blankRowsSkipped, duplicatesSkipped };
}

/** Escapes text before interpolating into the wrapper HTML (the subject/preheader, not the admin's own rich content). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface CampaignForSend {
  id: string;
  subject: string;
  contentHtml: string;
  attachments: unknown;
}

function campaignAttachments(campaign: CampaignForSend): { filename: string; href: string }[] {
  const raw = campaign.attachments;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((a): a is { filename?: string; url?: string } => !!a && typeof a === 'object')
    .filter((a) => typeof a.url === 'string' && a.url)
    .map((a) => ({ filename: a.filename || 'attachment', href: a.url as string }));
}

/**
 * One recipient's rendered email — wraps the admin's rich content in The Coral
 * Room's branded shell (logo header, accent bar, footer). Table-based layout
 * on purpose: it's the one HTML pattern Outlook's Word-based renderer and
 * every other mail client all agree on.
 */
export function renderEmail(subject: string, contentHtml: string): string {
  // White-lettered logo on the dark header below. Deliberately a PNG, not WebP:
  // Outlook and several other mail clients still don't render WebP images.
  const logoUrl = `${SITE_URL}/images/logo-white.png`;
  const year = new Date().getFullYear();
  const siteLabel = SITE_URL.replace(/^https?:\/\//, '');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td bgcolor="#111827" style="padding:28px 32px;background:#111827;">
                <img src="${logoUrl}" width="140" alt="The Coral Room" style="display:block;border:0;outline:none;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;font-size:15px;line-height:1.6;">
                ${contentHtml}
              </td>
            </tr>
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background-color:#78B249;background-image:linear-gradient(90deg,#78B249,#598323);">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:20px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">
                <p style="margin:0 0 4px;">&copy; ${year} The Coral Room. All rights reserved.</p>
                <p style="margin:0;"><a href="${SITE_URL}" style="color:#598323;text-decoration:none;">${siteLabel}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Pause between individual sends so a large list doesn't trip the SMTP provider's rate limiting/spam heuristics. */
const SEND_DELAY_MS = 300;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function failCampaign(campaignId: string): Promise<void> {
  await prisma.emailCampaign.update({ where: { id: campaignId }, data: { status: 'failed' } });
}

/**
 * Sends a campaign to every valid contact on its list, updating progress on the
 * row as it goes so the admin UI can show it live. It always starts from the
 * top of the list (counters reset), so callers must only invoke it for a
 * campaign that has not delivered anything yet — the send route and the
 * scheduler both guarantee that. A campaign that cannot be sent at all is
 * marked "failed" here (rather than left "scheduled") so nothing retries it forever.
 */
export async function sendCampaignNow(campaignId: string): Promise<void> {
  const campaign = await prisma.emailCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) throw new Error('Campaign not found');
  if (!campaign.listId) {
    await failCampaign(campaignId);
    throw new Error('Campaign has no recipient list');
  }

  if (!mailConfigured) {
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: 'failed' },
    });
    throw new Error('SMTP is not configured on this server (SMTP_HOST/SMTP_USER/SMTP_PASSWORD)');
  }

  const contacts = await prisma.emailContact.findMany({
    where: { listId: campaign.listId, valid: true },
  });
  if (contacts.length === 0) {
    await failCampaign(campaignId);
    throw new Error('The list has no valid email addresses');
  }

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { status: 'sending', totalRecipients: contacts.length, sentCount: 0, failedCount: 0 },
  });

  const transporter = getTransporter();
  const html = renderEmail(campaign.subject, campaign.contentHtml);
  const attachments = campaignAttachments(campaign);

  let sent = 0;
  let failed = 0;

  for (const contact of contacts) {
    try {
      await transporter.sendMail({
        from: `"The Coral Room" <${CONTACT_FROM_EMAIL}>`,
        to: contact.name ? `"${contact.name.replace(/["\\\u0000-\u001f]/g, '')}" <${contact.email}>` : contact.email,
        subject: campaign.subject,
        html,
        attachments,
      });
      sent++;
    } catch (err) {
      console.error(`Campaign ${campaignId}: failed to send to ${contact.email}:`, err);
      failed++;
    }

    // Keep the row's progress live for the admin UI polling it, and avoid
    // hammering the SMTP server back-to-back.
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { sentCount: sent, failedCount: failed },
    });
    await sleep(SEND_DELAY_MS);
  }

  // "sent" means at least one recipient actually got it; if every single send
  // failed (e.g. SMTP was unreachable for the whole run), that's a failure,
  // not a quiet success with a 0 count — the admin should notice and retry.
  const finalStatus = sent === 0 && failed > 0 ? 'failed' : 'sent';
  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { status: finalStatus, sentAt: new Date() },
  });
}
