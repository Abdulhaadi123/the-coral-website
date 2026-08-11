'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { ArrowUpRight, Check } from 'lucide-react';

const services = [
  {
    title: 'SEO Audit',
    desc: 'A clear review of rankings, traffic, technical health, content, and conversion gaps.',
  },
  {
    title: 'On-Page SEO',
    desc: 'Page titles, headings, internal links, content structure, and keyword alignment.',
  },
  {
    title: 'Off-Page SEO',
    desc: 'Authority building through backlinks, digital PR, listings, and brand mentions.',
  },
  {
    title: 'Technical SEO',
    desc: 'Indexing, site speed, schema, sitemaps, redirects, mobile usability, and crawl fixes.',
  },
  {
    title: 'Local SEO',
    desc: 'Google Business Profile, local pages, citations, reviews, and location-based visibility.',
  },
  {
    title: 'GEO',
    desc: 'Content and structure shaped for visibility across AI search and answer engines.',
  },
];

const standardPills = [
  'Map keywords to real search intent',
  'Fix technical issues that limit performance',
  'Improve page structure and content quality',
  'Track rankings, traffic, clicks, leads, and conversions',
  'Strengthen authority through internal links, backlinks, and brand signals',
];

export default function SeoSearchVisibilityPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-hidden">

      {/* ── Hero Section (Dark BG Image) ── */}
      <section
        className="relative w-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 overflow-hidden pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 min-h-[550px] sm:min-h-[650px]"
        style={{
          backgroundImage: "url('/images/seo-hero-bg.webp')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Header sits inside hero so image shows behind it */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header dark />
        </div>

        <FadeIn direction="up" className="relative z-10 max-w-4xl mx-auto sm:mx-0 pl-0 sm:pl-11 lg:pl-11">
          {/* Tag */}
          <span className="text-xs font-bold tracking-widest uppercase text-white/60 block mb-5">
            SEO &amp; SEARCH VISIBILITY
          </span>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
            SEO built to help the right customers{' '}
            <span className="text-[#A7F176]">find, trust, and choose you</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed mb-4">
            From on-page, off-page, and technical SEO to local SEO, GEO, content strategy, and
            performance tracking, we improve how your brand shows up in search and how well that
            traffic turns into real business.
          </p>
        </FadeIn>
      </section>

      {/* ── How We Approach SEO ── */}
      <section className="w-full bg-white py-16 sm:py-20 px-6 sm:px-12 border-b border-gray-100">
        <FadeIn direction="up" className="max-w-6xl mx-auto pl-0 sm:pl-11 lg:pl-11 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Title */}
          <div className="md:col-span-5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight sticky top-24">
              How We Approach SEO
            </h2>
          </div>

          {/* Right Text */}
          <div className="md:col-span-7 flex flex-col gap-5 text-sm sm:text-base text-gray-600 leading-relaxed">
            <p className="text-base sm:text-lg text-gray-800 font-semibold">
              Pretty rankings mean nothing if the traffic does not convert.
            </p>
            <p>
              We build SEO around search intent, site structure, content quality, technical health,
              authority, and conversion flow, so your brand is easier to find and easier to choose.
            </p>
            <p>
              The aim is not just more visitors. It is better visibility, stronger pages, and
              qualified traffic that supports real growth.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── SEO & Search Visibility Services (Green Mesh Gradient BG) ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 px-6 sm:px-12 relative">
        <div className="max-w-6xl mx-auto pl-0 sm:pl-11 lg:pl-11 relative z-10">
          <FadeIn direction="up" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] text-center">
              SEO &amp; Search Visibility Services
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ title, desc }) => (
              <StaggerItem
                key={title}
                className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-base font-bold text-[#111827] mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Our SEO Standard Section (White BG) ── */}
      <section className="w-full bg-white py-16 sm:py-20 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <FadeIn direction="up" className="flex flex-col items-center text-center mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight mb-3">
              Our SEO Standard
            </h2>
            <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-2">
              What makes our SEO different?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg leading-relaxed font-medium">
              We do not chase rankings without context. We build search visibility around business value. We:
            </p>
          </FadeIn>

          {/* Staggered Pill Cards in 2 Columns */}
          <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-14">
            {standardPills.map((pill, idx) => (
              <div
                key={pill}
                className={`bg-white border border-gray-100/80 rounded-xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-3 hover:shadow-md transition-all ${
                  idx % 2 === 1 ? 'sm:ml-6' : ''
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#A9F079] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#111827] stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-snug">
                  {pill}
                </span>
              </div>
            ))}
          </div>

          <FadeIn direction="up">
            <p className="text-xs sm:text-sm font-medium text-gray-500 leading-relaxed">
              It is not just SEO. It is search visibility built to bring the right people closer to action.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Built on Fourth Dimension™ (#21A0A3 Teal BG) ── */}
      <section className="w-full bg-[#21A0A3] text-white py-16 sm:py-20 px-6 sm:px-12">
        <FadeIn direction="up" className="max-w-6xl mx-auto flex flex-col gap-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Built on Fourth Dimension™
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-white/90 leading-relaxed">
            <p>
              SEO follows our Fourth Dimension™ framework, so every improvement is tied to strategy,
              structure, visibility, and growth.
            </p>
            <p>
              We do not optimise at random. We study how people search, how your website performs,
              where competitors are winning, and what needs to change first.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/fourth-dimension-framework"
              className="group inline-flex items-center justify-center gap-3 px-5 sm:px-6 py-3 rounded-full border border-white text-white font-semibold text-sm hover:bg-white hover:text-[#21A0A3] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 max-w-full text-center"
            >
              <span>Learn more about Fourth Dimension™</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Book a Discovery Call / CTA Section (White BG) ── */}
      <section className="w-full bg-white py-16 sm:py-20 px-6 sm:px-12 text-center">
        <FadeIn direction="up" className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="text-base sm:text-lg font-bold text-[#111827]">
            Book a Discovery Call
          </span>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight max-w-xl leading-snug">
            Need your website to rank better and bring in better leads?
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 max-w-lg leading-relaxed font-medium mb-4">
            Let&apos;s review your search visibility, technical gaps, content structure, and SEO
            opportunities, then map the next move.
          </p>

          <Link
            href="/book-a-call"
            className="btn-hover-gradient group mt-2 px-5 sm:px-7 py-3 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-sm inline-flex items-center justify-center gap-3 shadow-md hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 max-w-full text-center"
          >
            <span>Book an SEO Audit</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>

      <FooterSection />
    </main>
  );
}
