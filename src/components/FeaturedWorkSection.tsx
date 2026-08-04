'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';

const projects = [
  {
    name: 'Kaelvo',
    slug: 'kaelvo-brand-identity',
    category: 'Branding',
    image: '/images/featured/kaelvo.webp',
  },
  {
    name: 'Mochae',
    slug: 'mochae-brand-identity',
    category: 'Branding',
    image: '/images/featured/mochae.webp',
  },
];

export const FeaturedWorkSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const totalDots = 7;

  const prev = () => setActive((i) => (i === 0 ? projects.length - 1 : i - 1));
  const next = () => setActive((i) => (i === projects.length - 1 ? 0 : i + 1));

  // Show two cards starting from active (wrap)
  const visible = [projects[active % projects.length], projects[(active + 1) % projects.length]];

  return (
    <section className="w-full bg-[#21A0A3] pt-14 sm:pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <FadeIn direction="up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Featured Work
          </h2>
        </FadeIn>

        {/* Project cards */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {visible.map((project) => (
            <article
              key={`${project.name}-${active}`}
              className="relative group rounded-2xl overflow-hidden bg-black/10 aspect-[4/3] sm:aspect-[5/4] animate-fade-in"
            >
              <Image
                src={project.image}
                alt={`${project.name} branding project`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Soft top gradient for title readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35 pointer-events-none" />

              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-none">{project.name}</h3>
                <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium">{project.category}</p>
              </div>

              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-10">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white text-white text-sm font-semibold hover:bg-white hover:text-[#21A0A3] transition-colors duration-300"
                >
                  <span>View project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

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

        {/* Lime bar — same teal section, inset + rounded (Figma) */}
        <Link
          href="/portfolio"
          className="group mt-8 sm:mt-10 mb-10 sm:mb-14 w-full bg-[#A7F176] rounded-2xl px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between hover:brightness-95 transition-all block"
        >
          <span className="text-base sm:text-xl font-semibold text-[#111827]">
            Explore more of our work
          </span>
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#111827] text-white flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;
