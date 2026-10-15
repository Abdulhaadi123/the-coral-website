import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, getCurrentAdmin } from '@/lib/access';
import { hasPermission } from '@/lib/permissions';
import { parseScheduledAt, revalidateBlog } from '@/lib/blogPublishing';

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
      scheduledAt,
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

    // Scheduling rules:
    // 1) scheduledAt is a date: the post is scheduled (published = false) and its publish date is that moment.
    // 2) scheduledAt is null: the schedule is cleared.
    // 3) scheduledAt is not sent but published is explicitly true/false: the post is being published or
    //    set to draft by hand, so any schedule it carried is cleared (a draft must never be re-published
    //    by an old schedule).
    let finalScheduledAt: Date | null | undefined = undefined;
    let finalPublished = published !== undefined ? Boolean(published) : undefined;
    let finalPublishedAt = publishedAt ? new Date(publishedAt) : undefined;

    if (scheduledAt !== undefined) {
      if (scheduledAt) {
        const parsed = parseScheduledAt(scheduledAt);
        if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
        finalScheduledAt = parsed.date;
        finalPublished = false;
        finalPublishedAt = finalScheduledAt;
      } else {
        finalScheduledAt = null;
      }
    } else if (published !== undefined) {
      finalScheduledAt = null;
    }

    // Publishing a post that was scheduled ("publish now") leaves its publish date in the future;
    // a live post is dated no later than the moment it went live.
    if (finalPublished ?? existingPost.published) {
      const candidate = finalPublishedAt ?? existingPost.publishedAt;
      if (candidate.getTime() > Date.now()) finalPublishedAt = new Date();
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
        ...(finalPublished !== undefined && { published: finalPublished }),
        ...(finalScheduledAt !== undefined && { scheduledAt: finalScheduledAt }),
        ...(order !== undefined && { order: Number(order) }),
        ...(finalPublishedAt ? { publishedAt: finalPublishedAt } : {}),
      },
    });

    await revalidateBlog([existingPost.slug, updated.slug]);

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

    await revalidateBlog([post.slug]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
