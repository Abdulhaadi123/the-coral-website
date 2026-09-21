import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { SEO_ROUTES } from '@/lib/seo';
import { checkAccess } from '@/lib/access';

export const dynamic = 'force-dynamic';

// GET all page SEO rows, ordered to match the site's route list
export async function GET(req: NextRequest) {
  try {
    const denied = await checkAccess('seo');
    if (denied) return denied;

    const rows = await prisma.pageSeo.findMany();
    const order = SEO_ROUTES.map((r) => r.path);
    const pages = [...rows].sort((a, b) => order.indexOf(a.path) - order.indexOf(b.path));
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error('Error fetching page SEO:', error);
    return NextResponse.json({ error: 'Failed to fetch page SEO' }, { status: 500 });
  }
}
