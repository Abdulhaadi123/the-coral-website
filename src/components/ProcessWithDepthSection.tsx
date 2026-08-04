'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/Animated';

export const ProcessWithDepthSection: React.FC = () => {
  return (
    <section className="w-full bg-white relative overflow-x-clip py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative min-h-[520px] lg:min-h-[600px] flex flex-col lg:flex-row items-center">

        {/* Left: text + CTAs */}
        <FadeIn direction="up" className="relative z-10 w-full lg:w-[55%] flex flex-col items-start pr-0 lg:pr-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-[1.15] tracking-tight">
            Behind every digital brand that grows is a{' '}
            <span className="bg-gradient-to-r from-[#9FE66F] to-[#32CEC6] bg-clip-text text-transparent">
              process with depth
            </span>
          </h2>

          <p className="mt-7 text-base sm:text-lg text-gray-700 leading-relaxed font-medium max-w-xl">
            Our Fourth Dimension™ framework brings strategy, brand thinking, development, and performance
            into one clear way of working.
          </p>

          <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
            Before we create anything, we study what matters: your market, your audience, your offer,
            your customer journey, and the gaps holding growth back. Then we turn that clarity into digital
            work built to look sharp, function smoothly, and move people closer to action.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/fourth-dimension-framework"
              className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm flex items-center gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <span>Learn more about Fourth Dimension™</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/book-a-call"
              className="group inline-flex items-center gap-2 text-gray-900 font-semibold text-sm whitespace-nowrap hover:opacity-70 transition-opacity shrink-0"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* Right: ribbon */}
        <ScaleIn delay={0.2} className="pointer-events-none mt-12 lg:mt-0 relative lg:absolute lg:right-[-4%] xl:right-[-8%] lg:top-0 lg:bottom-[-10%] w-full lg:w-[52%] h-[320px] sm:h-[400px] lg:h-auto">
          <Image
            src="/images/process-ribbon.webp"
            alt="Fourth Dimension process - 3D fluid ribbon visual"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-contain object-right lg:object-right-center hover:scale-[1.02] transition-transform duration-700"
          />
        </ScaleIn>
      </div>
    </section>
  );
};

export default ProcessWithDepthSection;
