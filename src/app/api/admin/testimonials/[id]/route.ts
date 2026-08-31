import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET single testimonial
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT / PATCH update testimonial
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, role, quote, avatar, logo, logoWidth, logoHeight, rating, featured, order } = data;

    const existing = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(role && { role: role.trim() }),
        ...(quote && { quote: quote.trim() }),
        avatar: avatar !== undefined ? (avatar ? avatar.trim() : null) : existing.avatar,
        logo: logo !== undefined ? (logo ? logo.trim() : null) : existing.logo,
        ...(logoWidth !== undefined && { logoWidth: Number(logoWidth) }),
        ...(logoHeight !== undefined && { logoHeight: Number(logoHeight) }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: error.message || 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
