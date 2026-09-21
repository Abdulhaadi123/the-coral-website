import { NextResponse } from 'next/server';
import { checkAccess } from '@/lib/access';
import { getSitemapEntries } from '@/lib/sitemap';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

// GET the URLs currently in sitemap.xml, for the admin "Sitemap" screen
export async function GET() {
  try {
    const denied = await checkAccess('sitemap');
    if (denied) return denied;

    const entries = await getSitemapEntries();
    return NextResponse.json({
      success: true,
      sitemapUrl: `${SITE_URL}/sitemap.xml`,
      robotsUrl: `${SITE_URL}/robots.txt`,
      entries,
    });
  } catch (error: any) {
    console.error('Error building sitemap preview:', error);
    return NextResponse.json({ error: 'Failed to load sitemap' }, { status: 500 });
  }
}
