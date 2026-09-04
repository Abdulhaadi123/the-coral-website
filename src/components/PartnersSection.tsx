'use client';

import React from 'react';
import Image from 'next/image';
import { FadeIn } from '@/components/Animated';

const partners = [
  { name: 'ELOVIRA',      src: '/images/partners/elovira.webp',      width: 183, height: 110 },
  { name: 'Holix',        src: '/images/partners/holix.webp',        width: 183, height: 110 },
  { name: 'ASCENT',       src: '/images/partners/ascent.webp',       width: 183, height: 110 },
  { name: 'MOCHAE',       src: '/images/partners/mochae.webp',       width: 183, height: 110 },
  { name: 'Crewtix',      src: '/images/partners/crewtix.webp',      width: 183, height: 110 },
  { name: 'SPACE',        src: '/images/partners/space.webp',        width: 183, height: 110 },
  { name: 'Nimertech',    src: '/images/partners/nimertech.webp',    width: 183, height: 110 },
  { name: 'The Vertical', src: '/images/partners/the-vertical.webp', width: 183, height: 110 },
  { name: 'Evee',         src: '/images/partners/evee.webp',         width: 183, height: 110 },
  { name: 'Finlo',        src: '/images/partners/finlo.webp',        width: 183, height: 110 },
  { name: 'Finora',       src: '/images/partners/finora.webp',       width: 183, height: 110 },
  { name: 'Dexterz',      src: '/images/partners/dexterz.webp',      width: 183, height: 110 },
  { name: 'Noura',        src: '/images/partners/noura.webp',        width: 183, height: 110 },
  { name: 'Ronin',        src: '/images/partners/ronin.webp',        width: 183, height: 110 },
];

// Duplicate for seamless infinite loop
const allPartners = [...partners, ...partners];

export const PartnersSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-16 sm:pt-20 pb-0">
      {/* Heading — aligned with header container */}
      <FadeIn direction="up" className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 mb-20 sm:mb-28">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 text-gray-700 text-xs font-semibold mb-5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9FE66F] animate-pulse"></span>
          <span>Makes an Impact</span>
        </div>

        <h2
          className="font-semibold text-[#111827] max-w-none"
          style={{ lineHeight: '1.10', fontSize: 'clamp(24px, 3.5vw, 46px)' }}
        >
          Our trusted partners who collaborate with<br />us to create meaningful digital experiences
        </h2>
      </FadeIn>

      {/* Full-bleed green marquee strip — original gradient */}
      <div
        className="w-full py-10 sm:py-14 lg:py-16 overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #85E868 0%, #4BD896 50%, #32CEC6 100%)' }}
      >
        <div className="flex items-center gap-14 sm:gap-16 lg:gap-20 animate-marquee whitespace-nowrap pr-14 sm:pr-16 lg:pr-20">
          {allPartners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="inline-flex items-center justify-center shrink-0 h-12 sm:h-16 lg:h-20 hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-full w-auto max-w-[200px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
