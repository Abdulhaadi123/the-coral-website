import cron from 'node-cron';
import { internalCronToken, publishDueScheduledPosts } from '@/lib/blogPublishing';
import { pingSearchConsoleSitemap } from '@/lib/searchConsole';

/**
 * Checks once a minute for blog posts whose scheduled date and time has arrived and
 * publishes them. Runs inside the long-lived Next.js server process (PM2 on the self-hosted
 * box), wired in via src/instrumentation.ts, like src/lib/emailScheduler.ts.
 *
 * The work itself happens in /api/cron/publish-scheduled, called over loopback: refreshing
 * the cached pages (revalidatePath) only works while a request is being handled, never from
 * a timer. If that call fails the posts are still published straight from here, and the
 * pages refresh on their own revalidate interval (at most a minute for the journal).
 */

const ROUTE = '/api/cron/publish-scheduled';
const STARTUP_DELAY_MS = 15_000; // let the server finish starting before the first catch-up run
const REQUEST_TIMEOUT_MS = 30_000;

let started = false;
let running = false;

/** This server's own address. Next exposes the port it listens on via PORT / __NEXT_PRIVATE_ORIGIN. */
function internalOrigin(): string {
  const origin = process.env.INTERNAL_APP_URL || process.env.__NEXT_PRIVATE_ORIGIN || `http://127.0.0.1:${process.env.PORT || 3000}`;
  // "localhost" can resolve to ::1 first, which a server bound to IPv4 only never answers.
  return origin.replace('//localhost', '//127.0.0.1').replace(/\/+$/, '');
}

async function runCheck(): Promise<void> {
  if (running) return; // a slow run must not overlap the next tick
  running = true;
  try {
    const res = await fetch(`${internalOrigin()}${ROUTE}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${internalCronToken()}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`${ROUTE} answered ${res.status}`);
  } catch (err) {
    console.error('[blog-scheduler] Internal call failed — publishing directly:', err);
    try {
      const published = await publishDueScheduledPosts();
      if (published.length > 0) await pingSearchConsoleSitemap();
    } catch (fallbackErr) {
      console.error('[blog-scheduler] Failed to publish due posts:', fallbackErr);
    }
  } finally {
    running = false;
  }
}

export function startBlogScheduler(): void {
  if (started) return;
  started = true;

  // Catch up on posts that became due while the server was restarting or down.
  setTimeout(() => void runCheck(), STARTUP_DELAY_MS).unref?.();

  cron.schedule('* * * * *', () => void runCheck());

  console.log('[blog-scheduler] started — checking for due scheduled blog posts every minute.');
}
