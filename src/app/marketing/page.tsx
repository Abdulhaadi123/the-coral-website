'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';
import {
  IconInboundMarketing,
  IconEmailPaidAds,
  IconMarketingAutomation,
  IconCrmStrategy,
  IconLeadPipeline,
  IconCampaignCreative,
  IconApproachIntent,
  IconApproachCrm,
  IconApproachFunnel,
  IconApproachTesting,
} from '@/components/icons/Icons';

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      
      {/* Header Navigation */}
      <Header />

      {/* ── Top Hero + Grow With Clearer Marketing Section (Green Gradient BG) ── */}
      <div style={{ background: 'linear-gradient(0deg, #A7F076 0%, #ffffff 50%, #ffffff 100%)' }} className="w-full pb-20 relative overflow-hidden">
        
        {/* Right Megaphone Image — arm cut hidden cleanly off-screen */}
        <div className="hidden sm:block absolute right-[-120px] sm:right-[-170px] md:right-[-210px] lg:right-[-260px] xl:right-[-300px] top-[-10px] sm:top-[-20px] lg:top-[-25px] w-[560px] sm:w-[720px] md:w-[860px] lg:w-[1000px] pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/marketing-megaphone.webp"
            alt="Marketing Megaphone Illustration"
            style={{ transform: 'scaleX(-1) rotate(2deg)', transformOrigin: 'center center' }}
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Hero Container */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-20 sm:pb-24 lg:pb-28 w-full relative min-h-[500px]">
          
          {/* Left Content */}
          <FadeIn direction="up" className="max-w-xl md:max-w-2xl lg:max-w-3xl z-10 relative">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-4">
              DIGITAL MARKETING
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold tracking-tight mb-6 text-[#111827]" style={{ lineHeight: '1.10' }}>
              <span className="block sm:whitespace-nowrap">Marketing that connects</span>
              <span className="block mt-1">
                <span className="text-[#598323]">visibility,</span>{' '}
                <span className="text-[#84D450]">leads,</span>{' '}
                <span className="text-[#00C0E8]">and</span>
              </span>
              <span className="block text-[#78B249]">
                revenue
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-700 max-w-[440px] md:max-w-[480px] lg:max-w-[520px] leading-relaxed">
              We plan and run content, email, automation, CRM, paid campaigns, and lead pipelines that help your brand get seen, stay relevant, and turn interest into revenue. Every channel works with one clear purpose: attract better leads, guide them through the journey, and build a pipeline your team can measure and grow.
            </p>
          </FadeIn>

          {/* Mobile fallback image */}
          <div className="flex sm:hidden mt-8 justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/marketing-megaphone.webp"
              alt="Marketing Megaphone Illustration"
              className="w-full max-w-[280px] sm:max-w-[340px] h-auto object-contain drop-shadow-lg scale-x-[-1]"
            />
          </div>

        </section>

        {/* Section 2: Grow With Clearer Marketing */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 w-full">
          <FadeIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Title */}
              <div className="md:col-span-5">
                <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight">
                  Grow With Clearer Marketing, Not More Noise
                </h2>
              </div>

              {/* Right Content */}
              <div className="md:col-span-7 flex flex-col gap-5 text-sm sm:text-base text-gray-800 leading-relaxed">
                <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                  Good marketing is not about posting more, spending more, or chasing every channel.
                </h3>

                <p className="text-gray-700">
                  We help brands connect their message, campaigns, CRM, automation, and lead pipelines so every touchpoint has a clear job. Whether you need one focused campaign or a full marketing system, we keep the work tied to visibility, qualified leads, and measurable growth.
                </p>

                {/* 4 Bullet Points */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-semibold text-gray-800">
                  {[
                    'Campaigns tied to real outcomes',
                    'CRM and automation working together',
                    'Every channel with a clear job',
                    'Leads that move through the pipeline',
                  ].map((point) => (
                    <StaggerItem key={point} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111827] shrink-0" />
                      <span>{point}</span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

              </div>

            </div>
          </FadeIn>
        </section>

      </div>

      {/* Section 3: Strategic Marketing Services (White BG) */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Gradient Title */}
          <FadeIn direction="up" className="md:col-span-5">
            <h2 className="text-[28px] sm:text-[48px] font-medium leading-[1.15] tracking-[0px]">
              <span
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="block"
              >
                Strategic
              </span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="block"
              >
                Marketing
              </span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="block"
              >
                Services
              </span>
            </h2>
          </FadeIn>

          {/* Right Services Grid */}
          <StaggerContainer className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {[
              {
                Icon: IconInboundMarketing,
                title: 'Inbound & Content Marketing',
                desc: 'Content that builds trust, visibility, and qualified interest.',
                href: '/marketing-campaigns',
              },
              {
                Icon: IconEmailPaidAds,
                title: 'Paid Ads',
                desc: 'Meta, Google, LinkedIn, TikTok, and Snapchat campaigns with clear tracking.',
                href: '/paid-advertising',
              },
              {
                Icon: IconEmailPaidAds,
                title: 'Email Marketing',
                desc: 'Campaigns and journeys that nurture leads and drive action.',
                href: null,
              },
              {
                Icon: IconLeadPipeline,
                title: 'Lead Pipeline Strategy',
                desc: 'Landing pages, forms, CRM flows, and campaigns connected.',
                href: null,
              },
              {
                Icon: IconMarketingAutomation,
                title: 'Marketing Automation',
                desc: 'Workflows for follow-ups, lead scoring, and conversion triggers.',
                href: null,
              },
              {
                Icon: IconCampaignCreative,
                title: 'Campaign Creative & Copy',
                desc: 'Ad copy, social content, email copy, and campaign messaging.',
                href: null,
              },
              {
                Icon: IconCrmStrategy,
                title: 'CRM Strategy & Setup',
                desc: 'Pipelines, stages, and reporting for cleaner sales management.',
                href: null,
              },
            ].map(({ Icon, title, desc, href }) => {
              const inner = (
                <StaggerItem key={title} className="flex flex-col gap-2 group">
                  <div className="w-8 h-8 flex items-center justify-start text-[#111827]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#467923] transition-colors duration-300">{title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{desc}</p>
                </StaggerItem>
              );
              return href ? (
                <Link key={title} href={href} className="block">
                  {inner}
                </Link>
              ) : inner;
            })}
          </StaggerContainer>

        </div>
      </section>

      {/* ── Our Approach Section (#F0F0F0 background) ── */}
      <section className="w-full bg-[#F0F0F0] py-16 sm:py-20">
        <FadeIn direction="up" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col">
          
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] mb-3">
            Our Approach
          </h2>
          
          <p className="text-sm sm:text-base font-semibold text-[#111827] mb-2">
            We build marketing that leads somewhere.
          </p>
          
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed mb-12 font-normal">
            Every campaign needs a reason, a route, and a way to measure what happened next. We connect creative, targeting, CRM, automation, and reporting so your marketing supports the pipeline, not just the feed.
          </p>

          {/* 4 Feature Columns */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 items-start">
            {[
              { img: '/images/optimisation-icons/icon1.webp', text: 'Campaigns with clear intent' },
              { img: '/images/optimisation-icons/icon2.webp', text: 'CRM and tools kept clean' },
              { img: '/images/optimisation-icons/icon3.webp', text: 'Full-funnel tracking' },
              { img: '/images/optimisation-icons/icon4.webp', text: 'Testing that improves performance' },
            ].map(({ img, text }) => (
              <StaggerItem key={text} className="flex flex-col gap-4">
                <div className="w-10 h-10 flex items-center justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={text} className="w-full h-full object-contain object-left" />
                </div>
                <span className="text-sm font-bold text-[#111827] leading-snug max-w-full sm:max-w-[180px]">
                  {text}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <p className="text-xs font-semibold text-gray-700 max-w-lg leading-relaxed">
            Marketing works best when every channel has a job and every lead has a next step.
          </p>

        </FadeIn>
      </section>

      {/* ── Built on Fourth Dimension™ Section ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 w-full border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: Fourth Dimension Graphic */}
          <ScaleIn className="md:col-span-5 flex items-center justify-center" delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fourth-dimension-graphic.webp"
              alt="Fourth Dimension Framework - Design, Develop, Optimise, Marketing"
              className="w-full max-w-[280px] sm:max-w-[400px] h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </ScaleIn>

          {/* Right: Text Content */}
          <FadeIn direction="up" className="md:col-span-7 flex flex-col gap-5" delay={0.15}>
            <h2 className="text-2xl sm:text-5xl font-semibold text-[#111827] leading-tight">
              Built on Fourth Dimension™
            </h2>
            <div className="flex flex-col gap-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                Marketing extends the Fourth Dimension™ framework beyond the website. We connect traffic, content, campaigns, CRM, and automation so the experience keeps working after the first click.
              </p>
              <p className="font-semibold text-gray-800">
                We are not just launching campaigns. We are building digital growth systems.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 mt-3 w-full">
              <Link
                href="/fourth-dimension-framework"
                className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center justify-between sm:justify-start gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95"
              >
                <span>Learn more about Fourth Dimension™</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link
                href="/book-a-call"
                className="btn-hover-gradient group shrink-0 px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center justify-between sm:justify-start gap-2.5 hover:border-transparent hover:text-white transition-all duration-300 whitespace-normal sm:whitespace-nowrap shadow-sm hover:scale-105 active:scale-95"
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

      {/* ── Featured Work Section (#A7F076 Lime Green BG) ── */}
      <section className="w-full bg-[#A7F076] pt-14 sm:pt-20 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col">
          
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-5xl font-semibold text-white mb-8 sm:mb-10 tracking-tight">
              Featured Work
            </h2>
          </FadeIn>

          {/* 4 Cards Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Elovira Packaging',
                client: 'Elovira',
                tag: 'FMGC',
                img: assetUrl('/images/featured/elovira.webp'),
              },
              {
                title: 'Liviq Smart Home App',
                client: 'Liviq',
                tag: 'SERVICES',
                img: assetUrl('/images/featured/liviq.webp'),
              },
              {
                title: 'V3 By The Vertical Launch Campaign',
                client: 'The Vertical',
                tag: 'CO WORKING SPACES',
                img: assetUrl('/images/featured/the-vertical.webp'),
              },
              {
                title: 'Finlo Smart Banking',
                client: 'Finlo',
                tag: 'BANKING',
                img: assetUrl('/images/featured/finlo.webp'),
              },
            ].map(({ title, client, tag, img }) => (
              <StaggerItem
                key={title}
                className="relative group rounded-[21px] overflow-hidden flex flex-col justify-end bg-white/5 aspect-[4/5] sm:aspect-[3/5]"
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col gap-1.5 p-5 pb-6">
                  <h3 className="text-xl font-bold text-white leading-snug">{title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium uppercase tracking-wide">
                    <span>{client}</span>
                    <span>•</span>
                    <span>{tag}</span>
                  </div>

                  <Link
                    href="/portfolio"
                    className="mt-4 self-start inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/60 text-white text-xs font-semibold hover:bg-white hover:text-[#111827] transition-all"
                  >
                    <span>View project</span>
                    <span className="text-[10px]">↗</span>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Explore More Button */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827] hover:underline"
            >
              <span>Explore more of our work</span>
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-xl">
            Ready to turn your marketing into a stronger pipeline?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            Let&apos;s connect your content, campaigns, CRM, and automation into one clear system for leads and growth.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-7 py-3 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-sm inline-flex items-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
