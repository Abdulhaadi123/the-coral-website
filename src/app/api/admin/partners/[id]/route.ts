import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET single partner
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, partner });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 });
  }
}

// PUT update partner
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, logo, width, height, active, order } = data;

    const existing = await prisma.partner.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    const updated = await prisma.partner.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(logo && { logo: logo.trim() }),
        ...(width !== undefined && { width: Number(width) }),
        ...(height !== undefined && { height: Number(height) }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, partner: updated });
  } catch (error: any) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: error.message || 'Failed to update partner' }, { status: 500 });
  }
}

// DELETE partner
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.partner.delete({
      where: { id: params.id },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
