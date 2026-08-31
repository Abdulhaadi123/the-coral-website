import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, source = 'portfolio_gate' } = data;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are all required.' },
        { status: 400 }
      );
    }

    // 1. Save Lead to Supabase PostgreSQL Database (Primary Storage)
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        source: source.trim(),
      },
    });

    // 2. Forward Lead to Google Sheet Webhook if configured (Secondary Real-time Sync)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        // Fire and forget non-blocking fetch
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            createdAt: lead.createdAt.toISOString(),
          }),
        }).catch((err) => {
          console.warn('Google Sheet Webhook dispatch notice:', err.message);
        });
      } catch (err) {
        console.warn('Google Sheet Webhook failed silently:', err);
      }
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process access request' },
      { status: 500 }
    );
  }
}
