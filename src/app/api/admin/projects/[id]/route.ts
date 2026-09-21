import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess } from '@/lib/access';
import { shouldHidePakistanOnly } from '@/lib/geo';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET single project by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { videos: { orderBy: { order: 'asc' } } },
    });

    // A Pakistan-only project simply doesn't exist for visitors abroad.
    if (!project || (project.pakistanOnly && (await shouldHidePakistanOnly()))) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT / PATCH update project by id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('projects');
    if (denied) return denied;

    const data = await req.json();
    const {
      title,
      slug,
      category,
      topBadge,
      tags,
      image,
      detailImage,
      videos,
      bg,
      featured,
      pakistanOnly,
      order,
    } = data;

    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check slug clash with another project
    if (slug && slug.trim().toLowerCase() !== existingProject.slug) {
      const clash = await prisma.project.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });
      if (clash && clash.id !== params.id) {
        return NextResponse.json({ error: 'Slug is already used by another project' }, { status: 400 });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: params.id },
        data: {
          ...(title && { title: title.trim() }),
          ...(slug && { slug: slug.trim().toLowerCase() }),
          ...(category && { category: category.trim() }),
          topBadge: topBadge !== undefined ? topBadge.trim() : existingProject.topBadge,
          tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : existingProject.tags,
          ...(image && { image: image.trim() }),
          detailImage: detailImage !== undefined ? (detailImage ? detailImage.trim() : null) : existingProject.detailImage,
          ...(bg && { bg: bg.trim() }),
          ...(featured !== undefined && { featured: Boolean(featured) }),
          ...(pakistanOnly !== undefined && { pakistanOnly: Boolean(pakistanOnly) }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });

      // Videos are replaced wholesale when included — simplest way to keep
      // titles, URLs, and order in sync with whatever the admin submitted.
      if (Array.isArray(videos)) {
        await tx.projectVideo.deleteMany({ where: { projectId: params.id } });
        if (videos.length > 0) {
          await tx.projectVideo.createMany({
            data: videos.map((v: any, i: number) => ({
              projectId: params.id,
              url: String(v.url).trim(),
              title: String(v.title).trim(),
              order: Number(v.order ?? i),
            })),
          });
        }
      }

      return tx.project.findUniqueOrThrow({
        where: { id: params.id },
        include: { videos: { orderBy: { order: 'asc' } } },
      });
    });

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${updated.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('projects');
    if (denied) return denied;

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
