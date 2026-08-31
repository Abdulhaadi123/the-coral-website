import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET single project by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT / PATCH update project by id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      title,
      slug,
      category,
      topBadge,
      tags,
      image,
      detailImage,
      bg,
      featured,
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

    const updated = await prisma.project.update({
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
        ...(order !== undefined && { order: Number(order) }),
      },
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
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
