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

    // If any marketing route from SEO_ROUTES is missing from the database (e.g. newly added /privacy-policy),
    // automatically create it so admins can immediately view and edit it in /admin/seo.
    const existingPaths = new Set(rows.map((r) => r.path));
    const missing = SEO_ROUTES.filter((r) => !existingPaths.has(r.path));
    if (missing.length > 0) {
      for (const m of missing) {
        try {
          const created = await prisma.pageSeo.create({
            data: { path: m.path, label: m.label, title: m.title, description: m.description },
          });
          rows.push(created);
        } catch (e) {
          // If concurrent request created it or DB error, continue safely
        }
      }
    }

    const order = SEO_ROUTES.map((r) => r.path);
    const pages = [...rows].sort((a, b) => order.indexOf(a.path) - order.indexOf(b.path));
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error('Error fetching page SEO:', error);
    return NextResponse.json({ error: 'Failed to fetch page SEO' }, { status: 500 });
  }
}
