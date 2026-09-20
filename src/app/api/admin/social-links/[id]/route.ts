import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { SOCIAL_PLATFORMS, normalizeSocialUrl, platformLabel } from '@/lib/social';

export const dynamic = 'force-dynamic';

// PUT update a social link (platform / url / label / visibility / order)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
    }

    const data = await req.json();

    let platform = existing.platform;
    if (data.platform !== undefined) {
      platform = String(data.platform);
      if (!SOCIAL_PLATFORMS.some((p) => p.key === platform)) {
        return NextResponse.json({ error: 'Choose a valid platform' }, { status: 400 });
      }
    }

    let url = existing.url;
    if (data.url !== undefined) {
      const normalized = normalizeSocialUrl(String(data.url));
      if (!normalized) {
        return NextResponse.json(
          { error: 'Enter a valid link, e.g. https://www.youtube.com/@yourchannel' },
          { status: 400 }
        );
      }
      url = normalized;
    }

    let label = existing.label;
    if (data.label !== undefined || data.platform !== undefined) {
      label =
        String(data.label ?? '').trim() ||
        (platform === 'other' ? new URL(url).hostname : platformLabel(platform));
    }

    const link = await prisma.socialLink.update({
      where: { id: params.id },
      data: {
        platform,
        url,
        label,
        ...(data.active !== undefined && { active: Boolean(data.active) }),
        ...(data.order !== undefined && { order: Number(data.order) }),
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (error: any) {
    console.error('Error updating social link:', error);
    return NextResponse.json({ error: error.message || 'Failed to update social link' }, { status: 500 });
  }
}

// DELETE a social link
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
    }

    await prisma.socialLink.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting social link:', error);
    return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
  }
}
