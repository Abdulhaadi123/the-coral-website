import cron from 'node-cron';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { pingSearchConsoleSitemap } from '@/lib/searchConsole';

/**
 * Checks once a minute for blog posts whose scheduled date and time has arrived
 * and automatically publishes them live to the site.
 *
 * Runs inside the long-lived Next.js server process (PM2 / production server),
 * wired in via src/instrumentation.ts, matching src/lib/emailScheduler.ts.
 */
let started = false;

export async function publishDueScheduledPosts(): Promise<number> {
  const now = new Date();
  try {
    const duePosts = await prisma.blogPost.findMany({
      where: {
        published: false,
        scheduledAt: { lte: now },
      },
      select: { id: true, slug: true, title: true, scheduledAt: true },
    });

    if (duePosts.length === 0) return 0;

    const ids = duePosts.map((p) => p.id);
    const result = await prisma.blogPost.updateMany({
      where: { id: { in: ids } },
      data: {
        published: true,
      },
    });

    console.log(
      `[blog-scheduler] Successfully auto-published ${result.count} scheduled post(s):`,
      duePosts.map((p) => p.title).join(', ')
    );

    try {
      revalidatePath('/journal');
      revalidatePath('/blog');
      revalidatePath('/');
      for (const p of duePosts) {
        revalidatePath(`/journal/${p.slug}`);
        revalidatePath(`/blog/${p.slug}`);
      }
      await pingSearchConsoleSitemap();
    } catch (revErr) {
      console.error('[blog-scheduler] Path revalidation error after publishing:', revErr);
    }

    return result.count;
  } catch (err) {
    console.error('[blog-scheduler] Failed to check/publish due posts:', err);
    return 0;
  }
}

export function startBlogScheduler(): void {
  if (started) return;
  started = true;

  // Immediate check on startup in case any posts became due while restarting/offline
  publishDueScheduledPosts().catch((err) => {
    console.error('[blog-scheduler] Startup run failed:', err);
  });

  // Scheduled check every minute
  cron.schedule('* * * * *', async () => {
    await publishDueScheduledPosts();
  });

  console.log('[blog-scheduler] started — checking for due scheduled blog posts every minute.');
}
