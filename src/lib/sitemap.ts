import prisma from '@/lib/db';
import { SEO_ROUTES } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export interface SitemapEntry {
  url: string;
  label: string;
  kind: 'page' | 'post';
  lastModified?: Date;
}

/**
 * Every URL that belongs in sitemap.xml, built from live data on each request:
 * the fixed marketing pages plus every currently *published* journal post.
 * Publishing, unpublishing, renaming or deleting a post in the admin is
 * therefore reflected immediately — nobody edits or uploads a sitemap by hand.
 *
 * Deliberately left out:
 *  - /portfolio/[slug]: those pages sit behind the lead-capture gate and redirect
 *    visitors who haven't unlocked it, so they aren't crawlable content.
 *  - /blog and /blog/[slug]: duplicates of /journal, which is the canonical path.
 *  - /admin and /api: private (also disallowed in robots.txt).
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  let posts: { slug: string; title: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, title: true, updatedAt: true },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    });
  } catch (err) {
    // Keep serving the fixed pages if the database is unreachable.
    console.error('Sitemap: could not load journal posts:', err);
  }

  // The journal index changes whenever a post is added or edited.
  const latestPostChange = posts.reduce<Date | undefined>(
    (latest, p) => (!latest || p.updatedAt > latest ? p.updatedAt : latest),
    undefined
  );

  const pages: SitemapEntry[] = SEO_ROUTES.map((route) => ({
    url: route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`,
    label: route.label,
    kind: 'page',
    ...(route.path === '/journal' && latestPostChange ? { lastModified: latestPostChange } : {}),
  }));

  const postEntries: SitemapEntry[] = posts.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    label: post.title,
    kind: 'post',
    lastModified: post.updatedAt,
  }));

  return [...pages, ...postEntries];
}
