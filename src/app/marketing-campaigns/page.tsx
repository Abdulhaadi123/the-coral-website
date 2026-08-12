'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';

// ── Services list (paired rows with stagger pattern) ───────────────────────

const leftServices = [
  { text: 'Search Engine Optimisation (SEO)', indent: false, href: '/seo-search-visibility' },
  { text: 'Paid Advertising', indent: true, href: '/paid-advertising' },
  { text: 'Email Marketing', indent: false, href: null },
  { text: 'Marketing Automation', indent: true, href: null },
  { text: 'Landing Pages', indent: false, href: null },
  { text: 'Inbound Marketing', indent: true, href: '/marketing-campaigns' },
  { text: 'Funnel Strategy', indent: false, href: null },
  { text: 'Marketing Reporting', indent: true, href: null },
];

const rightServices = [
  { text: 'Social Media Marketing', indent: false },
  { text: 'Content Marketing', indent: true },
  { text: 'CRM Strategy & Setup', indent: false },
  { text: 'Lead Pipeline Strategy', indent: true },
  { text: 'Campaign Creative & Copy', indent: false },
  { text: 'Audience & Persona Research', indent: true },
  { text: 'Blogging & Link Building', indent: false },
  { text: 'Sales Follow-Up Workflows', indent: true },
];

// ── 3-col info cards ──────────────────────────────────────────────────────────

