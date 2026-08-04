'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import {
  IconBrandIdentity,
  IconUiUx,
  IconWebsiteDesign,
  IconMobileApp,
  IconSocialMedia,
  IconPackaging,
  IconCampaign,
  IconDigitalAssets,
} from '@/components/icons/Icons';

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col justify-between overflow-hidden">
      
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-12 pb-16 w-full">
        <FadeIn direction="up">
          {/* Category Tag */}
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-4">
            DESIGN SERVICES
          </span>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] max-w-4xl mb-8">
            Design that looks sharp,{' '}
            <span className="text-gradient-figma">
              feels natural, and supports action
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl leading-relaxed">
            From brand identity and UI/UX to social media creatives, packaging, and campaign visuals, we create design systems that help your brand look consistent, feel credible, and move people closer to choosing you.
          </p>
        </FadeIn>
      </section>

      {/* Section 2: Brand Recognition & Trust */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-20 w-full border-t border-gray-100">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Title */}
            <div className="md:col-span-5">
              <h2 className="text-[36px] sm:text-[48px] font-medium text-[#111827] leading-[1.25] tracking-[0px]">
                Design that makes your brand easier to recognize, trust, and choose
              </h2>
            </div>

            {/* Right Description */}
            <div className="md:col-span-7 flex flex-col gap-6 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                Your brand is judged before a customer speaks to you. It shows up in your logo, website, packaging, ads, social content, and every visual touchpoint people see.
              </p>
              <p>
                At The Coral Room, we help brands build a visual presence that feels clear, consistent, and ready to work across every customer touchpoint.
              </p>
              <p className="font-medium text-gray-800">
                Our design work follows the Fourth-Dimension™ framework which keeps every creative decision connected to strategy, usability, performance, and growth.
              </p>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* Section 3: Design Services Grid (Gradient Mesh Section) */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 sm:py-24 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">

          {/* Left Heading */}
          <FadeIn direction="up" className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight max-w-md">
              Design services built for every brand touchpoint
            </h2>
          </FadeIn>

          {/* Right: 2-Column Cards Grid */}
          <StaggerContainer className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { Icon: IconBrandIdentity,  title: 'Brand Identity',        desc: 'Logo, color, typography, and visual direction for a clear brand look.' },
              { Icon: IconUiUx,           title: 'UI/UX Design',          desc: 'Website and app interfaces shaped around clarity, flow, and action.' },
              { Icon: IconWebsiteDesign,  title: 'Website Design',        desc: 'Responsive designs for websites, ecommerce stores, and landing pages.' },
              { Icon: IconMobileApp,      title: 'Mobile App Design',     desc: 'App screens and user flows built for smooth mobile interaction.' },
              { Icon: IconSocialMedia,    title: 'Social Media Creatives', desc: 'Branded posts, ads, stories, banners, and campaign assets.' },
              { Icon: IconPackaging,      title: 'Packaging Design',      desc: 'Product packaging that helps your brand stand out and feel credible.' },
              { Icon: IconCampaign,       title: 'Campaign Visuals',      desc: 'Creative assets for launches, offers, ads, emails, and promotions.' },
              { Icon: IconDigitalAssets,  title: 'Digital Design Assets', desc: 'Decks, brochures, profiles, lead magnets, and branded collateral.' },
            ].map(({ Icon, title, desc }) => (
              <StaggerItem
                key={title}
                className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white/80 hover:scale-[1.02]"
              >
                <div className="w-9 h-9 flex items-center justify-start text-[#111827] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-1.5">{title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* ── Our Approach Section ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: Fourth Dimension Graphic */}
          <ScaleIn className="md:col-span-5 flex items-center justify-center" delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fourth-dimension-graphic.webp"
              alt="Fourth Dimension Framework - Design, Develop, Optimise, Marketing"
              className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </ScaleIn>

          {/* Right: Text Content */}
          <FadeIn direction="up" className="md:col-span-7 flex flex-col gap-5" delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
              Our Approach
            </h2>
            <p className="text-base font-semibold text-gray-800">
              Design starts with direction, not decoration.
            </p>
            <div className="flex flex-col gap-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                Every design project at The Coral Room follows our Fourth-Dimension™ framework, a four-stage process that turns brand clarity into visual work people can recognise, trust, and act on.
              </p>
              <p>
                We study the brand, audience, market, message, and touchpoints before shaping the identity, interface, and creative assets. That keeps the work focused, consistent, and useful across every channel.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
              <Link
                href="/fourth-dimension-framework"
                className="btn-hover-gradient group shrink-0 px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                <span>Learn more about Fourth Dimension™</span>
              </Link>
              <Link
                href="/book-a-call"
                className="btn-hover-gradient group shrink-0 px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm inline-flex items-center gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                <span>Book a Discovery Call</span>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── 4 Steps: Discover → Define → Develop → Drive ── */}
      <section className="w-full border-t border-gray-100 px-6 sm:px-12 lg:px-16">
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4">
          {[
            { num: '01', step: 'Discover', desc: 'Research, audit, and understanding' },
            { num: '02', step: 'Define',   desc: 'Strategy, positioning, and direction' },
            { num: '03', step: 'Develop',  desc: 'Design, build, and refine' },
            { num: '04', step: 'Drive',    desc: 'Launch, optimise, and grow' },
          ].map(({ num, step, desc }) => (
            <StaggerItem key={step} className="flex flex-row items-center gap-2 sm:gap-3 py-8 sm:py-10 pr-2 sm:pr-4">
              {/* Ghost Number — left side */}
              <span
                className="shrink-0 text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold text-gray-100 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                {num}
              </span>
              {/* Text — right side */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#78B249]">{step}</span>
                <span className="text-[10px] sm:text-sm text-gray-600 leading-snug">{desc}</span>
              </div>
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
            Start with a focused Design Clarity Session. We review your brand, website, visuals, and customer touchpoints, then map the clearest next move for your identity, UI, content, or campaigns.
          </p>
          <Link
            href="/book-a-call"
            className="btn-hover-gradient mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-sm hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
          >
            Book a Discovery Call →
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
