import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog';
import { getPageSeo } from '@/lib/seo';
import JournalPageClient from './JournalPageClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/journal');
  return { title: seo.title, description: seo.description };
}

export default async function JournalPage() {
  const posts = await getPublishedBlogPosts();
  return <JournalPageClient posts={posts} />;
}
