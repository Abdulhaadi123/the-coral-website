import React from 'react';
import Link from 'next/link';
import { getPublishedBlogPosts } from '@/lib/blog';
import { JournalCardGrid } from '@/components/JournalCardGrid';

export async function JournalSection() {
  const posts = await getPublishedBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="w-full bg-[#F9FAFB] py-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%]">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          {/* Section Title with Gradient Branding */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827]" style={{ lineHeight: '1.10' }}>
            <span className="text-[#111827]">The Coral Room</span>
            <span className="text-[#111827]"> : Journal</span>
          </h2>

          {/* View All Posts Button */}
          <Link href="/journal" className="px-6 py-2.5 rounded-full border border-gray-400 text-gray-700 hover:bg-[#111827] hover:text-white hover:border-[#111827] text-xs sm:text-sm font-semibold transition-all duration-300">
            View all posts
          </Link>
        </div>

        {/* 3 Journal Cards — one at a time on mobile (matches testimonials), all 3 on desktop */}
        <JournalCardGrid posts={posts} />

      </div>
    </section>
  );
}

export default JournalSection;
