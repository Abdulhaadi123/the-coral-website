import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET all partners
export async function GET(req: NextRequest) {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ success: true, partners });
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST create partner
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, logo, width, height, active, order } = data;

    if (!name || !logo) {
      return NextResponse.json(
        { error: 'Partner Name and Logo are required' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        logo: logo.trim(),
        width: Number(width) || 183,
        height: Number(height) || 110,
        active: active !== undefined ? Boolean(active) : true,
        order: Number(order) || 0,
      },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 });
  }
}
