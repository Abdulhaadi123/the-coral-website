'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

export const ProcessWithDepthSection: React.FC = () => {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Inner wrapper — exact original min-h and container */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 min-h-0 lg:min-h-[420px] flex flex-col lg:flex-row items-center justify-between gap-10 py-10 lg:py-12">

        {/* ── LEFT: exact original text + CTAs shape ── */}
        <FadeIn
          direction="up"
          className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center items-start pr-0 lg:pr-6"
        >
          {/* Heading — exact original 2 lines & size */}
          <h2
            className="font-semibold text-[#111827] tracking-tight max-w-none text-2xl sm:text-3xl lg:text-[30px]"
            style={{ lineHeight: '1.10' }}
          >
            Behind every digital brand that grows is a{' '}
            <span className="bg-gradient-to-r from-[#9FE66F] to-[#32CEC6] bg-clip-text text-transparent">
              process with depth
            </span>
          </h2>

          {/* Paragraph 1 — exact original */}
          <p className="mt-4 text-[15px] lg:text-base text-gray-700 leading-relaxed font-medium max-w-lg">
            Our Fourth Dimension™ framework brings strategy, brand thinking, development, and performance
            into one clear way of working.
          </p>

          {/* Paragraph 2 — exact original */}
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-md">
            Before we create anything, we study what matters: your market, your audience, your offer,
            your customer journey, and the gaps holding growth back. Then we turn that clarity into digital
            work built to look sharp, function smoothly, and move people closer to action.
          </p>

          {/* CTAs — exact original */}
          <div className="mt-5 flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              href="/fourth-dimension-framework"
              className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center sm:justify-start gap-3 hover:border-transparent transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 text-center sm:text-left"
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


      </div>

      {/*
        Artwork — full bleed from lg up, matching the Figma comp: pinned to the
        section's own edges so it meets the bands above and below and runs off the
        right of the viewport. It is a direct child of <section> for that reason;
        inside the max-w-[1600px] wrapper, right-0 would stop at the content column.

        Below lg it drops back into normal flow beneath the text as a 16:9 block.
        object-contain, not cover. The GIF is 16:9 (1.778) but the column is far
        squarer, so cover would have to crop ~35% of the width — the column would
        need to be 1143px, 79% of a 1440 viewport, to crop nothing. contain shows
        all of it and letterboxes ~111px top and bottom, which is invisible here
        because the GIF's background and this section are both pure white.
      */}
      <FadeIn
        direction="none"
        delay={0.15}
        className="w-full px-5 sm:px-8 pb-10 lg:p-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-auto lg:aspect-[1138/640] lg:z-0 lg:translate-x-16"
      >
        <div className="relative w-full aspect-video lg:aspect-auto lg:h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl('/process-depth.gif')}
            alt="The Fourth Dimension process, visualised"
            className="w-full h-full object-contain lg:object-cover object-center"
          />
        </div>
      </FadeIn>
    </section>
  );
};

export default ProcessWithDepthSection;

