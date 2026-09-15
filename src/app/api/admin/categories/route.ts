import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// GET all categories of a given type ("portfolio" | "blog"), default portfolio
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type') || 'portfolio';
    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create category
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const name = (data.name || '').trim();
    const type = data.type || 'portfolio';

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { name_type: { name, type } } });
    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 });
    }

    const maxOrder = await prisma.category.aggregate({ where: { type }, _max: { order: true } });

    const category = await prisma.category.create({
      data: {
        name,
        type,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
