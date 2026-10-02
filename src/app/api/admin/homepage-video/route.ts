import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { CACHE_TAGS, HOMEPAGE_VIDEO_SETTING_KEY } from '@/lib/publicData';

// Admin data: never cached or prerendered.
export const dynamic = 'force-dynamic';

// GET the current override (or null = using the built-in default) — any signed-in admin.
export async function GET() {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const row = await prisma.setting.findUnique({ where: { key: HOMEPAGE_VIDEO_SETTING_KEY } });
    return NextResponse.json({ success: true, url: row?.value || null }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error: any) {
    console.error('Error reading homepage video setting:', error);
    return NextResponse.json({ error: 'Failed to load the current video' }, { status: 500 });
  }
}

// PUT a newly-uploaded video in as the homepage banner.
export async function PUT(req: NextRequest) {
  try {
    const denied = await checkAccess('homepage');
    if (denied) return denied;

    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing video url' }, { status: 400 });
    }

    await prisma.setting.upsert({
      where: { key: HOMEPAGE_VIDEO_SETTING_KEY },
      create: { key: HOMEPAGE_VIDEO_SETTING_KEY, value: url },
      update: { value: url },
    });

    revalidateTag(CACHE_TAGS.homepageVideo);
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error saving homepage video setting:', error);
    return NextResponse.json({ error: error.message || 'Failed to save the video' }, { status: 500 });
  }
}

// DELETE the override — the homepage goes back to its built-in default video.
export async function DELETE() {
  try {
    const denied = await checkAccess('homepage');
    if (denied) return denied;

    await prisma.setting.deleteMany({ where: { key: HOMEPAGE_VIDEO_SETTING_KEY } });

    revalidateTag(CACHE_TAGS.homepageVideo);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing homepage video setting:', error);
    return NextResponse.json({ error: error.message || 'Failed to remove the video' }, { status: 500 });
  }
}
