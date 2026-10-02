import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';

export const dynamic = 'force-dynamic';

// Only a campaign nobody has started sending yet may still be edited.
const EDITABLE_STATUSES = ['draft', 'scheduled'];

// GET a single campaign — admin screens only.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: params.id },
      include: { list: { select: { id: true, name: true } } },
    });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

// PUT update a draft/scheduled campaign's content.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const existing = await prisma.emailCampaign.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const editable = EDITABLE_STATUSES.includes(existing.status) || (existing.status === 'failed' && existing.sentCount === 0);
    if (!editable) {
      return NextResponse.json({ error: `A ${existing.status} campaign can no longer be edited.` }, { status: 400 });
    }

    const data = await req.json();
    const { subject, contentHtml, listId, attachments } = data;

    const campaign = await prisma.emailCampaign.update({
      where: { id: params.id },
      data: {
        ...(subject !== undefined && { subject: String(subject).trim() }),
        ...(contentHtml !== undefined && { contentHtml }),
        ...(listId !== undefined && { listId: listId || null }),
        ...(attachments !== undefined && {
          attachments: Array.isArray(attachments) ? attachments : Prisma.JsonNull,
        }),
      },
      include: { list: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}

// DELETE a campaign. Sent campaigns are kept as a record by default — this
// still allows deleting one if an admin explicitly wants it gone.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const existing = await prisma.emailCampaign.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    if (existing.status === 'sending') {
      return NextResponse.json({ error: 'This campaign is currently sending and cannot be deleted.' }, { status: 400 });
    }

    await prisma.emailCampaign.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
