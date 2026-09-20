import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Always read fresh — the footer must pick up admin changes without a redeploy.
export const dynamic = 'force-dynamic';

// GET active social links, in footer order (public)
export async function GET() {
  try {
    const rows = await prisma.socialLink.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    const links = rows.map((r) => ({ id: r.id, platform: r.platform, label: r.label, url: r.url }));
    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    console.error('Error fetching social links:', error);
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}
