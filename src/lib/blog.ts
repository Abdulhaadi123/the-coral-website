import prisma from '@/lib/db';
import type { BlogPost as BlogPostRecord } from '@prisma/client';
import { visibleNowWhere } from '@/lib/blogPublishing';
import { SITE_TIME_ZONE } from '@/lib/site';

/** Shape consumed by the public journal/blog pages — a formatted, display-ready post. */
export interface PublicBlogPost {
  id: string;
  slug: string;
  badge: string;
  category: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  contentHtml: string;
}

/** "Apr 16, 2026" — matches the original hand-written post dates, in the business's timezone. */
export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIME_ZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function toPublicPost(post: BlogPostRecord): PublicBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    badge: post.badge,
    category: post.category,
    date: formatBlogDate(post.publishedAt),
    title: post.title,
    subtitle: post.subtitle,
    description: post.description,
    image: post.image,
    contentHtml: post.contentHtml,
  };
}

/** Published posts for the /journal listing and homepage preview, newest-ordered-first. */
export async function getPublishedBlogPosts(limit?: number): Promise<PublicBlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: visibleNowWhere(),
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });
    return posts.map(toPublicPost);
  } catch (err) {
    console.error('Error in getPublishedBlogPosts:', err);
    return [];
  }
}

/** A single published post by slug, or null if missing/unpublished. */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  try {
    const post = await prisma.blogPost.findFirst({ where: { slug, ...visibleNowWhere() } });
    return post ? toPublicPost(post) : null;
  } catch (err) {
    console.error(`Error in getPublishedBlogPostBySlug for "${slug}":`, err);
    return null;
  }
}

/** Up to `limit` other published posts, for the "Related Posts" rail. */
export async function getRelatedBlogPosts(excludeSlug: string, limit = 3): Promise<PublicBlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { slug: { not: excludeSlug }, ...visibleNowWhere() },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
      take: limit,
    });
    return posts.map(toPublicPost);
  } catch (err) {
    console.error('Error in getRelatedBlogPosts:', err);
    return [];
  }
}
