import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, getCurrentAdmin } from '@/lib/access';
import { hasPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET all blog posts (admin — includes unpublished)
export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canManageBlog = hasPermission(admin, 'blog');
    if (!canManageBlog && !hasPermission(admin, 'seo')) {
      return NextResponse.json({ error: 'You do not have permission to do this.' }, { status: 403 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    });

    // The SEO screen lists every post to edit its title and description, so SEO
    // users get just those — not post bodies, covers or drafts' full content.
    if (!canManageBlog) {
      return NextResponse.json({
        success: true,
        posts: posts.map((p) => ({ id: p.id, slug: p.slug, title: p.title, description: p.description })),
      });
    }

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST create blog post
export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess('blog');
    if (denied) return denied;

    const data = await req.json();
    const {
      title,
      slug,
      subtitle,
      description,
      badge,
      category,
      image,
      contentHtml,
      featured,
      published,
      order,
      publishedAt,
    } = data;

    if (!title || !slug || !description || !image || !contentHtml) {
      return NextResponse.json(
        { error: 'Title, slug, description, cover image, and content are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        subtitle: subtitle ? subtitle.trim() : '',
        description: description.trim(),
        badge: badge ? badge.trim() : '',
        category: category ? category.trim() : '',
        image: image.trim(),
        contentHtml,
        featured: Boolean(featured),
        published: published === undefined ? true : Boolean(published),
        order: Number(order) || 0,
        ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });

    revalidatePath('/journal');
    revalidatePath(`/journal/${post.slug}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
