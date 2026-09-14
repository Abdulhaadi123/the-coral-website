'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import type { PublicBlogPost } from '@/lib/blog';

export const JournalCardGrid: React.FC<{ posts: PublicBlogPost[] }> = ({ posts }) => {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? posts.length - 1 : i - 1));
  const next = () => setActive((i) => (i === posts.length - 1 ? 0 : i + 1));

  return (
    <>
      {/* Cards — mobile shows one at a time (matches testimonials), desktop shows all 3 side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post, idx) => (
          <Link
            key={post.id}
            href={`/journal/${post.slug}`}
            className={`${idx === active ? 'flex' : 'hidden md:flex'} bg-gray-100/70 rounded-2xl overflow-hidden flex-col justify-between hover:shadow-lg transition-all duration-300 group cursor-pointer`}
          >
            {/* Card Image */}
            <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
              <Image
                src={assetUrl(post.image)}
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

      {/* Dots + arrows — mobile only, desktop already shows all posts at once */}
      {posts.length > 1 && (
        <div className="mt-8 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            {posts.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to journal post ${i + 1}`}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-2.5 h-2.5 bg-[#111827]' : 'w-2 h-2 bg-[#111827]/35 hover:bg-[#111827]/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous journal post"
              className="w-11 h-11 rounded-full border border-[#111827]/40 text-[#111827] flex items-center justify-center hover:bg-[#111827] hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next journal post"
              className="w-11 h-11 rounded-full border border-[#111827]/40 text-[#111827] flex items-center justify-center hover:bg-[#111827] hover:text-white transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JournalCardGrid;
