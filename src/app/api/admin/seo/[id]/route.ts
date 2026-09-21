import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess } from '@/lib/access';
import { revalidatePath } from 'next/cache';

// PUT update a page's title/description by id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('seo');
    if (denied) return denied;

    const data = await req.json();
    const { title, description } = data;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const existing = await prisma.pageSeo.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const updated = await prisma.pageSeo.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        description: description.trim(),
      },
    });

    revalidatePath(existing.path);

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    console.error('Error updating page SEO:', error);
    return NextResponse.json({ error: error.message || 'Failed to update page SEO' }, { status: 500 });
  }
}
