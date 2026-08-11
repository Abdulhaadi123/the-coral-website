'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/Animated';

export const ProcessWithDepthSection: React.FC = () => {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Inner wrapper — controls height of section, ribbon fills it fully */}
      <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 relative min-h-0 lg:min-h-[560px] flex flex-col lg:flex-row items-stretch">

        {/* ── LEFT: text + CTAs ── */}
        <FadeIn
          direction="up"
          className="relative z-10 w-full lg:w-[65%] flex flex-col justify-center items-start py-10 lg:py-16 pr-0 lg:pr-16"
        >
          {/* Heading — exact Figma 2 lines */}
          <h2
            className="font-semibold text-[#111827] tracking-tight max-w-none text-2xl sm:text-3xl lg:text-[42px]"
            style={{ lineHeight: '1.10' }}
          >
            Behind every digital brand that<br className="hidden sm:inline" /> grows is a{' '}
            <span className="bg-gradient-to-r from-[#9FE66F] to-[#32CEC6] bg-clip-text text-transparent">
              process with depth
            </span>
          </h2>

          {/* Paragraph 1 — larger, medium weight */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-700 leading-relaxed font-medium max-w-lg">
            Our Fourth Dimension™ framework brings strategy, brand thinking, development, and performance
            into one clear way of working.
          </p>

          {/* Paragraph 2 — smaller, lighter */}
          <p className="mt-4 text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-lg">
            Before we create anything, we study what matters: your market, your audience, your offer,
            your customer journey, and the gaps holding growth back. Then we turn that clarity into digital
            work built to look sharp, function smoothly, and move people closer to action.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link
              href="/fourth-dimension-framework"
              className="group shrink-0 px-5 sm:px-6 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center sm:justify-start gap-3 hover:bg-white hover:text-black hover:border-gray-900 transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 text-center sm:text-left"
            >
              <span>Learn more about Fourth Dimension™</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/book-a-call"
              className="group shrink-0 px-5 sm:px-6 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center sm:justify-start gap-3 hover:bg-white hover:text-black hover:border-gray-900 transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 text-center sm:text-left"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* ── RIGHT: ribbon — absolute, fills full height, touches right edge ── */}
        <ScaleIn
          delay={0.15}
          className="pointer-events-none hidden lg:block lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[52%]"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/process-ribbon.webp"
              alt="Fourth Dimension process - 3D fluid ribbon visual"
              fill
              priority
              sizes="52vw"
              className="object-contain object-right-top"
            />
          </div>
        </ScaleIn>

        {/* Mobile ribbon — below text */}
        <div className="lg:hidden relative w-full h-[260px] sm:h-[320px] mt-4 mb-6">
          <Image
            src="/images/process-ribbon.webp"
            alt="Fourth Dimension process - 3D fluid ribbon visual"
            fill
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>

      </div>
    </section>
  );
};

export default ProcessWithDepthSection;
