'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn } from '@/components/Animated';
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { PortfolioFullLockGate } from '@/components/PortfolioFullLockGate';
import { projects } from './data';
import { assetUrl } from '@/lib/assets';

const PROJECT_TYPES = [
  'Branding',
  'Social Media',
  'Video Production',
  'Ui & UX',
  'Packaging',
  'Website',
  'App Design',
  'Marketing',
];

const placeholderColors = [
  '#1a2e1a', '#0a1628', '#2d1f0e', '#0f0f1a',
  '#1a0a0a', '#0d1a2e', '#1a1a0d', '#201408',
  '#101820', '#0d1520', '#180818', '#1f1208',
];

export default function PortfolioPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const isUnlocked = localStorage.getItem('coral_portfolio_unlocked');
    if (isUnlocked === 'true') {
      setUnlocked(true);
    }
  }, []);

  // Pending = what's shown in the open panel (not yet applied)
  const [pendingTypes, setPendingTypes] = useState<string[]>([]);

  // Applied = actually active on the grid
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const openFilter = () => {
    setPendingTypes(appliedTypes);
    setFilterOpen(true);
  };

  const toggleType = (type: string) => {
    setPendingTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearAll = () => {
    setPendingTypes([]);
  };

  const [projectList, setProjectList] = useState<typeof projects | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.projects && data.projects.length > 0) {
          setProjectList(data.projects);
        } else {
          setProjectList(projects);
        }
      })
      .catch(() => {
        setProjectList(projects);
      })
      .finally(() => setDbLoaded(true));
  }, []);

  const applyFilters = () => {
    setAppliedTypes(pendingTypes);
    setFilterOpen(false);
  };

  // Compute filtered list
  let filtered = projectList ?? [];
  if (appliedTypes.length > 0) {
    filtered = filtered.filter(p =>
      appliedTypes.includes(p.category) ||
      appliedTypes.some(type =>
        type === 'Design' ? p.category === 'Design' :
        type === 'Website' ? (p.category === 'Design' || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('web') || t.toLowerCase().includes('site')))) :
        type === 'Ui & UX' ? (p.category === 'Design' || p.category === 'Development' || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('ui') || t.toLowerCase().includes('ux') || t.toLowerCase().includes('crm')))) :
        type === 'App Design' ? (p.category === 'Development' || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('app')))) :
        type === 'Packaging' ? (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('packag'))) :
        type === 'Video Production' ? (p.category === 'Social Media' || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes('video')))) :
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(type.toLowerCase())))
      )
    );
  }

  const hasActiveFilters = appliedTypes.length > 0;

  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col relative overflow-x-clip">
      <Header />

      <section className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-16">
        <div>

          {/* Heading */}
          <FadeIn direction="up">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold text-[#111827] tracking-tight mb-4" style={{ lineHeight: '1.10' }}>
              Our Portfolio
            </h1>
            <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2 max-w-2xl">
              Work built to look sharp, work sharply, and support growth.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed mb-10">
              We create brand, website, ecommerce, marketing, and optimisation work across multiple digital touchpoints. Every project is shaped around the client&apos;s goals, audience, and next stage of growth.
            </p>
          </FadeIn>

          {/* Unlocked View vs Gated View */}
          {unlocked ? (
            <>
              {/* If DB data is still loading, show elegant inline branded loader */}
              {!dbLoaded ? (
                <div className="flex flex-col items-center justify-center py-28 gap-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt="The Coral Room"
                    className="h-10 w-auto object-contain select-none opacity-90 animate-pulse"
                    draggable={false}
                  />
                  <div className="w-48 h-[3px] rounded-full bg-gray-100 overflow-hidden">
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        background: 'linear-gradient(90deg, #78B249, #9FE66F, #00C0E8)',
                        animation: 'coral-scan 1.4s ease-in-out infinite',
                      }}
                    />
                  </div>
                  <style>{`
                    @keyframes coral-scan {
                      0%   { width: 0%;  margin-left: 0%; }
                      50%  { width: 60%; margin-left: 20%; }
                      100% { width: 0%;  margin-left: 100%; }
                    }
                  `}</style>
                </div>
              ) : (
                <>
                  {/* Filter controls */}
                  <FadeIn direction="up">
                    <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                      <div className="relative" ref={dropdownRef}>
                        <button
                          id="portfolio-filter-btn"
                          onClick={openFilter}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${
                            hasActiveFilters
                              ? 'bg-[#111827] text-[#A7F176] border-[#111827]'
                              : 'border-gray-300 text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          <SlidersHorizontal className={`w-4 h-4 ${hasActiveFilters ? 'text-[#A7F176]' : 'text-gray-700'}`} />
                          <span>Filters</span>
                          {hasActiveFilters && (
                            <span className="w-5 h-5 rounded-full bg-[#A7F176] text-[#111827] text-[10px] font-bold flex items-center justify-center">
                              {appliedTypes.length}
                            </span>
                          )}
                        </button>

                        {filterOpen && (
                          <div className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4">
                              <span className="text-base font-bold text-[#111827]">Project Type</span>
                              <button onClick={clearAll} className="text-sm font-medium text-gray-500 hover:text-[#111827] transition-colors">
                                Clear
                              </button>
                            </div>
                            <div className="px-5 pb-4 flex flex-col gap-3.5">
                              {PROJECT_TYPES.map(type => {
                                const isChecked = pendingTypes.includes(type);
                                return (
                                  <label
                                    key={type}
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={(e) => { e.preventDefault(); toggleType(type); }}
                                  >
                                    <div
                                      className="flex items-center justify-center shrink-0 transition-all duration-150"
                                      style={{
                                        width: 16, height: 16, borderRadius: 2,
                                        backgroundColor: isChecked ? '#111827' : '#D9D9D9',
                                      }}
                                    >
                                      {isChecked && (
                                        <span className="block" style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: '#A7F176' }} />
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 group-hover:text-[#111827] transition-colors select-none">
                                      {type}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: '#D9D9D9' }}>
                              <button onClick={clearAll} className="text-sm font-semibold text-gray-700 hover:text-[#111827] transition-colors">
                                Clear All
                              </button>
                              <button
                                id="portfolio-apply-btn"
                                onClick={applyFilters}
                                className="px-5 py-1.5 rounded-full bg-[#111827] text-[#A7F176] text-sm font-bold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-gray-400 font-medium shrink-0">
                        Showing {filtered.length} of {projectList?.length ?? 0}
                      </span>
                    </div>
                  </FadeIn>

                  {/* Full Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {filtered.map((project, idx) => (
                      <div key={project.slug + idx} className="w-full">
                        <Link
                          href={`/portfolio/${project.slug}`}
                          scroll={true}
                          prefetch={true}
                          className="group block cursor-pointer"
                        >
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
                                src={assetUrl(project.image)}
                                alt={project.title}
                                fill
                                priority={idx < 4}
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${project.bg}cc, ${project.bg}44)` }}
                              >
                                <span className="text-xs font-bold tracking-widest uppercase text-[#FFFFFF]/20 text-center px-4">
                                  {(project.tags && project.tags[0]) || project.category}
                                </span>
                              </div>
                            )}

                            {project.topBadge && (
                              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                <span className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full leading-none border border-white/10 shadow-sm">
                                  {project.topBadge}
                                </span>
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap z-10 pointer-events-none">
                              {(project.tags || []).map(tag => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full leading-none border border-white/10 shadow-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="mt-2.5 text-sm font-semibold text-[#111827] leading-snug px-0.5 break-words">
                            {project.title}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Empty state */}
                  {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <p className="text-gray-400 text-sm font-medium">No projects match your filters.</p>
                      <button
                        onClick={() => setAppliedTypes([])}
                        className="px-5 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="relative pb-8">
              {/* Full Lock Access Gate Card (Clean on-brand card) */}
              <PortfolioFullLockGate totalProjects={projects.length} onUnlock={() => setUnlocked(true)} />

              {/* Background Silhouette Grid (0 projects unlocked, blurred preview) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-15 blur-[4px] pointer-events-none select-none -mt-44 sm:-mt-60">
                {projects.slice(0, 8).map((project, idx) => (
                  <div
                    key={project.slug + idx}
                    className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
                    style={{
                      aspectRatio: '308 / 350',
                      background: project.bg || placeholderColors[idx % placeholderColors.length],
                    }}
                  >
                    {project.image && (
                      <Image
                        src={assetUrl(project.image)}
                        alt="Locked preview"
                        fill
                        className="object-cover object-center"
                        sizes="25vw"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative overflow-x-hidden">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug">
            Need sharper design direction, fast?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            Start with a focused Design Clarity Session. We review your brand, website, visuals,
            and customer touchpoints, then map the clearest next move for your identity, UI,
            content, or campaigns.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-7 py-3 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-sm inline-flex items-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>

      <FooterSection />
    </main>
  );
}
