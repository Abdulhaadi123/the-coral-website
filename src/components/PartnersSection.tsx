'use client';

import React from 'react';
import Image from 'next/image';
import { FadeIn } from '@/components/Animated';

const partners = [
  { name: 'ELOVIRA', src: '/images/partners/elovira.webp', width: 140, height: 84 },
  { name: 'Holix', src: '/images/partners/holix.webp', width: 130, height: 78 },
  { name: 'ASCENT', src: '/images/partners/ascent.webp', width: 110, height: 84 },
  { name: 'MOCHAE', src: '/images/partners/mochae.webp', width: 120, height: 84 },
  { name: 'Crewtix', src: '/images/partners/crewtix.webp', width: 140, height: 60 },
  { name: 'SPACE™', src: '/images/partners/space.webp', width: 150, height: 60 },
  { name: 'Ronin', src: '/images/partners/ronin.webp', width: 130, height: 60 },
  { name: 'Evee', src: '/images/partners/evee.webp', width: 130, height: 60 },
  { name: 'The Vertical', src: '/images/partners/the-vertical.webp', width: 140, height: 60 },
  { name: 'Nimertech', src: '/images/partners/nimertech.webp', width: 140, height: 60 },
  { name: 'Noura', src: '/images/partners/noura.webp', width: 130, height: 60 },
  { name: 'Dexterz', src: '/images/partners/dexterz.webp', width: 130, height: 60 },
  { name: 'Finora', src: '/images/partners/finora.webp', width: 130, height: 60 },
  { name: 'Finlo', src: '/images/partners/finlo.webp', width: 130, height: 60 },
  { name: 'Liviq', src: '/images/partners/liviq.webp', width: 130, height: 60 },
];

// Duplicate for seamless infinite loop
const allPartners = [...partners, ...partners];

export const PartnersSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-14 pb-0">
      {/* Heading — reduced side padding */}
      <FadeIn direction="up" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 text-gray-700 text-xs font-semibold mb-5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9FE66F] animate-pulse"></span>
          <span>Makes an Impact</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold text-[#111827] leading-[1.18] max-w-3xl">
          Our trusted partners who collaborate with us to create meaningful digital experiences
        </h2>
      </FadeIn>

      {/* Full-bleed green marquee strip — no rounded corners, no side padding */}
      <div
        className="w-full py-6 sm:py-8 overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #85E868 0%, #4BD896 50%, #32CEC6 100%)' }}
      >
        <div className="flex items-center gap-16 sm:gap-20 animate-marquee whitespace-nowrap pr-16 sm:pr-20">
          {allPartners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="inline-flex items-center justify-center shrink-0 hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-5 sm:h-7 w-auto max-w-[90px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
