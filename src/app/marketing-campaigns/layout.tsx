import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/marketing-campaigns');
  return { title: seo.title, description: seo.description };
}

export default function MarketingCampaignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
