import prisma from '@/lib/db';
import type { BlogPost as BlogPostRecord } from '@prisma/client';

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

/** "Apr 16, 2026" — matches the original hand-written post dates. */
export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
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
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    ...(limit ? { take: limit } : {}),
  });
  return posts.map(toPublicPost);
}

/** A single published post by slug, or null if missing/unpublished. */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
  return post ? toPublicPost(post) : null;
}

/** Up to `limit` other published posts, for the "Related Posts" rail. */
export async function getRelatedBlogPosts(excludeSlug: string, limit = 3): Promise<PublicBlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, slug: { not: excludeSlug } },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    take: limit,
  });
  return posts.map(toPublicPost);
}
