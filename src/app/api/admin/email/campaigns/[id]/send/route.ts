import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess } from '@/lib/access';
import { sendCampaignNow } from '@/lib/emailMarketing';

export const dynamic = 'force-dynamic';

// POST — send a draft campaign immediately, or schedule it for later.
// Body: {} to send now, or { scheduledAt: "<ISO datetime>" } to schedule.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const campaign = await prisma.emailCampaign.findUnique({ where: { id: params.id } });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    // A campaign that failed before delivering to anyone (e.g. SMTP was down) may be retried.
    // One that reached some recipients may not: re-sending would email those people twice.
    const retryable = campaign.status === 'failed' && campaign.sentCount === 0;
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled' && !retryable) {
      const error =
        campaign.status === 'failed'
          ? `This campaign reached ${campaign.sentCount} recipient(s) before it failed, so re-sending it would email them twice. Create a new campaign for the rest.`
          : `This campaign is already ${campaign.status}.`;
      return NextResponse.json({ error }, { status: 400 });
    }
    if (!campaign.listId) {
      return NextResponse.json({ error: 'Choose a recipient list before sending.' }, { status: 400 });
    }
    const validRecipients = await prisma.emailContact.count({ where: { listId: campaign.listId, valid: true } });
    if (validRecipients === 0) {
      return NextResponse.json({ error: 'This list has no valid email addresses to send to.' }, { status: 400 });
    }
    if (!campaign.subject.trim()) {
      return NextResponse.json({ error: 'Add a subject before sending.' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { scheduledAt } = body as { scheduledAt?: string };

    if (scheduledAt) {
      const when = new Date(scheduledAt);
      if (Number.isNaN(when.getTime())) {
        return NextResponse.json({ error: 'Invalid schedule date/time.' }, { status: 400 });
      }
      if (when.getTime() <= Date.now()) {
        return NextResponse.json({ error: 'Schedule a time in the future.' }, { status: 400 });
      }

      const updated = await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'scheduled', scheduledAt: when },
      });
      return NextResponse.json({ success: true, campaign: updated });
    }

    // Send now: flip to "sending" immediately so the admin sees it change right
    // away, then let sendCampaignNow run in the background — a real send can
    // take a while and shouldn't hold the HTTP request open that long.
    const updated = await prisma.emailCampaign.update({
      where: { id: params.id },
      data: { status: 'sending', scheduledAt: null },
    });

    sendCampaignNow(params.id).catch((err) => {
      console.error(`Campaign ${params.id}: send failed:`, err);
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    console.error('Error sending/scheduling campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to send campaign' }, { status: 500 });
  }
}

// DELETE — cancel a pending schedule, reverting the campaign back to a draft.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const campaign = await prisma.emailCampaign.findUnique({ where: { id: params.id } });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    if (campaign.status !== 'scheduled') {
      return NextResponse.json({ error: 'Only a scheduled campaign can be cancelled.' }, { status: 400 });
    }

    const updated = await prisma.emailCampaign.update({
      where: { id: params.id },
      data: { status: 'draft', scheduledAt: null },
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    console.error('Error cancelling scheduled campaign:', error);
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  }
}
