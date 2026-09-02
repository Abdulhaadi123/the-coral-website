import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { blogPosts } from '@/app/journal/data';

export const JournalSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F9FAFB] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          {/* Section Title with Gradient Branding */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827]" style={{ lineHeight: '1.10' }}>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #5E9738 0%, #9FE66F 19%, #32CEC6 100%)' }}
            >
              The Coral Room
            </span>
            <span className="text-[#111827]"> : Journal</span>
          </h2>

          {/* View All Posts Button */}
          <Link href="/journal" className="px-6 py-2.5 rounded-full border border-gray-400 text-gray-700 hover:text-black hover:border-black text-xs sm:text-sm font-semibold transition-all duration-300">
            View all posts
          </Link>
        </div>

        {/* 3 Journal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <Link 
              key={post.id}
              href={`/journal/${post.slug}`}
              className="bg-gray-100/70 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group block cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  {/* Badge & Date */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-[11px] font-semibold">
                      {post.badge}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-[#111827] leading-snug mb-3 group-hover:text-[#21A0A3] transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {post.description}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 group-hover:text-[#21A0A3] group-hover:translate-x-1 transition-all duration-200">
                  <span>Read more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default JournalSection;

