import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { CACHE_TAGS } from '@/lib/publicData';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET all testimonials — admin screens only (the home page reads them on the server)
export async function GET(req: NextRequest) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

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
    const denied = await checkAccess('testimonials');
    if (denied) return denied;

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

    revalidateTag(CACHE_TAGS.testimonials);
    revalidatePath('/');

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}
