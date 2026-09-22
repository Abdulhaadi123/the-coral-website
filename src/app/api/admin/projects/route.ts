import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess } from '@/lib/access';
import { shouldHidePakistanOnly } from '@/lib/geo';
import { revalidatePath } from 'next/cache';

// The answer depends on who is asking (Pakistan-only projects are hidden from
// visitors abroad), so it must never be cached or prerendered.
export const dynamic = 'force-dynamic';

// GET all projects — Pakistan-only ones are left out for visitors outside Pakistan
export async function GET(req: NextRequest) {
  try {
    const hidePakistanOnly = await shouldHidePakistanOnly();
    const projects = await prisma.project.findMany({
      where: hidePakistanOnly ? { pakistanOnly: false } : undefined,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        videos: { orderBy: { order: 'asc' } },
        detailImages: { orderBy: { order: 'asc' } },
      },
    });
    // `restricted` tells the portfolio page an empty list is deliberate, so it
    // doesn't fall back to its built-in sample projects.
    return NextResponse.json(
      { success: true, projects, restricted: hidePakistanOnly },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create project
export async function POST(req: NextRequest) {
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
      detailImages,
      videos,
      bg,
      featured,
      pakistanOnly,
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
        bg: bg ? bg.trim() : '#1a1a1a',
        featured: Boolean(featured),
        pakistanOnly: Boolean(pakistanOnly),
        order: Number(order) || 0,
        videos: Array.isArray(videos) && videos.length > 0
          ? {
              create: videos.map((v: any, i: number) => ({
                url: String(v.url).trim(),
                title: String(v.title).trim(),
                order: Number(v.order ?? i),
              })),
            }
          : undefined,
        detailImages: Array.isArray(detailImages) && detailImages.length > 0
          ? {
              create: detailImages.map((d: any, i: number) => ({
                url: String(d.url).trim(),
                width: Number(d.width),
                height: Number(d.height),
                order: Number(d.order ?? i),
              })),
            }
          : undefined,
      },
      include: {
        videos: { orderBy: { order: 'asc' } },
        detailImages: { orderBy: { order: 'asc' } },
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
