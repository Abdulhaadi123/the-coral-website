import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendContactEmail, mailConfigured } from '@/lib/mail';

// nodemailer needs the Node runtime — it cannot run on the edge.
export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX = { name: 100, email: 200, phone: 40, company: 150, website: 300, message: 5000 };

/** Trim, collapse to a string, and cap length so one field can't blow up the payload. */
function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = clean(body.firstName, MAX.name);
    const lastName = clean(body.lastName, MAX.name);
    const email = clean(body.email, MAX.email);
    const phone = clean(body.phone, MAX.phone);
    const company = clean(body.company, MAX.company);
    const website = clean(body.website, MAX.website);
    const message = clean(body.message, MAX.message);
    const hasBrief = clean(body.hasBrief, 10);

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and work email are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // 1. Persist first. The enquiry is never lost even if SMTP is down or unset.
    //    Extra fields (company/website/message) live in the email — the Lead model
    //    intentionally stays as-is so this needs no database migration.
    let leadId: string | null = null;
    try {
      const lead = await prisma.lead.create({
        data: {
          name: fullName,
          email: email.toLowerCase(),
          phone: phone || 'Not provided',
          source: 'book_a_call',
        },
      });
      leadId = lead.id;
    } catch (err: any) {
      console.error('Contact: DB write failed:', err.message);
    }

    // 2. Notify by email.
    let emailed = false;
    if (mailConfigured) {
      try {
        await sendContactEmail({
          firstName,
          lastName,
          email,
          phone,
          company,
          website,
          message,
          hasBrief,
        });
        emailed = true;
      } catch (err: any) {
        console.error('Contact: SMTP send failed:', err.message);
      }
    } else {
      console.warn('Contact: SMTP not configured — enquiry saved to DB only.');
    }

    // Only a total loss is an error the visitor should see. If either channel
    // captured the enquiry, the submission succeeded from their point of view.
    if (!leadId && !emailed) {
      return NextResponse.json(
        { error: 'We could not submit your enquiry. Please email us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailed, saved: Boolean(leadId) }, { status: 201 });
  } catch (error: any) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}
