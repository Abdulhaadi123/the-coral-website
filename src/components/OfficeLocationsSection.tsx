'use client';

import React, { useState } from 'react';
import { MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/Animated';

/**
 * Client brief item 09. Reference (gogradglobal.com/about) for the interaction
 * pattern only, per the brief — pick an office, see it on a map, with its
 * address — rebuilt in the site's own design language (no colours, type, or
 * copy carried over from the reference).
 *
 * The addresses and phone numbers below are the ones the client supplied. The
 * map is Google's keyless embed, searched by `mapQuery`. To change an office,
 * edit its entry — the map, address, phone and directions link all follow from it.
 */
interface Office {
  /** Small tag above the heading. */
  label: string;
  /** Card heading. */
  region: string;
  address: string;
  /** Shown as written. */
  phone: string;
  /** Digits only, with country code, for the tel: link. */
  phoneHref: string;
  /** What Google Maps searches for — the map pin and the directions link. */
  mapQuery: string;
}

const OFFICES: Office[] = [
  {
    label: 'Pakistan Office',
    region: 'Lahore, Pakistan',
    address: '40-Broadway Commercial, Park View, Lahore, Pakistan',
    phone: '0311 4550300',
    phoneHref: '+923114550300',
    mapQuery: '40-Broadway Commercial, Park View, Lahore, Pakistan',
  },
  {
    label: 'International Office',
    region: 'New Jersey, USA',
    address: '412 E Washington Ave, Unit #1158, New Jersey 07882',
    phone: '+1 817 254 4144',
    phoneHref: '+18172544144',
    mapQuery: '412 E Washington Ave, Unit 1158, New Jersey 07882',
  },
];

function mapEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

function directionsHref(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
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
            Where to find us, wherever you&apos;re reaching out from.
          </p>
        </FadeIn>

        <FadeIn direction="up" className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-5 lg:gap-6 items-stretch">
            {/* Offices — click one to show it on the map */}
            <div className="flex flex-col gap-4">
              {OFFICES.map((o, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={o.label}
                    onClick={() => setActive(i)}
                    className={`flex-1 rounded-[24px] border p-6 sm:p-7 flex flex-col gap-5 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#111827] text-white border-[#111827] shadow-[0_24px_50px_rgba(17,24,39,0.2)]'
                        : 'bg-white text-[#111827] border-gray-200 hover:border-[#A7F176] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-2 ${
                            isActive ? 'text-[#A7F176]' : 'text-[#4C7F26]'
                          }`}
                        >
                          {o.label}
                        </p>
                        <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
                          <button
                            type="button"
                            onClick={() => setActive(i)}
                            aria-pressed={isActive}
                            className="text-left cursor-pointer"
                          >
                            {o.region}
                          </button>
                        </h3>
                      </div>
                      <span
                        aria-hidden
                        className={`mt-1 w-3 h-3 rounded-full shrink-0 transition-colors duration-300 ${
                          isActive ? 'bg-[#A7F176] shadow-[0_0_12px_#A7F176]' : 'bg-gray-300'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-3.5 text-sm sm:text-base">
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-[18px] h-[18px] mt-0.5 shrink-0 ${isActive ? 'text-[#A7F176]' : 'text-[#78B249]'}`} />
                        <p className={`leading-relaxed ${isActive ? 'text-white/90' : 'text-gray-700'}`}>{o.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#A7F176]' : 'text-[#78B249]'}`} />
                        <a
                          href={`tel:${o.phoneHref}`}
                          className={`font-medium transition-colors ${isActive ? 'hover:text-[#A7F176]' : 'text-gray-800 hover:text-[#4C7F26]'}`}
                        >
                          {o.phone}
                        </a>
                      </div>
                    </div>

                    <a
                      href={directionsHref(o.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group mt-auto self-start inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#A7F176] text-[#111827] hover:bg-[#94df62]'
                          : 'border border-gray-300 text-[#111827] hover:border-[#111827]'
                      }`}
                    >
                      <span>Get directions</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/*
              Map. The embed is nudged up inside the frame so Google's own info box (top-left of
              the embed) sits out of view — the cards and Get directions button replace it — while
              the Google logo and terms along the bottom edge stay visible.
            */}
            <div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden border border-gray-200 bg-gray-100 shadow-sm min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
              <iframe
                key={office.mapQuery}
                src={mapEmbedSrc(office.mapQuery)}
                className="absolute left-0 w-full border-0 -top-[170px] h-[calc(100%+170px)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map — ${office.region}`}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default OfficeLocationsSection;
