'use client';

import React, { useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const items = [
  { text: 'Translate design with care', align: 'left' },
  { text: 'Build mobile-first layouts', align: 'right' },
  { text: 'Keep the codebase clean', align: 'left' },
  { text: 'Set up flexible content control', align: 'right' },
  { text: 'Prepare SEO and tracking basics', align: 'left' },
  { text: 'Test key journeys before launch', align: 'right' },
] as const;

/**
 * Centre-line timeline whose progress is driven by scroll position, matching the
 * behaviour of the How It Works section: the line fills as the section travels up
 * through the viewport and each dot lights as the fill reaches it.
 */
export const BeyondTheCodeTimeline: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const activeIndex = useScrollProgress(wrapperRef, {
    mode: 'through',
    itemCount: items.length,
    onFrame: (progress) => {
      if (lineRef.current) lineRef.current.style.height = `${progress * 100}%`;
    },
  });

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl my-6 sm:my-8">
      {/* Unfilled track */}
      <div className="absolute left-1/2 top-3 bottom-3 w-[2px] bg-white/25 -translate-x-1/2 rounded-full" />

      {/* Filled portion — height written imperatively by the scroll loop */}
      <div
        ref={lineRef}
        className="absolute left-1/2 top-3 w-[2px] bg-[#A7F076] -translate-x-1/2 rounded-full shadow-[0_0_10px_#A7F176] will-change-[height]"
        style={{ height: 0 }}
      />

      <div className="flex flex-col gap-12 sm:gap-16">
        {items.map(({ text, align }, idx) => {
          const isActive = idx <= activeIndex;

          return (
            <div key={text} className="relative flex items-center w-full min-h-[40px]">
              {/* Dot */}
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 transition-all duration-300 ${
                  isActive
                    ? 'w-4 h-4 bg-[#A7F076] border-2 border-white shadow-[0_0_12px_#A7F176] scale-110'
                    : 'w-3.5 h-3.5 bg-white/70 border border-white/60'
                }`}
              />

              {/* Label */}
              <div
                className={`w-1/2 ${
                  align === 'left' ? 'pr-6 sm:pr-10 text-right' : 'pl-6 sm:pl-10 text-left ml-auto'
                }`}
              >
                <span
                  className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 ${
                    isActive ? 'text-[#A7F076]' : 'text-white/55'
                  }`}
                >
                  {text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeyondTheCodeTimeline;
