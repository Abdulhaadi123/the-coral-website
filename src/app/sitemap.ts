import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sitemap';

// Rebuilt on every request so new content shows up without a redeploy.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return entries.map((entry) => ({
    url: entry.url,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
  }));
}
