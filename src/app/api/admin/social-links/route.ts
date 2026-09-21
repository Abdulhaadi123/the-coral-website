import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess } from '@/lib/access';
import { SOCIAL_PLATFORMS, normalizeSocialUrl, platformLabel } from '@/lib/social';

export const dynamic = 'force-dynamic';

// GET every social link, including hidden ones (admin)
export async function GET() {
  try {
    const denied = await checkAccess('social');
    if (denied) return denied;

    const links = await prisma.socialLink.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    console.error('Error fetching social links:', error);
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

// POST create a social link
export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess('social');
    if (denied) return denied;

    const data = await req.json();
    const platform = String(data.platform || '');

    if (!SOCIAL_PLATFORMS.some((p) => p.key === platform)) {
      return NextResponse.json({ error: 'Choose a valid platform' }, { status: 400 });
    }

    const url = normalizeSocialUrl(String(data.url || ''));
    if (!url) {
      return NextResponse.json(
        { error: 'Enter a valid link, e.g. https://www.youtube.com/@yourchannel' },
        { status: 400 }
      );
    }

    const label = String(data.label || '').trim() || (platform === 'other' ? new URL(url).hostname : platformLabel(platform));

    const maxOrder = await prisma.socialLink.aggregate({ _max: { order: true } });

    const link = await prisma.socialLink.create({
      data: {
        platform,
        label,
        url,
        active: data.active !== undefined ? Boolean(data.active) : true,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating social link:', error);
    return NextResponse.json({ error: error.message || 'Failed to create social link' }, { status: 500 });
  }
}
