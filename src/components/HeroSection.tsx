'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/Animated';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 flex flex-col items-start">
      <FadeIn direction="up">
        {/* Main Headline — exact 2 lines with refined Figma sizing */}
        <h1 className="font-semibold tracking-tight text-[#111827] leading-[1.18] text-3xl sm:text-4xl md:text-5xl lg:text-[52px]">
          <span className="block whitespace-nowrap">
            Digital experiences built to be
          </span>
          <span
            className="block whitespace-nowrap"
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
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
          We help ambitious brands turn scattered clicks into customers through sharper
          identity, smarter websites, and performance-led marketing.
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <Link href="/book-a-call" className="btn-hover-gradient group px-7 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm sm:text-base inline-flex items-center gap-3 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95">
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
};

export default HeroSection;
