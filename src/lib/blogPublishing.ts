import { createHmac, timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { pingSearchConsoleSitemap } from '@/lib/searchConsole';

/*
 * Everything about moving a blog post from "scheduled" to "live", kept free of the cron
 * library so API routes can import it. The 1-minute timer lives in blogScheduler.ts.
 */

/**
 * The single definition of "a visitor may see this post right now": it is published, or its
 * scheduled time has arrived but the timer has not flipped the flag yet (a minute at most).
 * Public pages and the sitemap all filter with this.
 */
export function visibleNowWhere(now: Date = new Date()): Prisma.BlogPostWhereInput {
  return { OR: [{ published: true }, { published: false, scheduledAt: { lte: now } }] };
}

/** A scheduled time must be a real date that has not already passed (a couple of minutes of clock drift is tolerated). */
export function parseScheduledAt(value: unknown): { ok: true; date: Date } | { ok: false; error: string } {
  const date = new Date(value as string);
  if (isNaN(date.getTime())) return { ok: false, error: 'Invalid scheduled date and time' };
  if (date.getTime() < Date.now() - 2 * 60_000) {
    return { ok: false, error: 'Scheduled date and time must be in the future.' };
  }
  return { ok: true, date };
}

/** A live post can never carry a publish date in the future. */
export function clampToNow(date: Date): Date {
  return date.getTime() > Date.now() ? new Date() : date;
}

export interface PublishedPost {
  id: string;
  slug: string;
  title: string;
}

/**
 * Publishes every scheduled post whose time has arrived and returns them. Database only — it
 * does not refresh any cache (see `publishDueAndRevalidate`).
 *
 * `scheduledAt` is cleared on the way out so it only ever means "still waiting": a post that
 * is later set back to draft can never be re-published by an old schedule. `publishedAt`
 * already holds the scheduled moment (set when the post was scheduled).
 */
export async function publishDueScheduledPosts(): Promise<PublishedPost[]> {
  const now = new Date();
  const due = await prisma.blogPost.findMany({
    where: { published: false, scheduledAt: { lte: now } },
    select: { id: true, slug: true, title: true },
  });
  if (due.length === 0) return [];

  // Re-checked in the UPDATE itself so a post edited in between is left alone.
  await prisma.blogPost.updateMany({
    where: { id: { in: due.map((p) => p.id) }, published: false, scheduledAt: { lte: now } },
    data: { published: true, scheduledAt: null },
  });

  console.log(`[blog-scheduler] Auto-published ${due.length} scheduled post(s): ${due.map((p) => p.title).join(', ')}`);
  return due;
}

/**
 * Refreshes everything a blog change touches: the cached pages that list or show posts, and
 * Google Search Console (best-effort). `revalidatePath` only works while a request is being
 * handled — calling it from a timer throws — so this must run inside an API route.
 */
export async function revalidateBlog(slugs: string[]): Promise<void> {
  revalidatePath('/journal');
  revalidatePath('/blog');
  revalidatePath('/');
  for (const slug of Array.from(new Set(slugs))) {
    revalidatePath(`/journal/${slug}`);
    revalidatePath(`/blog/${slug}`);
  }
  await pingSearchConsoleSitemap();
}

/** `publishDueScheduledPosts` plus the cache refresh. Request context only. Returns how many went live. */
export async function publishDueAndRevalidate(): Promise<number> {
  const published = await publishDueScheduledPosts();
  if (published.length > 0) {
    try {
      await revalidateBlog(published.map((p) => p.slug));
    } catch (err) {
      // The posts are live regardless; pages refresh on their own revalidate interval.
      console.error('[blog-scheduler] Cache refresh after publishing failed:', err);
    }
  }
  return published.length;
}

/*
 * The in-process timer cannot refresh the cache itself, so it asks this server's own cron
 * route to do the work. That call carries a token both sides derive from the same secret —
 * nothing to configure, and nobody outside the server can produce it. An external scheduler
 * can use CRON_SECRET instead.
 */

const TOKEN_CONTEXT = 'blog-scheduler';

export function internalCronToken(): string {
  const secret = process.env.CRON_SECRET || process.env.JWT_SECRET || 'coral_room_super_secret_admin_jwt_key_987654321';
  return createHmac('sha256', secret).update(TOKEN_CONTEXT).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** True when the request carries `Authorization: Bearer <token>` with an accepted token. */
export function isCronAuthorized(authorization: string | null): boolean {
  const match = /^Bearer\s+(.+)$/i.exec(authorization ?? '');
  if (!match) return false;
  const presented = match[1].trim();
  const accepted = [internalCronToken(), process.env.CRON_SECRET].filter((t): t is string => Boolean(t));
  return accepted.some((token) => safeEqual(presented, token));
}
