'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/Animated';

export const ProcessWithDepthSection: React.FC = () => {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Inner wrapper — controls height of section, ribbon fills it fully */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[480px] lg:min-h-[560px] flex flex-col lg:flex-row items-stretch">

        {/* ── LEFT: text + CTAs ── */}
        <FadeIn
          direction="up"
          className="relative z-10 w-full lg:w-[52%] flex flex-col justify-center items-start py-14 lg:py-16 pr-0 lg:pr-10"
        >
          {/* Heading — matches Figma 2 lines */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-semibold text-[#111827] leading-[1.2] tracking-tight">
            Behind every digital brand that grows is a{' '}
            <span className="bg-gradient-to-r from-[#9FE66F] to-[#32CEC6] bg-clip-text text-transparent">
              process with depth
            </span>
          </h2>

          {/* Paragraph 1 — larger, medium weight */}
          <p className="mt-8 text-base sm:text-lg text-gray-700 leading-relaxed font-medium max-w-lg">
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
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/fourth-dimension-framework"
              className="group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center gap-2.5 hover:bg-gray-900 hover:text-white transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              <span>Learn more about Fourth Dimension™</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/book-a-call"
              className="group inline-flex items-center gap-2 text-gray-900 font-semibold text-sm whitespace-nowrap hover:opacity-70 transition-opacity shrink-0"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="w-3.5 h-3.5" />
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
