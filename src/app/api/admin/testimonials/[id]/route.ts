import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { CACHE_TAGS } from '@/lib/publicData';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET single testimonial — admin screens only
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

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
    const denied = await checkAccess('testimonials');
    if (denied) return denied;

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

    revalidateTag(CACHE_TAGS.testimonials);
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
    const denied = await checkAccess('testimonials');
    if (denied) return denied;

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    revalidateTag(CACHE_TAGS.testimonials);
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
