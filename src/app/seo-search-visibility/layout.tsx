import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/seo-search-visibility');
  return { title: seo.title, description: seo.description };
}

export default function SeoSearchVisibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
