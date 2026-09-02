import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  IconStrategyChart,
  IconVerifiedBadge,
  IconGlobalTeam,
  IconSmileyFace,
} from '@/components/icons/Icons';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 text-[#111827] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">

        {/* Title & Subtitle */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827] mb-3" style={{ lineHeight: '1.10' }}>
          Why Choose The Coral Room?
        </h2>
        <p className="text-base sm:text-lg text-gray-700 font-medium mb-8 sm:mb-16">
          One team. Clear direction. Better digital growth
        </p>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 w-full mb-8 sm:mb-16 text-center">

          {/* Feature 1 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 mb-6 text-[#111827] flex items-center justify-center">
              <IconStrategyChart />
            </div>
            <h3 className="text-lg font-semibold mb-2">Strategy-led from day one</h3>
            <p className="text-xs sm:text-sm text-gray-700 max-w-xs">
              Every project starts with clarity, not guesswork.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 mb-6 text-[#111827] flex items-center justify-center">
              <IconVerifiedBadge />
            </div>
            <h3 className="text-lg font-semibold mb-2">Brand, web, and marketing in one place</h3>
            <p className="text-xs sm:text-sm text-gray-700 max-w-xs">
              No scattered teams. No broken handovers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 mb-6 text-[#111827] flex items-center justify-center">
              <IconGlobalTeam />
            </div>
            <h3 className="text-lg font-semibold mb-2">Global delivery, fast communication</h3>
            <p className="text-xs sm:text-sm text-gray-700 max-w-xs">
              Teams in the US, Canada, and Pakistan.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center p-4">
            <div className="w-14 h-14 mb-6 text-[#111827] flex items-center justify-center">
              <IconSmileyFace />
            </div>
            <h3 className="text-lg font-semibold mb-2">Trusted by growing clients</h3>
            <p className="text-xs sm:text-sm text-gray-700 max-w-xs">
              Helping brands improve how they look, sell, and scale.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Link href="/book-a-call" className="group px-7 py-3.5 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 w-full sm:w-auto">
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href="/fourth-dimension-framework" className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-[#111827] group border border-transparent hover:border-[#111827] px-5 py-3 rounded-full transition-all duration-300 w-full sm:w-auto">
            <span>Explore Our Services</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;
