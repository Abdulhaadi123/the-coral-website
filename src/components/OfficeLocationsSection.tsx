'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { FadeIn } from '@/components/Animated';

/**
 * Client brief item 09. Reference (gogradglobal.com/about) for the interaction
 * pattern only, per the brief — a tab per office, a map for whichever tab is
 * active, the address underneath — rebuilt in the site's own design language
 * (no colours, type, or copy carried over from the reference).
 *
 * Real addresses aren't in hand yet ("copy the pattern for now, content
 * later"), and a specific street address is a factual claim, not filler text
 * — showing a plausible-looking but wrong one would be a real mistake for a
 * live business site, unlike a stock name or photo. So both offices render as
 * an honest "address coming soon" placeholder rather than a guessed pin.
 *
 * To go live: fill in `address` (and ideally `mapQuery`, e.g. the exact
 * address or a Google Maps place name) for each entry below — once `mapQuery`
 * is set, swap the placeholder panel for a `<iframe src={mapEmbedSrc(mapQuery)}>`
 * (helper included below, no API key needed for the basic embed).
 */
interface Office {
  label: string;
  address: string | null;
  mapQuery: string | null;
}

const OFFICES: Office[] = [
  { label: 'Pakistan Office', address: null, mapQuery: null },
  { label: 'International Office', address: null, mapQuery: null },
];

function mapEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export const OfficeLocationsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const office = OFFICES[active];

  return (
    <section className="w-full bg-[#F9FAFB] py-14 sm:py-20">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%]">
        <FadeIn direction="up" className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827]" style={{ lineHeight: '1.1' }}>
            Our <span className="text-[#78B249]">Offices</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Where to find us, wherever you're reaching out from.
          </p>
        </FadeIn>

        {/* Tabs — one per office */}
        {OFFICES.length > 1 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {OFFICES.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  i === active
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-[#111827] border border-gray-200'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        <FadeIn key={active} direction="up" className="max-w-4xl mx-auto">
          <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-gray-200 bg-white shadow-sm">
            {office.mapQuery ? (
              <iframe
                src={mapEmbedSrc(office.mapQuery)}
                className="w-full aspect-[16/9] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map — ${office.label}`}
              />
            ) : (
              <div className="w-full aspect-[16/9] bg-gray-100 flex flex-col items-center justify-center gap-3 text-center px-6">
                <MapPin className="w-10 h-10 text-gray-300" />
                <p className="text-sm text-gray-400 font-medium">Map coming soon</p>
              </div>
            )}
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#78B249] shrink-0" />
              <p className="text-sm sm:text-base text-[#111827] font-medium">
                {office.address ?? 'Address coming soon'}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default OfficeLocationsSection;
