import cron from 'node-cron';
import prisma from '@/lib/db';
import { sendCampaignNow } from '@/lib/emailMarketing';

/**
 * Checks once a minute for campaigns whose scheduled time has arrived and
 * sends them. Runs inside the long-lived Next.js server process (PM2 on the
 * self-hosted box), so no external cron/crontab setup is needed — unlike
 * Vercel, this process never goes to sleep between requests.
 *
 * Each due campaign is claimed with a single conditional UPDATE
 * (scheduled -> sending) before sending, so it can never be picked up twice —
 * not by an overlapping tick, and not by a second server process.
 */
let started = false;

export function startEmailScheduler(): void {
  if (started) return;
  started = true;

  // A restart (deploy, crash, memory limit) in the middle of a send leaves the campaign on
  // "sending" forever. There is no per-recipient record to resume from, and re-running it
  // would email the first recipients again, so it is marked "failed": the admin sees how many
  // were reached and can decide. Nothing can legitimately be mid-send in a process that has
  // only just started.
  prisma.emailCampaign
    .updateMany({ where: { status: 'sending' }, data: { status: 'failed' } })
    .then((r) => {
      if (r.count > 0) console.warn(`[email-scheduler] ${r.count} campaign(s) were interrupted by a restart and marked "failed".`);
    })
    .catch((err) => console.error('Email scheduler: restart recovery failed:', err));

  cron.schedule('* * * * *', async () => {
    let due: { id: string }[] = [];
    try {
      due = await prisma.emailCampaign.findMany({
        where: { status: 'scheduled', scheduledAt: { lte: new Date() } },
        select: { id: true },
      });
    } catch (err) {
      console.error('Email scheduler: failed to query due campaigns:', err);
      return;
    }

    for (const campaign of due) {
      try {
        const claim = await prisma.emailCampaign.updateMany({
          where: { id: campaign.id, status: 'scheduled' },
          data: { status: 'sending' },
        });
        if (claim.count !== 1) continue; // another tick got there first
      } catch (err) {
        console.error(`Email scheduler: could not claim campaign ${campaign.id}:`, err);
        continue;
      }
      sendCampaignNow(campaign.id).catch((err) => {
        console.error(`Email scheduler: campaign ${campaign.id} failed to send:`, err);
      });
    }
  });

  console.log('[email-scheduler] started — checking for due campaigns every minute.');
}
