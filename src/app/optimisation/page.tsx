'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { ArrowRight } from 'lucide-react';

export default function OptimisationPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col justify-between overflow-hidden">
      
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-12 pb-16 w-full">
        <FadeIn direction="up">
          {/* Tag / Category */}
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-4">
            OPTIMISATION
          </span>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] max-w-4xl mb-8">
            Website performance that{' '}
            <span className="text-gradient-figma">
              turns more traffic into customers
            </span>
          </h1>

          {/* Subtitle / Intro Text */}
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl leading-relaxed">
            A better website is not always a new website. Sometimes it needs cleaner SEO, faster speed, stronger pages, clearer journeys, and better conversion points. At The Coral Room, we improve what already exists so your site can rank better, load faster, convert stronger, and keep performing after launch.
          </p>
        </FadeIn>
      </section>

      {/* Center Google Blurred G Graphic + 3 Glassmorphism Metric Cards */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-12 w-full relative overflow-hidden">
        
        {/* Google "G" Logo - centered, blurred */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="relative w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[560px] lg:h-[560px] select-none" style={{ filter: 'blur(10px) saturate(1.1)', opacity: 0.75 }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path fill="#448AFF" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-1.14 2.76-2.4 3.61l3.7 2.87c2.17-2 3.75-4.94 3.75-8.31z"/>
              <path fill="#43A047" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.23 1.1-3.26 0-6.01-2.2-7-5.15l-3.83 2.97C3.12 21.3 7.23 24 12 24z"/>
              <path fill="#FFC107" d="M5 14.27a7.12 7.12 0 0 1 0-4.54V6.76H1.17a11.96 11.96 0 0 0 0 10.48L5 14.27z"/>
              <path fill="#F44336" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.12 2.7 1.17 6.76L5 10.27c.99-2.95 3.74-5.52 7-5.52z"/>
            </svg>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <StaggerContainer className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center max-w-5xl mx-auto my-8">
          
          {/* Card 1: Conversions (Left) */}
          <StaggerItem className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-1">Conversions</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-12">We test what works</p>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              +27%
            </div>
          </StaggerItem>

          {/* Card 2: Visibility (Center - Featured) */}
          <StaggerItem className="bg-white/90 backdrop-blur-lg border border-white/60 rounded-3xl p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.03] md:-translate-y-2 hover:shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1">Visibility</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-14">We help people find you</p>
            <div className="text-5xl sm:text-6xl font-extrabold text-[#111827] tracking-tight">
              +42%
            </div>
          </StaggerItem>

          {/* Card 3: User Testing (Right) */}
          <StaggerItem className="bg-white/65 backdrop-blur-md border border-white/45 rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-1">User Testing</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-12">We detect what is frustrating users</p>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              +25%
            </div>
          </StaggerItem>

        </StaggerContainer>

      </section>

      {/* Lower Content Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 w-full">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="md:col-span-5">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
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
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* Left: Section Title */}
          <FadeIn direction="up" className="md:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-snug">
              Optimisation &amp;<br />Performance<br />Services
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
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 w-full">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left: Big Heading */}
            <div className="md:col-span-5">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] leading-tight">
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

      {/* ── 4 Icon Cards Section ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-12 lg:py-16 w-full">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {[
            {
              img: '/images/optimisation-icons/icon4.webp',
              label: 'Built-in tracking tools and dashboards',
            },
            {
              img: '/images/optimisation-icons/icon1.webp',
              label: 'Always user-first, never just "tweak for the sake of it"',
            },
            {
              img: '/images/optimisation-icons/icon3.webp',
              label: 'Blend of qualitative (user behaviour) + quantitative (conversion data)',
            },
            {
              img: '/images/optimisation-icons/icon2.webp',
              label: 'Ideal for both high - traffic sites and newly launched projects',
            },
          ].map((card) => (
            <StaggerItem key={card.label} className="flex flex-col gap-4 items-start">
              <div className="w-12 h-12 flex items-center justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt={card.label} className="w-full h-full object-contain object-left" />
              </div>
              <p className="text-sm text-gray-700 leading-snug font-normal max-w-[220px]">
                {card.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Built on Fourth Dimension™ Section ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: 4th Dimension Graphic */}
          <ScaleIn className="md:col-span-5 flex items-center justify-center" delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fourth-dimension-graphic.webp"
              alt="Fourth Dimension Framework - Design, Develop, Optimise, Marketing"
              className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </ScaleIn>

          {/* Right: Text Content */}
          <FadeIn direction="up" className="md:col-span-7 flex flex-col gap-6" delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
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
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
              <Link
                href="/fourth-dimension-framework"
                className="btn-hover-gradient group shrink-0 px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95"
              >
                <span>Learn more about Fourth Dimension™</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/book-a-call"
                className="btn-hover-gradient group shrink-0 px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95"
              >
                <span>Book a Discovery Call</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── Call To Action Banner Section ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 px-6 sm:px-12 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-snug">
            Not sure why your website is underperforming?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            We&apos;ll review the gaps in speed, SEO, UX, tracking, and conversions, then show you what to fix first.
          </p>
          <Link
            href="/book-a-call"
            className="btn-hover-gradient mt-2 inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
          >
            Book a Website Audit
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
