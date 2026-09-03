'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const steps = [
  {
    step: 'STEP 1',
    title: 'Book a Discovery Call',
    desc: 'We talk through your business, current digital presence, goals, problems, and what you want to improve first.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.9238 46C38.0784 46 33.1104 44.7867 28.0198 42.3602C22.9291 39.9338 18.1997 36.5269 13.8316 32.1396C9.46354 27.7524 6.06625 23.023 3.63975 17.9515C1.21325 12.88 0 7.92158 0 3.07625C0 2.19842 0.287501 1.46721 0.862501 0.882625C1.4375 0.298042 2.15625 0.00383333 3.01875 0H10.1286C10.9106 0 11.593 0.246292 12.1756 0.738875C12.7583 1.23146 13.1522 1.863 13.3573 2.6335L14.7833 9.4875C14.9174 10.2925 14.8935 10.995 14.7114 11.5949C14.5293 12.1948 14.2102 12.6864 13.754 13.0697L7.44625 18.952C8.62692 21.0929 9.93121 23.0824 11.3591 24.9205C12.787 26.7586 14.3108 28.4999 15.9304 30.1444C17.5979 31.8119 19.3938 33.3644 21.3181 34.8019C23.2425 36.2375 25.3546 37.5925 27.6546 38.8671L33.8043 32.6082C34.2719 32.1042 34.798 31.7716 35.3826 31.6106C35.9653 31.4515 36.6112 31.4199 37.3204 31.5157L43.3665 32.752C44.1485 32.9437 44.7829 33.3375 45.2698 33.9336C45.7566 34.5297 46 35.212 46 35.9806V42.9813C46 43.8438 45.7067 44.5625 45.1203 45.1375C44.5338 45.7125 43.7997 46 42.9238 46ZM6.095 16.2553L11.615 11.1809C11.7971 11.0333 11.9159 10.8301 11.9715 10.5714C12.029 10.3126 12.0194 10.073 11.9428 9.85262L10.6691 3.75763C10.5944 3.46438 10.465 3.24396 10.281 3.09638C10.097 2.94879 9.85838 2.875 9.56513 2.875H3.66563C3.44521 2.875 3.26121 2.94879 3.11363 3.09638C2.96604 3.24396 2.89225 3.42796 2.89225 3.64838C2.94783 5.61296 3.25546 7.66379 3.81513 9.80087C4.37479 11.938 5.13283 14.0894 6.095 16.2553ZM30.3916 40.2155C32.3351 41.1777 34.4051 41.8897 36.6016 42.3516C38.802 42.8116 40.7186 43.0579 42.3516 43.0905C42.572 43.0905 42.756 43.0167 42.9036 42.8691C43.0512 42.7215 43.125 42.5385 43.125 42.32V36.547C43.125 36.2537 43.0512 36.0142 42.9036 35.8283C42.756 35.6442 42.5356 35.5158 42.2424 35.443L36.9236 34.3534C36.7013 34.2786 36.5067 34.269 36.34 34.3246C36.1752 34.3821 36.0007 34.5019 35.8167 34.684L30.3916 40.2155Z" fill="#A7F176"/>
      </svg>
    ),
  },
  {
    step: 'STEP 2',
    title: 'We Find the Opportunity',
    desc: 'We review what you need, where the gaps are, and which services can make the strongest impact. You get a practical direction with scope, timelines, and budget range.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 49 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.786 21C41.7179 21 40.0815 23.8 40.8997 26L33.536 33.2C32.9224 33 32.1042 33 31.4906 33.2L26.1724 28C26.9906 25.8 25.3542 23 22.286 23C19.4224 23 17.5815 25.8 18.3997 28L8.99059 37C6.74059 36.4 3.87695 38 3.87695 41C3.87695 43.2 5.71786 45 7.96786 45C10.8315 45 12.6724 42.2 11.8542 40L21.0588 30.8C21.6724 31 22.4906 31 23.1042 30.8L28.4224 36C27.8088 38 29.4451 41 32.5133 41C35.5815 41 37.2179 38.2 36.3997 36L43.7633 28.8C46.0133 29.4 48.877 27.8 48.877 25C48.877 22.8 47.036 21 44.786 21ZM32.5133 23L34.3542 18.8L38.6497 17L34.3542 15.2L32.5133 11L30.6724 15.2L26.377 17L30.6724 18.8L32.5133 23ZM8.99059 27L10.0133 23L14.1042 22L10.0133 21L8.99059 17L7.96786 21L3.87695 22L7.96786 23L8.99059 27Z" fill="#A7F176"/>
      </svg>
    ),
  },
  {
    step: 'STEP 3',
    title: 'We Shape the Plan',
    desc: 'We refine the priorities, ask the right questions, and agree on the best way forward before anything is signed.',
    icon: (
      <div
        className="w-10 h-10 bg-[#A7F176]"
        style={{
          WebkitMaskImage: "url('/images/vaadin_handshake.webp')",
          maskImage: "url('/images/vaadin_handshake.webp')",
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    ),
  },
  {
    step: 'STEP 4',
    title: 'We Start the Work',
    desc: 'Once the proposal is approved, we move ahead with a defined scope, shared responsibilities, and a focused plan of action.',
    icon: (
      <div
        className="w-10 h-10 bg-[#A7F176]"
        style={{
          WebkitMaskImage: "url('/images/icon.webp')",
          maskImage: "url('/images/icon.webp')",
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    ),
  },
];

/*
 * Layout mirrors the reference site's timeline: nothing is pinned. The section
 * sits in normal document flow and the steps scroll past at their own pace, so
 * the page never feels frozen. Only two things are sticky —
 *
 *   - the left intro column, which stays alongside the steps, and
 *   - a fixed-length bright segment on the rail, which reads as a progress
 *     indicator travelling down the line as content passes it.
 *
 * Both are native CSS `position: sticky`, so the motion is compositor-driven and
 * costs no JavaScript. The previous version pinned a full-screen panel for 340vh
 * and re-translated the column on every scroll event — that is what made it feel
 * stuck.
 */
export const HowItWorksSection: React.FC = () => {
  const colRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const update = () => {
      const col = colRef.current;
      const fill = fillRef.current;
      if (!col || !fill) return;

      const rect = col.getBoundingClientRect();
      // The "playhead" sits just below the middle of the viewport; the rail is
      // filled down to wherever that line has reached.
      const anchor = window.innerHeight * 0.55;
      const filled = Math.max(0, Math.min(rect.height, anchor - rect.top));
      fill.style.height = `${filled}px`;

      // Dots light as the fill reaches them. Written straight to style so
      // scrolling never re-renders the component.
      for (const dot of dotsRef.current) {
        if (!dot) continue;
        const reached = dot.getBoundingClientRect().top - rect.top <= filled;
        dot.style.backgroundColor = reached ? '#A7F176' : 'rgba(255,255,255,0.45)';
        dot.style.boxShadow = reached ? '0 0 10px #A7F176' : 'none';
      }
    };

    // Run synchronously rather than through requestAnimationFrame: this is a
    // handful of rect reads, and rAF-only scheduling silently does nothing
    // wherever frames are throttled (background tabs, reduced-motion setups).
    const onScroll = () => update();

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section data-nav-dark className="w-full bg-[#21A0A3] text-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

        {/* ── Left: intro, sticks while the steps scroll past ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-semibold tracking-tight leading-[1.05]">
            How It Works
          </h2>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-sm font-normal">
            Not sure what your digital presence needs next? We help you find the right starting
            point before the work begins.
          </p>

          <div className="mt-7">
            <Link
              href="/book-a-call"
              className="group px-6 py-3 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-sm sm:text-base inline-flex items-center gap-3 shadow-md hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
              </span>
            </Link>
          </div>
        </div>

        {/*
          ── Right: the steps, in normal flow ──

          Rail, progress segment and dots are all positioned from this container's
          left edge with one shared centre line (RAIL_CENTRE = 16px), so they cannot
          drift apart. The previous version placed the rail from the container but
          the dots as negative offsets from a padded step, which put them 3.5px out
          of true at the `sm` breakpoint.
        */}
        <div ref={colRef} className="lg:col-span-7 relative">

          {/* Rail — 2px wide, centred on 16px. Starts above the first dot. */}
          <div className="absolute left-[15px] top-0 bottom-2 w-[2px] bg-white/25 rounded-full" />

          {/*
            Progress fill — grows downward and STAYS filled behind itself, so the
            rail reads as completed above the playhead. The previous sticky segment
            was a fixed-height band that travelled, which let the line fall back to
            dark once it moved past.
          */}
          <div
            ref={fillRef}
            className="absolute left-[15px] top-0 w-[2px] rounded-full bg-[#A7F176] shadow-[0_0_14px_#A7F176] pointer-events-none"
            style={{ height: 0 }}
          />

          <div className="flex flex-col gap-16 sm:gap-20 pt-16 lg:pt-[162px] pb-16 lg:pb-[181px]">
            {steps.map((item, i) => (
              <div key={item.step} className="relative pl-14">
                {/* Dot, centred on the rail */}
                <span
                  ref={(el) => { dotsRef.current[i] = el; }}
                  className="absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors duration-300"
                  style={{ backgroundColor: 'rgba(255,255,255,0.45)' }}
                />

                <span className="text-[11px] font-bold tracking-[0.2em] text-teal-100/70 uppercase block mb-3">
                  {item.step}
                </span>

                <div className="mb-4 text-[#A7F176]">{item.icon}</div>

                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
