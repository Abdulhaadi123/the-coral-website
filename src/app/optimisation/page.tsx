'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { ArrowUpRight } from 'lucide-react';

export default function OptimisationPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col justify-between overflow-hidden">
      
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-12 pb-16 w-full">
        <FadeIn direction="up" className="pl-6 sm:pl-12 md:pl-16 lg:pl-20">
          {/* Tag / Category */}
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-4">
            OPTIMISATION
          </span>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold tracking-tight max-w-4xl mb-8 text-[#111827]" style={{ lineHeight: '1.10' }}>
            Website performance that{' '}
            <span className="block sm:inline">
              turns{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                more traffic into customers
              </span>
            </span>
          </h1>

          {/* Subtitle / Intro Text */}
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl leading-relaxed">
            A better website is not always a new website. Sometimes it needs cleaner SEO, faster speed, stronger pages, clearer journeys, and better conversion points. At The Coral Room, we improve what already exists so your site can rank better, load faster, convert stronger, and keep performing after launch.
          </p>
        </FadeIn>
      </section>

      {/* Center Google Blurred G Graphic + 3 Glassmorphism Metric Cards */}
      <section
        className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-28 pb-24 sm:pt-36 sm:pb-32 lg:pt-44 lg:pb-40 w-full relative"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 55% 50%, rgba(68,138,255,0.10) 0%, rgba(68,138,255,0.04) 50%, transparent 75%)',
        }}
      >
        
        {/* Google "G" Logo — Exact Figma W:736 H:762, Precision Official Paths, 16px Layer Blur */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div
            className="relative w-[340px] h-[350px] sm:w-[560px] sm:h-[580px] lg:w-[736px] lg:h-[762px] select-none"
            style={{ filter: 'blur(16px)', opacity: 1 }}
          >
            <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Red — Top Arc */}
              <path fill="#F44336" d="M 24,9.5 C 28.75,9.5 32.7,11.2 35.75,13.9 L 42.5,7.15 C 38.4,3.35 32.2,1 24,1 C 14.6,1 6.5,6.4 2.6,14.2 L 10.6,20.4 C 12.4,14 17.7,9.5 24,9.5 Z"/>
              {/* Blue — Right Arm & Crossbar */}
              <path fill="#448AFF" d="M 47,24.5 C 47,22.8 46.8,21.2 46.5,19.6 H 24 V 29.1 H 36.9 C 36.3,32.2 34.6,34.8 32,36.5 L 39.7,42.5 C 44.2,38.3 47,32 47,24.5 Z"/>
              {/* Yellow — Left Arc */}
              <path fill="#FFC107" d="M 10.6,27.6 C 9.8,25.2 9.8,22.8 10.6,20.4 L 2.6,14.2 C 0.9,17.4 0,20.6 0,24 C 0,27.4 0.9,30.6 2.6,33.8 L 10.6,27.6 Z"/>
              {/* Green — Bottom Arc */}
              <path fill="#43A047" d="M 24,47 C 30.5,47 36,44.9 39.7,41.4 L 32,35.4 C 29.9,36.8 27.2,37.7 24,37.7 C 17.7,37.7 12.4,33.2 10.6,26.8 L 2.6,33 C 6.5,40.8 14.6,47 24,47 Z"/>
            </svg>
          </div>
        </div>

        {/* 3 Metric Cards Grid — Exact Figma: 27% White Fill, 31px Rounded Corners, Glassmorphic Blur */}
        <StaggerContainer className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center max-w-5xl mx-auto">
          
          {/* Card 1: Conversions */}
          <StaggerItem
            className="aspect-square rounded-[31px] bg-[rgba(255,255,255,0.27)] p-7 sm:p-9 border border-white/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-1 tracking-tight">Conversions</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">We test what works</p>
            </div>
            <div className="text-3xl sm:text-5xl font-semibold text-[#111827] tracking-tight">
              +27%
            </div>
          </StaggerItem>

          {/* Card 2: Visibility */}
          <StaggerItem
            className="aspect-square rounded-[31px] bg-[rgba(255,255,255,0.27)] p-7 sm:p-9 border border-white/70 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] md:-translate-y-2 hover:shadow-2xl"
          >
            <div>
              <h3 className="text-xl sm:text-3xl font-semibold text-[#111827] mb-1 tracking-tight">Visibility</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">We help people find you</p>
            </div>
            <div className="text-3xl sm:text-6xl font-semibold text-[#111827] tracking-tight">
              +42%
            </div>
          </StaggerItem>

          {/* Card 3: User Testing */}
          <StaggerItem
            className="aspect-square rounded-[31px] bg-[rgba(255,255,255,0.27)] p-7 sm:p-9 border border-white/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-1 tracking-tight">User Testing</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">We detect what is frustrating users</p>
            </div>
            <div className="text-3xl sm:text-5xl font-semibold text-[#111827] tracking-tight">
              +25%
            </div>
          </StaggerItem>

        </StaggerContainer>

      </section>

      {/* Lower Content Section — balanced responsive spacing */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 w-full">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="md:col-span-5">
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight">
                Optimisation That Keeps Your Website Moving
              </h2>
            </div>
            <div className="md:col-span-7 flex flex-col gap-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>A website is not finished the day it launches. That is when real user behaviour starts to show what is working, what is slowing people down, and what needs to improve.</p>
              <p>At The Coral Room, we use SEO, CRO, site speed, analytics, UX updates, and ongoing support to remove friction and improve performance.</p>
              <p className="font-medium text-gray-800">The goal is simple: help your website rank better, load faster, convert more visitors, and keep getting stronger over time.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Services Grid Section ── */}
      <section className="w-full bg-[#F4F5F7] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">

          {/* Left: Section Title */}
          <FadeIn direction="up" className="md:col-span-4">
            <h2 className="text-xl sm:text-3xl font-semibold text-[#111827] leading-snug">
              Optimisation &amp;<br className="hidden sm:block" /> Performance<br className="hidden sm:block" /> Services
            </h2>
          </FadeIn>

          {/* Right: 2x2 Service Grid */}
          <StaggerContainer className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {[
              {
                title: 'Website Performance Audit',
                desc: 'A clear review of speed, UX, SEO, tracking, and conversion points.'
              },
              {
                title: 'Conversion Rate Optimisation',
                desc: 'Improvements to forms, landing pages, CTAs, user journeys, and key conversion points.'
              },
              {
                title: 'SEO & Search Visibility',
                desc: 'On-page SEO, off-page SEO, technical SEO, local SEO, and Q&A to help your brand get found across search and discovery platforms.'
              },
              {
                title: 'Website Maintenance & Support',
                desc: 'Updates, fixes, backups, and small improvements to keep your website stable.'
              },
              {
                title: 'Website Speed Optimisation',
                desc: 'Images, code, layout, and hosting improvements for faster load times.'
              },
            ].map((service) => (
              <StaggerItem key={service.title} className="border-b border-gray-300/80 pb-5 group hover:border-[#A7F076] transition-colors duration-300">
                <h3 className="text-sm font-bold text-[#111827] mb-1.5 group-hover:text-[#467923] transition-colors duration-300">{service.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{service.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Small Fixes Section ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 py-20 w-full">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left: Big Heading */}
            <div className="md:col-span-5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight">
                Small fixes.<br />Clear data.<br />Better results.
              </h2>
            </div>

            {/* Right: Description + Bullets */}
            <div className="md:col-span-7 flex flex-col gap-5 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                We use real user behaviour, analytics, search data, and conversion signals to see where your website is losing attention, traffic, or leads. Then we improve the parts that matter most.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {[
                  'Track key actions and conversion points',
                  'Review user behaviour and page flow',
                  'Improve weak pages, forms, and CTAs',
                  'Fix SEO, speed, and technical issues',
                  'Measure results before making the next move',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-gray-800 mt-2">
                The goal is steady progress, not random changes.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── 4 Icon Cards Section (Figma Exact WebP Icons & Order) ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 py-12 lg:py-16 w-full">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {[
            {
              img: '/images/optimisation-icons/icon1.webp',
              label: 'Built-in tracking tools and dashboards',
            },
            {
              img: '/images/optimisation-icons/icon2.webp',
              label: 'Always user-first, never just "tweak for the sake of it"',
            },
            {
              img: '/images/optimisation-icons/icon3.webp',
              label: 'Blend of qualitative (user behaviour) + quantitative (conversion data)',
            },
            {
              img: '/images/optimisation-icons/icon4.webp',
              label: 'Ideal for both high - traffic sites and newly launched projects',
            },
          ].map((card) => (
            <StaggerItem key={card.label} className="flex flex-col gap-4 items-start">
              <div className="w-12 h-12 flex items-center justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.label} className="w-full h-full object-contain object-left" />
              </div>
              <p className="text-sm text-gray-700 leading-snug font-normal w-full">
                {card.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Built on Fourth Dimension™ Section ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: 4th Dimension Graphic */}
          <ScaleIn className="md:col-span-5 flex items-center justify-center" delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fourth-dimension-graphic.webp"
              alt="Fourth Dimension Framework - Design, Develop, Optimise, Marketing"
              className="w-full max-w-[260px] sm:max-w-[400px] h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </ScaleIn>

          {/* Right: Text Content */}
          <FadeIn direction="up" className="md:col-span-7 flex flex-col gap-6" delay={0.15}>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight">
              Built on Fourth Dimension™
            </h2>
            <div className="flex flex-col gap-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                Our optimisation work follows the same Fourth Dimension™ Framework, even when we did not build the original website.
              </p>
              <p>
                We look at the full picture: brand, structure, content, search, user behaviour, speed, and conversion. Then we improve what matters most.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 mt-4 w-full">
              <Link
                href="/fourth-dimension-framework"
                className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center justify-center text-center gap-3 hover:border-transparent hover:text-white transition-all duration-300 whitespace-normal sm:whitespace-nowrap hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>Learn more about Fourth Dimension™</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/book-a-call"
                className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center justify-center text-center gap-3 hover:border-transparent hover:text-white transition-all duration-300 whitespace-normal sm:whitespace-nowrap hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>Book a Discovery Call</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── Call To Action Banner Section ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug">
            Not sure why your website is underperforming?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            We&apos;ll review the gaps in speed, SEO, UX, tracking, and conversions, then show you what to fix first.
          </p>
          <Link
            href="/book-a-call"
            className="btn-hover-gradient group mt-2 px-7 py-3.5 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-3 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span>Book a Website Audit</span>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
