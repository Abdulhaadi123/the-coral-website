import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';

export const dynamic = 'force-dynamic';

// GET all campaigns — admin screens only.
export async function GET() {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { list: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST create a draft campaign.
export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const data = await req.json();
    const { subject, contentHtml, listId, attachments } = data;

    if (!subject || !String(subject).trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        subject: String(subject).trim(),
        contentHtml: contentHtml || '',
        listId: listId || null,
        attachments: Array.isArray(attachments) ? attachments : undefined,
      },
      include: { list: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}
