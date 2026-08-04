'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { SlidersHorizontal } from 'lucide-react';
import { projects } from './data';

const categories = ['All', 'Branding', 'Design', 'Development', 'Marketing', 'Social Media'];

const placeholderColors = [
  '#1a2e1a', '#0a1628', '#2d1f0e', '#0f0f1a',
  '#1a0a0a', '#0d1a2e', '#1a1a0d', '#201408',
  '#101820', '#0d1520', '#180818', '#1f1208',
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col relative">
      <Header />

      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-12 pb-24">
        {/* Heading */}
        <FadeIn direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight mb-4">
            Our Portfolio
          </h1>
          <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2 max-w-2xl">
            Work built to look sharp, work sharply, and support growth.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed mb-10">
            We create brand, website, ecommerce, marketing, and optimisation work across multiple digital touchpoints. Every project is shaped around the client&apos;s goals, audience, and next stage of growth.
          </p>
        </FadeIn>

        {/* Filter Row */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === cat
                        ? 'bg-[#111827] text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium shrink-0">
              Showing {filtered.length} of {projects.length}
            </span>
          </div>
        </FadeIn>

        {/* Grid — 4 columns, 308×350 aspect, 20px radius */}
        <StaggerContainer key={activeFilter} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((project, idx) => (
            <StaggerItem key={project.slug + idx}>
              <Link
                href={`/portfolio/${project.slug}`}
                scroll={true}
                prefetch={true}
                className="group block cursor-pointer"
              >
                {/* Card: 308×350 → aspect ratio 308/350 ≈ 0.88 */}
                <div
                  className="relative w-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.03]"
                  style={{
                    aspectRatio: '308 / 350',
                    borderRadius: '20px',
                    background: project.bg || placeholderColors[idx % placeholderColors.length],
                  }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    /* Placeholder: subtle gradient + label */
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${project.bg}cc, ${project.bg}44)` }}
                    >
                      <span className="text-xs font-bold tracking-widest uppercase text-white/20 text-center px-4">
                        {project.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold tracking-wider text-white/80 uppercase bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title below card */}
                <p className="mt-2.5 text-sm font-semibold text-[#111827] leading-snug px-0.5">
                  {project.title}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 px-6 sm:px-12 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-snug">
            Need sharper design direction, fast?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            Start with a focused Design Clarity Session. We review your brand, website, visuals,
            and customer touchpoints, then map the clearest next move for your identity, UI,
            content, or campaigns.
          </p>
          <Link
            href="/book-a-call"
            className="btn-hover-gradient mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
          >
            Book a Discovery Call →
          </Link>
        </FadeIn>
      </section>

      <FooterSection />
    </main>
  );
}
