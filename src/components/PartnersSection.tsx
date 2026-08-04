'use client';

import React from 'react';
import Image from 'next/image';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';

const partners = [
  { name: 'ELOVIRA', src: '/images/partners/elovira.webp', width: 140, height: 84 },
  { name: 'Holix', src: '/images/partners/holix.webp', width: 130, height: 78 },
  { name: 'ASCENT', src: '/images/partners/ascent.webp', width: 110, height: 84 },
  { name: 'MOCHAE', src: '/images/partners/mochae.webp', width: 120, height: 84 },
  { name: 'Crewtix', src: '/images/partners/crewtix.webp', width: 140, height: 60 },
  { name: 'SPACE™', src: '/images/partners/space.webp', width: 150, height: 60 },
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="w-full pt-16 pb-0 bg-white">
      <FadeIn direction="up" className="max-w-6xl mx-auto px-6 sm:px-12 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 text-gray-700 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9FE66F] animate-pulse"></span>
          <span>Makes an Impact</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#111827] leading-[1.18] max-w-3xl">
          Our trusted partners who collaborate with us to create meaningful digital experiences
        </h2>
      </FadeIn>

      {/* Gradient Logo Banner */}
      <div className="w-full py-7 sm:py-9 bg-gradient-to-r from-[#85E868] via-[#4BD896] to-[#32CEC6]">
        <StaggerContainer className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-6">
          {partners.map((partner) => (
            <StaggerItem
              key={partner.name}
              className="relative flex items-center justify-center h-12 sm:h-14 shrink-0 hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-10 sm:h-12 w-auto max-w-[140px] object-contain"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default PartnersSection;
