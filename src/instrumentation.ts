/**
 * Runs once when the Next.js server process starts (both `next dev` and the
 * production server/PM2) — this is where the email-campaign scheduler is
 * wired up, since it needs to live for the whole life of the process rather
 * than run per-request. See src/lib/emailScheduler.ts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startEmailScheduler } = await import('@/lib/emailScheduler');
    startEmailScheduler();
  }
}
