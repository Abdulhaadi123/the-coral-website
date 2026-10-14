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
  try {
    const now = new Date();
    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [
          { published: true },
          { published: false, scheduledAt: { lte: now } },
        ],
      },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });

    const dueUnpublished = posts.filter((p) => !p.published);
    if (dueUnpublished.length > 0) {
      prisma.blogPost
        .updateMany({
          where: { id: { in: dueUnpublished.map((p) => p.id) } },
          data: { published: true },
        })
        .catch((e) => console.error('Error auto-promoting scheduled posts:', e));
    }

    return posts.map(toPublicPost);
  } catch (err) {
    console.error('Error in getPublishedBlogPosts:', err);
    return [];
  }
}

/** A single published post by slug, or null if missing/unpublished. */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  try {
    const now = new Date();
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        OR: [
          { published: true },
          { published: false, scheduledAt: { lte: now } },
        ],
      },
    });

    if (post && !post.published) {
      prisma.blogPost
        .update({
          where: { id: post.id },
          data: { published: true },
        })
        .catch((e) => console.error('Error auto-promoting scheduled post:', e));
    }

    return post ? toPublicPost(post) : null;
  } catch (err) {
    console.error(`Error in getPublishedBlogPostBySlug for "${slug}":`, err);
    return null;
  }
}

/** Up to `limit` other published posts, for the "Related Posts" rail. */
export async function getRelatedBlogPosts(excludeSlug: string, limit = 3): Promise<PublicBlogPost[]> {
  try {
    const now = new Date();
    const posts = await prisma.blogPost.findMany({
      where: {
        slug: { not: excludeSlug },
        OR: [
          { published: true },
          { published: false, scheduledAt: { lte: now } },
        ],
      },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
      take: limit,
    });
    return posts.map(toPublicPost);
  } catch (err) {
    console.error('Error in getRelatedBlogPosts:', err);
    return [];
  }
}
