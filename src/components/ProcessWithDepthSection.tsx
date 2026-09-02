'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

export const ProcessWithDepthSection: React.FC = () => {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Inner wrapper — exact original min-h and container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative min-h-0 lg:min-h-[560px] flex flex-col lg:flex-row items-center justify-between gap-10 py-10 lg:py-14">

        {/* ── LEFT: exact original text + CTAs shape ── */}
        <FadeIn
          direction="up"
          className="relative z-10 w-full lg:w-[54%] xl:w-[56%] flex flex-col justify-center items-start pr-0 lg:pr-6"
        >
          {/* Heading — exact original 2 lines & size */}
          <h2
            className="font-semibold text-[#111827] tracking-tight max-w-none text-2xl sm:text-3xl lg:text-[42px]"
            style={{ lineHeight: '1.10' }}
          >
            Behind every digital brand that grows is a{' '}
            <span className="bg-gradient-to-r from-[#9FE66F] to-[#32CEC6] bg-clip-text text-transparent">
              process with depth
            </span>
          </h2>

          {/* Paragraph 1 — exact original */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-700 leading-relaxed font-medium max-w-lg">
            Our Fourth Dimension™ framework brings strategy, brand thinking, development, and performance
            into one clear way of working.
          </p>

          {/* Paragraph 2 — exact original */}
          <p className="mt-4 text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-lg">
            Before we create anything, we study what matters: your market, your audience, your offer,
            your customer journey, and the gaps holding growth back. Then we turn that clarity into digital
            work built to look sharp, function smoothly, and move people closer to action.
          </p>

          {/* CTAs — exact original */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link
              href="/fourth-dimension-framework"
              className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center sm:justify-start gap-3 hover:border-transparent hover:text-white transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 text-center sm:text-left"
            >
              <span>Learn more about Fourth Dimension™</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/book-a-call"
              className="group shrink-0 px-5 sm:px-6 py-3.5 rounded-full border border-transparent hover:border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center sm:justify-start gap-3 transition-all duration-300 whitespace-normal sm:whitespace-nowrap hover:scale-105 active:scale-95 text-center sm:text-left"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* ── RIGHT: Video Card (larger scale, 16:9 native aspect ratio, 0% crop) ── */}
        <ScaleIn
          delay={0.15}
          className="w-full lg:w-[50%] xl:w-[52%] flex items-center justify-center z-10 shrink-0"
        >
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100/80 lg:scale-105 origin-center lg:origin-right">
            <video
              src={assetUrl('/ribbon-video.mp4')}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </ScaleIn>

      </div>
    </section>
  );
};

export default ProcessWithDepthSection;

