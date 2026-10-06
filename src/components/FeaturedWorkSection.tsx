'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';
import { projects as portfolioProjects } from '@/app/portfolio/data';

/*
 * Featured entries are resolved from the portfolio data rather than duplicated
 * here, so titles, categories and slugs can never drift out of sync with the
 * detail pages. A slug that no longer exists is dropped instead of rendering a
 * card that 404s.
 *
 * `image` is an optional override for the four brands that have purpose-shot
 * wide artwork in /images/featured; the rest fall back to their portfolio card
 * image. (finlo and liviq have featured art but no detail page, so they are
 * deliberately excluded.)
 */
const FEATURED: { slug: string; image?: string }[] = [
  { slug: 'kaelvo-brand-identity', image: '/images/featured/kaelvo.webp' },
  { slug: 'mochae-brand-identity', image: '/images/featured/mochae.webp' },
  { slug: 'elovira-packaging', image: '/images/featured/elovira.webp' },
  { slug: 'the-vertical-launch', image: '/images/featured/the-vertical.webp' },
  { slug: 'omnix-project-management' },
  { slug: 'ascent-brand-identity' },
  { slug: 'crewtix-brand-identity' },
  { slug: 'noura-packaging' },
];

const projects = FEATURED.flatMap(({ slug, image }) => {
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return [];

  // ProjectItem.image is nullable; a card with no artwork is not worth showing.
  const src = image ? assetUrl(image) : project.image;
  if (!src) return [];

  return [{
    name: project.title,
    slug: project.slug,
    category: project.category,
    image: src,
  }];
});

export const FeaturedWorkSection: React.FC = () => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const totalDots = projects.length;

  /*
   * Client brief item 05: arrow navigation used to swap in a fresh 2-card
   * window (keyed by `${name}-${active}`), which forced React — and the
   * browser — to mount a brand-new <Image> and start its request from
   * scratch on every click, which is where the ~2s delay came from.
   *
   * Every card is mounted once, up front, in one continuous flex "track";
   * the arrows/dots only slide that track sideways with a CSS transform.
   * Once a card's image has loaded it never unmounts, so revisiting it is a
   * transform, not a new request — and since there are only 8 cards, all of
   * them are fetched once the page has finished loading (see `warm` below) so
   * every neighbour is already in cache well before the user can arrow to it.
   *
   * They used to be fetched during page load, two of them as high-priority
   * preloads, even though this section is several screens down — that competed
   * with the hero for bandwidth (PageSpeed: LCP, "offscreen images"). Waiting
   * for load + an idle moment keeps the instant arrow response and gives the
   * first screen the network to itself.
   */
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) setWarm(true);
    };
    const schedule = () => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
      else setTimeout(run, 2000);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
    };
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    setStep(second.offsetLeft - first.offsetLeft);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const prev = () => setActive((i) => (i === 0 ? projects.length - 1 : i - 1));
  const next = () => setActive((i) => (i === projects.length - 1 ? 0 : i + 1));

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    const isUnlocked = localStorage.getItem('coral_portfolio_unlocked') === 'true';
    if (isUnlocked) {
      router.push(`/portfolio/${slug}`);
    } else {
      router.push(`/portfolio?redirect=/portfolio/${slug}`);
    }
  };

  return (
    <section data-nav-dark className="w-full bg-[#1B8183] py-14 sm:py-20 overflow-hidden">

      {/* Heading — aligned with Hero & ProcessWithDepthSection */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%]">
        <FadeIn direction="up">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
            Featured Work
          </h2>
        </FadeIn>
      </div>

      {/* Cards — left-aligned with site grid, 2nd card precisely half cut off on the right */}
      <div className="mt-8 sm:mt-10 w-full overflow-hidden">
        <div className="max-w-[1600px] mx-auto pl-5 sm:pl-8 lg:pl-[13.1%] pr-0">
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-visible transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * step}px)` }}
          >
            {projects.map((project, i) => (
              <a
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                onClick={(e) => handleCardClick(e, project.slug)}
                className="relative group rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] block cursor-pointer flex-shrink-0 w-[85vw] sm:w-[55vw] lg:w-[56vw] max-w-[580px]"
              >
                <Image
                  src={project.image}
                  alt={`${project.name} branding project`}
                  fill
                  // Lazy until the page has loaded, then every card is fetched (see `warm`).
                  loading={warm ? 'eager' : 'lazy'}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 80vw, 480px"
                />

                {/* Soft top gradient for title readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35 pointer-events-none" />

                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-none">{project.name}</h3>
                  <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium">{project.category}</p>
                </div>

                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-10">
                  <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white text-white text-sm font-semibold group-hover:bg-white group-hover:text-[#1B8183] transition-colors duration-300">
                    <span>View project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dots + arrows + lime bar — padded to match site grid */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%]">
        {/* Dots + arrows */}
        <div className="mt-8 sm:mt-10 flex items-center justify-between">
          <div className="flex items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
              // The dot stays small; the button around it is a 24x24 touch target
              // (WCAG 2.5.8 / PageSpeed "touch targets").
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active % totalDots ? 'true' : undefined}
                onClick={() => setActive(i % projects.length)}
                className="group w-6 h-6 flex items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active % totalDots
                      ? 'w-2.5 h-2.5 bg-white'
                      : 'w-2 h-2 bg-white/45 group-hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous project"
              className="w-11 h-11 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white hover:text-[#1B8183] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next project"
              className="w-11 h-11 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white hover:text-[#1B8183] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lime bar */}
        <Link
          href="/portfolio"
          className="group mt-8 sm:mt-10 mb-10 sm:mb-14 w-full bg-[#A7F176] rounded-2xl px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between hover:brightness-95 transition-all block"
        >
          <span className="text-base sm:text-xl font-semibold text-[#111827] group-hover:font-bold transition-all duration-200">
            Explore more of our work
          </span>
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#111827] text-[#111827] group-hover:bg-[#111827] group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;
