import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/fourth-dimension-framework');
  return { title: seo.title, description: seo.description };
}

export default function FourthDimensionFrameworkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
