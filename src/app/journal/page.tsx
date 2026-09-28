import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog';
import { getPageSeo } from '@/lib/seo';
import { getCategories } from '@/lib/publicData';
import JournalPageClient from './JournalPageClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/journal');
  return { title: seo.title, description: seo.description };
}

export default async function JournalPage() {
  const [posts, categories] = await Promise.all([getPublishedBlogPosts(), getCategories('blog')]);
  return <JournalPageClient posts={posts} categories={categories} />;
}
