'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';
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
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const totalDots = projects.length;

  const prev = () => { setDirection('prev'); setActive((i) => (i === 0 ? projects.length - 1 : i - 1)); };
  const next = () => { setDirection('next'); setActive((i) => (i === projects.length - 1 ? 0 : i + 1)); };

  // Show two cards starting from active (wrap)
  const visible = [projects[active % projects.length], projects[(active + 1) % projects.length]];

  return (
    <section data-nav-dark className="w-full bg-[#21A0A3] py-16 sm:py-24 overflow-hidden">

      {/* Heading — aligned with ProcessWithDepthSection */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn direction="up">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
            Featured Work
          </h2>
        </FadeIn>
      </div>

      {/* Cards — perfectly aligned with max-w-7xl container so 1st card lines up with text above on ALL screen sizes & zoom levels */}
      <div className="mt-8 sm:mt-12 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 overflow-hidden">
        <div className="flex gap-4 sm:gap-6">
          {visible.map((project) => (
            <Link
              key={`${project.name}-${active}`}
              href={`/portfolio/${project.slug}`}
              className={`relative group rounded-2xl overflow-hidden bg-black/10 aspect-[3/2] block cursor-pointer flex-shrink-0 w-[85vw] sm:w-[480px] lg:w-[580px] ${direction === 'next' ? 'animate-slide-from-right' : 'animate-slide-from-left'}`}
            >
            <Image
              src={project.image}
              alt={`${project.name} branding project`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 88vw, 48vw"
            />

            {/* Soft top gradient for title readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35 pointer-events-none" />

            <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-none">{project.name}</h3>
              <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium">{project.category}</p>
            </div>

            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-10">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white text-white text-sm font-semibold group-hover:bg-white group-hover:text-[#21A0A3] transition-colors duration-300">
                <span>View project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>

      {/* Dots + arrows + lime bar — padded */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Dots + arrows */}
        <div className="mt-8 sm:mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i % projects.length)}
                className={`rounded-full transition-all duration-300 ${
                  i === active % totalDots
                    ? 'w-2.5 h-2.5 bg-white'
                    : 'w-2 h-2 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous project"
              className="w-11 h-11 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white hover:text-[#21A0A3] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next project"
              className="w-11 h-11 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white hover:text-[#21A0A3] transition-colors"
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
