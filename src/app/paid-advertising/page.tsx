'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import {
  IconPaidSnapchat,
  IconPaidGoogle,
  IconPaidMeta,
  IconPaidRetargeting,
  IconPaidLinkedIn,
  IconPaidTikTok,
  IconPaidTracking,
  IconPaidLandingPage,
  IconPaidAdCreative,
} from '@/components/icons/Icons';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';

// ── Services data ─────────────────────────────────────────────────────────────

const services = [
  {
    Icon: IconPaidSnapchat,
    title: 'Snapchat Ads',
    desc: 'Mobile-first campaigns for local reach, younger audiences, and quick engagement.',
  },
  {
    Icon: IconPaidGoogle,
    title: 'Google Ads',
    desc: 'Search, display, shopping, Performance Max, and YouTube campaigns built to capture demand and drive measurable action.',
  },
  {
    Icon: IconPaidMeta,
    title: 'Meta Ads',
    desc: 'Facebook, Instagram, Messenger, and WhatsApp campaigns built around creative, targeting, leads, and sales.',
  },
  {
    Icon: IconPaidRetargeting,
    title: 'Retargeting Campaigns',
    desc: 'Ads that bring back people who visited, clicked, added to cart, or showed interest.',
  },
  {
    Icon: IconPaidLinkedIn,
    title: 'LinkedIn Ads',
    desc: 'B2B campaigns for lead generation, brand awareness, hiring, and decision-maker reach.',
  },
  {
    Icon: IconPaidTikTok,
    title: 'TikTok Ads',
    desc: 'Short-form campaigns built for attention, discovery, and product interest.',
  },
  {
    Icon: IconPaidTracking,
    title: 'Tracking & Reporting',
    desc: 'Pixel, tag, event, and conversion tracking with clear performance reports.',
  },
  {
    Icon: IconPaidLandingPage,
    title: 'Landing Page Strategy',
    desc: 'Campaign pages shaped to turn paid traffic into leads, bookings, or sales.',
  },
  {
    Icon: IconPaidAdCreative,
    title: 'Ad Creative & Copy',
    desc: 'Visuals, hooks, headlines, and messages built for each platform.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaidAdvertisingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-hidden">
      <Header />

      {/* ── Hero Section ── */}
      <section
        className="w-full relative overflow-hidden"
        style={{ background: 'linear-gradient(0deg, #A7F076 0%, #FFFFFF 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-24 pt-16 sm:pt-24 pb-0">
          <FadeIn direction="up" className="pl-0 sm:pl-11 lg:pl-11">
            {/* Label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Paid Advertising Services
            </p>

            {/* Heading */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-[#111827] leading-[1.15] max-w-2xl mb-5">
              Paid campaigns built to bring{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                better leads, not wasted clicks
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed mb-10 font-normal">
              From Meta and Google to LinkedIn, TikTok, and Snapchat, we plan, launch, and manage paid
              campaigns with clear targeting, strong creative, clean tracking, and a sharp focus on return.
            </p>
          </FadeIn>

          {/* Hero image — extends to bottom edge of section */}
          <ScaleIn delay={0.2} className="relative flex justify-center items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/paid-ads-hero.webp"
              alt="Paid Advertising Dashboard — AdLaunch platform showing campaign performance across Meta, Google, LinkedIn, TikTok, and Snapchat"
              className="w-full max-w-5xl h-auto object-contain object-bottom hover:scale-[1.01] transition-transform duration-500"
            />
          </ScaleIn>

        </div>
      </section>

      {/* ── Paid Advertising Services Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-24 py-16 sm:py-24 w-full">
        <div className="pl-0 sm:pl-11 lg:pl-11">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] leading-tight mb-8 sm:mb-12 max-w-sm">
              Paid Advertising Services
            </h2>
          </FadeIn>

          {/* 3-column grid with horizontal dividers */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, desc }, i) => {
              const isLastRow = i >= services.length - (services.length % 3 || 3);
              return (
                <StaggerItem
                  key={title}
                  className={`flex flex-col gap-3 py-6 sm:py-8 pr-4 sm:pr-8 hover:translate-x-1 transition-transform duration-300 ${
                    !isLastRow ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-start text-[#111827]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── PPC & Paid Advertising Section ── */}
      <section className="w-full px-4 sm:px-16 lg:px-24 pt-4 sm:pt-8 pb-0">
        <div className="max-w-7xl mx-auto pl-0 sm:pl-11 lg:pl-11">
          <FadeIn direction="up">
            {/* Two-column text row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12">

              {/* Left Column */}
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] leading-tight mb-3">
                    PPC &amp; Paid Advertising
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-[#111827]">
                    Fast visibility for the customers most likely to buy
                  </p>
                </div>

                {/* Bullet points */}
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: '◎', text: 'Target the right audience' },
                    { icon: '≡', text: 'Get measurable results faster' },
                    { icon: '↗', text: 'Increase leads, sales, and revenue' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-[#111827] font-medium hover:translate-x-1 transition-transform">
                      <span className="text-base leading-none">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column — description text */}
              <div className="flex flex-col justify-center gap-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Paid ads help your brand show up when your best customers are searching, scrolling, comparing, or ready to act.
                </p>
                <p>
                  At The Coral Room, we plan and manage campaigns across Google, Meta, LinkedIn, TikTok, and Snapchat with clear targeting, strong creative, landing page alignment, and clean tracking.
                </p>
                <p>
                  SEO builds long-term visibility. Paid media gives you speed. Used together, they help you capture demand now and build stronger growth over time.
                </p>
              </div>

            </div>
          </FadeIn>

          {/* Magnet image — right-aligned, fully inside white PPC section */}
          <ScaleIn delay={0.2} className="flex justify-center sm:justify-end mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/magnet-hand.webp"
              alt="Hand holding a horseshoe magnet — attract the right customers"
              className="w-full max-w-[380px] sm:w-[480px] h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            />
          </ScaleIn>

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 px-4 sm:px-16 lg:px-24 relative overflow-hidden">
        <FadeIn direction="up" className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-snug max-w-xl">
            Need paid campaigns that bring better customers?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-xl leading-relaxed font-medium">
            Let&apos;s build campaigns across Google, Meta, LinkedIn, TikTok, and Snapchat with the right targeting, creative, tracking, and landing page flow.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-5 sm:px-7 py-3 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center gap-3 shadow-md hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Start a Campaign Discussion</span>
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
