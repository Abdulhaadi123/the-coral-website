import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET all projects
export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create project
export async function POST(req: NextRequest) {
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

    if (!title || !slug || !category || !image) {
      return NextResponse.json(
        { error: 'Title, slug, category, and small thumbnail image are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        category: category.trim(),
        topBadge: topBadge ? topBadge.trim() : category.trim(),
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        image: image.trim(),
        detailImage: detailImage ? detailImage.trim() : null,
        bg: bg ? bg.trim() : '#1a1a1a',
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });

    // Revalidate frontend paths for instantaneous live updates
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath('/');

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