const infoCards = [
  {
    title: 'Convert more customers',
    desc: 'We connect content, SEO, paid ads, social media, email, CRM, automation, and reporting so every channel has a clear role in your pipeline.',
  },
  {
    title: 'Attract better leads',
    desc: 'The Coral Room builds marketing around the full customer path, from first touch to lead capture, follow-up, and repeat business.',
  },
  {
    title: 'Increase sales & revenue',
    desc: 'Our focus is simple: reach the right people, guide them with the right message, and give your team a system that turns attention into measurable growth.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketingCampaignsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-hidden">
      <Header />

      {/* ── Hero Section — Text only, constrained ── */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-16 sm:pt-24 pb-0">
        <FadeIn direction="up" className="pl-6 sm:pl-12 md:pl-16 lg:pl-20">
          {/* Heading */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-semibold text-[#111827] leading-[1.15] max-w-2xl mb-6">
            We create marketing{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              campaigns that drive growth
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed mb-10">
            We plan and run content, email, automation, CRM, paid campaigns, and lead pipelines that help
            your brand get seen, stay relevant, and turn interest into revenue. Every channel works with
            one clear purpose: attract better leads, guide them through the journey, and build a pipeline
            your team can measure and grow.
          </p>
        </FadeIn>
      </section>

      {/* ── Dashboard Image — Full-bleed RIGHT like Figma ── */}
      <div className="w-full overflow-hidden mt-6 sm:mt-10 mb-12 sm:mb-16">
        <ScaleIn delay={0.2} className="flex justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/omnix-dashboard.webp"
            alt="Omnix marketing dashboard — project performance, AI insights, and campaign tracking"
            className="w-[92%] sm:w-[88%] max-w-none h-auto object-contain object-right"
          />
        </ScaleIn>
      </div>

      {/* ── 3-col Info Cards ── */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pb-16 sm:pb-20">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {infoCards.map(({ title, desc }) => (
            <StaggerItem key={title} className="h-full">
              <div
                className="h-full flex flex-col gap-3 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
                style={{ background: '#B6F28D21' }}
              >
                <h3 className="text-base font-bold text-[#111827]">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── We Can Help You With ── */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pb-16 sm:pb-20">
        <div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-semibold text-center mb-12 leading-tight">
          <span
            style={{
              background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            We Can Help You With
          </span>
        </h2>

        {/* Staggered 2-column pill list matching Figma */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-16 lg:gap-20 max-w-5xl mx-auto px-4">

          {/* Left column */}
          <div className="flex flex-col items-start gap-3 sm:gap-4 flex-1">
            {leftServices.map(({ text, indent, href }) => {
              const pill = (
                <div className="inline-flex max-w-full items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-gray-100 rounded-xl text-xs sm:text-sm text-[#111827] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all">
                  <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#A7F076]" />
                  <span>{text}</span>
                </div>
              );
              return (
                <div
                  key={text}
                  className={`${indent ? 'sm:ml-16 lg:ml-20' : 'ml-0'}`}
                >
                  {href ? (
                    <Link href={href} className="block hover:scale-[1.02] transition-transform duration-200">
                      {pill}
                    </Link>
                  ) : pill}
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="flex flex-col items-start gap-3 sm:gap-4 flex-1">
            {rightServices.map(({ text, indent }) => (
              <div
                key={text}
                className={`${indent ? 'sm:ml-16 lg:ml-20' : 'ml-0'}`}
              >
                <div className="inline-flex max-w-full items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-gray-100 rounded-xl text-xs sm:text-sm text-[#111827] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all">
                  <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[#A7F076]" />
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
        </div>
      </section>

      {/* ── Full-Journey Marketing (#F5F7FA BG) ── */}
      <section className="w-full bg-[#F5F7FA] py-16 sm:py-20 my-12">
        <FadeIn direction="up" className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col items-center">
          
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] text-center mb-3">
            Full-Journey Marketing
          </h2>
          <p className="text-sm sm:text-base text-gray-500 text-center mb-16 max-w-xl">
            Create demand, capture interest, and turn leads into customers
          </p>

          {/* Connected Steps & Cards Container */}
          <div className="w-full relative">

            {/* Stepper Circles with Separate Line Segments */}
            <div className="flex justify-between items-center max-w-5xl mx-auto mb-10 px-4 sm:px-8">

              {/* Step 1 Circle (#21A0A3) */}
              <div
                className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: '#21A0A3' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {/* Line 1 (#21A0A3) */}
              <div className="hidden sm:block flex-1 h-[2px] mx-3 sm:mx-4 bg-[#21A0A3]" />

              {/* Step 2 Circle (#8BD35C) */}
              <div
                className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: '#8BD35C' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>

              {/* Line 2 (#8BD35C) */}
              <div className="hidden sm:block flex-1 h-[2px] mx-3 sm:mx-4 bg-[#8BD35C]" />

              {/* Step 3 Circle (#BF00FF) */}
              <div
                className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: '#BF00FF' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              {/* Line 3 (#BF00FF) */}
              <div className="hidden sm:block flex-1 h-[2px] mx-3 sm:mx-4 bg-[#BF00FF]" />

              {/* Step 4 Circle (#FF008C) */}
              <div
                className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: '#FF008C' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
              {/* Card 1 */}
              <StaggerItem className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 flex flex-col gap-2 text-center hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-[#111827]">Attract</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  SEO, content, paid ads, and social campaigns that bring the right people in.
                </p>
              </StaggerItem>

              {/* Card 2 */}
              <StaggerItem className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 flex flex-col gap-2 text-center hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-[#111827]">Capture</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Landing pages, lead magnets, forms, and CTAs that turn interest into enquiries.
                </p>
              </StaggerItem>

              {/* Card 3 */}
              <StaggerItem className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 flex flex-col gap-2 text-center hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-[#111827]">Nurture</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Email, CRM, automation, and retargeting that keep leads moving.
                </p>
              </StaggerItem>

              {/* Card 4 */}
              <StaggerItem className="h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 flex flex-col gap-2 text-center hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-[#111827]">Grow</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Sales follow-up, reporting, retention campaigns, and optimisation that improve results over time.
                </p>
              </StaggerItem>
            </StaggerContainer>

          </div>

        </FadeIn>
      </section>

      {/* ── Building Your Inbound Foundation (#A7F176 Green Card) ── */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 py-10 sm:py-16">
        <FadeIn direction="up">
          <div className="w-full bg-[#A7F176] rounded-3xl p-5 sm:p-14">
            
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#111827] text-center mb-10 sm:mb-12">
              Building Your Inbound Foundation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-x-16 sm:gap-y-10 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-start gap-4 hover:translate-x-1 transition-transform">
                <span className="w-8 h-8 rounded-full bg-white text-[#111827] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-[#111827] text-base mb-1">Strategy &amp; Research</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    We start by understanding your audience, goals, and competitive landscape to build a targeted approach.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 hover:translate-x-1 transition-transform">
                <span className="w-8 h-8 rounded-full bg-white text-[#111827] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-[#111827] text-base mb-1">Automation &amp; CRM Setup</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    We connect your tools and workflows so leads are nurtured automatically.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 hover:translate-x-1 transition-transform">
                <span className="w-8 h-8 rounded-full bg-white text-[#111827] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-[#111827] text-base mb-1">Content &amp; Campaign Creation</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    From landing pages to email sequences, we create assets that attract and convert.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 hover:translate-x-1 transition-transform">
                <span className="w-8 h-8 rounded-full bg-white text-[#111827] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-[#111827] text-base mb-1">Measure &amp; Optimise</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    Ongoing reporting and testing to improve performance and ROI.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative overflow-hidden">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-xl">
            Ready to turn attention into qualified leads?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            We&apos;ll help you connect content, ads, CRM, and automation into a marketing system that moves people closer to buying.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-7 py-3 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-sm inline-flex items-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Start a Strategy Call</span>
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

