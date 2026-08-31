import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET all testimonials
export async function GET(req: NextRequest) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST create testimonial
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, role, quote, avatar, logo, logoWidth, logoHeight, rating, featured, order } = data;

    if (!name || !role || !quote) {
      return NextResponse.json(
        { error: 'Client Name, Role, and Quote are required' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        quote: quote.trim(),
        avatar: avatar ? avatar.trim() : null,
        logo: logo ? logo.trim() : null,
        logoWidth: Number(logoWidth) || 0,
        logoHeight: Number(logoHeight) || 0,
        rating: Number(rating) || 5,
        featured: featured !== undefined ? Boolean(featured) : true,
        order: Number(order) || 0,
      },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}
