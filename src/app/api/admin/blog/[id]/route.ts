import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, getCurrentAdmin } from '@/lib/access';
import { hasPermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';
import { pingSearchConsoleSitemap } from '@/lib/searchConsole';

export const dynamic = 'force-dynamic';

// GET single blog post by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('blog');
    if (denied) return denied;

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT update blog post by id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canManageBlog = hasPermission(admin, 'blog');
    if (!canManageBlog && !hasPermission(admin, 'seo')) {
      return NextResponse.json({ error: 'You do not have permission to do this.' }, { status: 403 });
    }

    const data = await req.json();

    // SEO access covers a post's title and description only (that's all the SEO
    // screen sends) — never its content, slug, publish state or anything else.
    if (!canManageBlog) {
      const outOfScope = Object.keys(data).filter((key) => key !== 'title' && key !== 'description');
      if (outOfScope.length > 0) {
        return NextResponse.json(
          { error: "SEO access only allows editing a post's title and description." },
          { status: 403 }
        );
      }
    }

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

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    if (slug && slug.trim().toLowerCase() !== existingPost.slug) {
      const clash = await prisma.blogPost.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });
      if (clash && clash.id !== params.id) {
        return NextResponse.json({ error: 'Slug is already used by another post' }, { status: 400 });
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(slug && { slug: slug.trim().toLowerCase() }),
        subtitle: subtitle !== undefined ? subtitle.trim() : existingPost.subtitle,
        ...(description && { description: description.trim() }),
        badge: badge !== undefined ? badge.trim() : existingPost.badge,
        category: category !== undefined ? category.trim() : existingPost.category,
        ...(image && { image: image.trim() }),
        ...(contentHtml !== undefined && { contentHtml }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(published !== undefined && { published: Boolean(published) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });

    revalidatePath('/journal');
    revalidatePath(`/journal/${existingPost.slug}`);
    revalidatePath(`/journal/${updated.slug}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${existingPost.slug}`);
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath('/');
    await pingSearchConsoleSitemap();

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE blog post by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('blog');
    if (denied) return denied;

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    revalidatePath('/journal');
    revalidatePath(`/journal/${post.slug}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/');
    await pingSearchConsoleSitemap();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
