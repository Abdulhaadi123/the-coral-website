/**
 * Runs once when the Next.js server process starts (both `next dev` and the
 * production server/PM2) — this is where the background schedulers are wired
 * up, since they need to live for the whole life of the process rather than
 * run per-request:
 *   - email campaigns  (src/lib/emailScheduler.ts)
 *   - blog publishing  (src/lib/blogScheduler.ts)
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Local test servers share the production database; set DISABLE_EMAIL_SCHEDULER=1 /
    // DISABLE_BLOG_SCHEDULER=1 there so they never send a live campaign or publish a live post.
    if (process.env.DISABLE_EMAIL_SCHEDULER !== '1') {
      const { startEmailScheduler } = await import('@/lib/emailScheduler');
      startEmailScheduler();
    }
    if (process.env.DISABLE_BLOG_SCHEDULER !== '1') {
      const { startBlogScheduler } = await import('@/lib/blogScheduler');
      startBlogScheduler();
    }
  }
}
