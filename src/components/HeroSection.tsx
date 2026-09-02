'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/Animated';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 flex flex-col items-start overflow-x-hidden">
      <FadeIn direction="up">
        {/* Main Headline — exact Figma 2 lines with spacious leading */}
        <h1 className="font-semibold tracking-tight text-[#111827] text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px]" style={{ lineHeight: '1.06' }}>
          {/* No forced nowrap: at these sizes the first line exceeds the content
              box below xl, so it is allowed to wrap rather than overflow. */}
          <span className="block">
            Digital experiences built to be
          </span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(90deg, #467923 0%, #A7F076 53%, #00C0E8 97%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            seen, trusted, and chosen
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-7 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
          We help ambitious brands turn scattered clicks into customers through sharper
          identity, smarter websites, and performance-led marketing.
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <Link href="/book-a-call" className="btn-hover-gradient group px-7 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm sm:text-base inline-flex items-center gap-3 hover:border-transparent transition-all duration-300 shadow-sm hover:scale-105 active:scale-95">
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
};

export default HeroSection;
