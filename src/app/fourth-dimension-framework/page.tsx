'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

export default function FourthDimensionFrameworkPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-x-clip">
      <Header />

      {/* ── Hero Section ── */}
      <section className="w-full pt-6 sm:pt-8 lg:pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeIn direction="up">
            {/* Muted Label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              INSIGHT FIRST. STRATEGY LOCKED. RESULTS TRACKED.
            </p>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold text-[#111827] mb-6 break-words" style={{ lineHeight: '1.10' }}>
              <span
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                The Fourth Dimension™
              </span>{' '}
              <br className="hidden sm:inline" />
              Framework
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl font-semibold text-[#111827] max-w-3xl leading-snug mb-4">
              A four-stage process for building digital experiences with clarity, structure, and purpose.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl leading-relaxed mb-8">
              Fourth Dimension™ is how The Coral Room turns scattered ideas into focused digital work. We study
              the brand, define the direction, develop the right solution, and drive performance after launch.
            </p>

            {/* CTA Button */}
            <Link
              href="/book-a-call"
              className="btn-hover-gradient group inline-flex items-center justify-center max-w-full gap-3 px-7 py-3 rounded-full bg-[#A7F076] text-[#111827] font-semibold text-sm shadow-sm hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Book a Discovery Call</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </FadeIn>

        </div>

        {/* ── Diagram Graphic (Wider to match Figma exact) ── */}
        <ScaleIn delay={0.2} className="w-full max-w-[1360px] mx-auto px-4 sm:px-8 mt-12 sm:mt-16 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/flowchart.webp"
            alt="The Fourth Dimension Framework Diagram — Discover, Define, Develop, and Drive stages"
            className="w-full h-auto object-contain drop-shadow-sm"
          />
        </ScaleIn>
      </section>

      {/* ── What is Fourth Dimension™ & What Makes Our Approach Different (Unified White Section) ── */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-12 sm:gap-28">
          
          {/* Part 1: What is Fourth Dimension™ & Why it Matters */}
          <FadeIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
              {/* Left Title */}
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight sticky top-24 break-words">
                  What is Fourth Dimension™?
                </h2>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p className="text-gray-800 font-medium text-base sm:text-lg">
                  It is The Coral Room&apos;s four-stage framework for building digital experiences with clear
                  thinking, strong execution, and room to grow.
                </p>
                <p>
                  Each stage connects strategy, design, development, optimisation, and marketing into one
                  focused process.
                </p>

                <div className="pt-6 mt-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-4">
                    Why it Matters
                  </h3>
                  <div className="flex flex-col gap-4">
                    <p>
                      Digital projects often fail when work happens in isolation — design without strategy,
                      development without SEO, or marketing without a working platform.
                    </p>
                    <p>
                      Fourth Dimension™ connects every stage so the identity, structure, code, search
                      visibility, and marketing support each other.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Part 2: What Makes Our Approach Different */}
          <FadeIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 border-t border-gray-100 pt-16 sm:pt-20">
              {/* Left Title */}
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight sticky top-24 break-words">
                  What Makes Our Approach Different
                </h2>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
                  A process only works when every stage has a clear reason behind it. Fourth Dimension™ is built
                  around how people discover brands, compare options, move through websites, and decide who to trust.
                </p>

                {/* 2x2 Feature Grid */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pt-2">
                  <StaggerItem>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      It gives every part of the project a job, from the first piece of research to the final
                      campaign touchpoint.
                    </p>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Strategy, design, development, SEO, content, CRO, and marketing are connected from the start.
                    </p>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      We do not build in separate pieces. Each decision supports the next, and every stage has a
                      clear reason behind it.
                    </p>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Each stage can also work on its own. So whether you need direction, design, development,
                      optimisation, or growth support, we can meet the project where it is and move it forward with clarity.
                    </p>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── The Four Stages Breakdown (Stacked Full-Width Sections) ── */}
      <section className="w-full pt-16 sm:pt-20">
        
        {/* Section Header */}
        <FadeIn direction="up" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] mb-3 leading-tight break-words">
            The Four Stages of Fourth Dimension™
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl leading-relaxed">
            Every project follows a clear four-stage framework, built to align strategy, design, development,
            and growth from the start.
          </p>
        </FadeIn>

        {/* 4 Full-Width Stacked Blocks */}
        <div className="w-full">
          {[
            {
              num: '01',
              title: 'Discover',
              bg: '#9CD16C',
              subtitle: 'Understand the business, audience, market, and gaps.',
              desc: 'We start by learning what you want to achieve, who you need to reach, and what is holding the project back. This stage gives us the insight needed to make smarter decisions before strategy, design, development, or marketing begins.',
              tags: [
                'PROJECT KICKOFF',
                'BUSINESS GOALS REVIEW',
                'NEEDS ANALYSIS',
                'MARKET RESEARCH',
                'AUDIENCE RESEARCH',
                'COMPETITOR REVIEW',
                'CONTENT & ASSET AUDIT',
                'CURRENT WEBSITE REVIEW',
              ],
            },
            {
              num: '02',
              title: 'Define',
              bg: '#70AB5D',
              subtitle: 'Turn insight into a clear direction.',
              desc: 'We shape the structure, message, user flow, and creative direction before production begins. This gives the project a clear plan, so the design, content, build, and marketing decisions all move in the same direction.',
              tags: [
                'INFORMATION ARCHITECTURE',
                'SITEMAP PLANNING',
                'UX STRATEGY',
                'WIREFRAMES',
                'CONTENT DIRECTION',
                'PAGE STRUCTURE',
                'VISUAL DIRECTION',
                'PROTOTYPE PLANNING',
              ],
            },
            {
              num: '03',
              title: 'Develop',
              bg: '#59ACB1',
              subtitle: 'Create, build, and prepare the experience for launch.',
              desc: 'We bring the strategy to life through design, development, content setup, SEO foundations, integrations, and testing. Every part is built to look sharp, work smoothly, and stay easy to manage.',
              tags: [
                'UI DESIGN',
                'FRONTEND DEVELOPMENT',
                'BACKEND DEVELOPMENT',
                'CMS SETUP',
                'API & TOOL INTEGRATIONS',
                'CONTENT POPULATION',
                'SEO & TRACKING SETUP',
                'QA TESTING',
              ],
            },
            {
              num: '04',
              title: 'Drive',
              bg: '#3C95B9',
              subtitle: 'Launch, improve, and keep growth moving.',
              desc: 'We do not treat launch as the finish line. This stage covers training, maintenance, optimisation, SEO, campaigns, automation, and performance support so your digital presence keeps improving.',
              tags: [
                'LAUNCH SUPPORT',
                'CMS TRAINING',
                'WEBSITE CARE',
                'PERFORMANCE OPTIMISATION',
                'SEO IMPROVEMENTS',
                'CRO',
                'PAID ADS & MARKETING',
                'CRM & AUTOMATION SUPPORT',
              ],
            },
          ].map(({ num, title, bg, subtitle, desc, tags }) => (
            <div
              key={title}
              className="w-full py-16 sm:py-24 text-white"
              style={{ backgroundColor: bg }}
            >
              <FadeIn
                direction="up"
                className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start"
              >
                
                {/* Left Column — Large Title */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/80">
                    STAGE {num}
                  </span>
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight break-words">
                    {title}
                  </h3>
                </div>

                {/* Right Column — Details & Badges */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <h4 className="text-base sm:text-xl font-bold text-white leading-snug">
                    {subtitle}
                  </h4>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl font-normal">
                    {desc}
                  </p>

                  {/* Badges / Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors break-words max-w-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </FadeIn>
            </div>
          ))}
        </div>

      </section>

      {/* ── Want to see how Fourth Dimension... Section (White BG) ── */}
      <section className="w-full bg-white py-16 sm:py-20">
        <FadeIn direction="up" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] leading-[1.18] tracking-tight break-words">
              Want to see how Fourth Dimension™ could shape your digital growth?
            </h2>
            <Link
              href="/book-a-call"
              className="btn-hover-gradient group inline-flex items-center justify-center max-w-full gap-3 px-7 py-3.5 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-sm hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 text-center"
            >
              <span>Explore the Framework With Us</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-4 text-gray-600 pt-2">
            <p className="text-base sm:text-lg text-[#111827] font-semibold leading-relaxed">
              Strategy, design, development, and performance work together to build a stronger digital presence.
            </p>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Let us walk you through how each stage connects and what that means for your brand, your audience, and your results.
            </p>
          </div>

        </FadeIn>
      </section>

      {/* ── Recent Work Section (#F8FAFC Light Gray BG) ── */}
      <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          {/* Header */}
          <FadeIn direction="up" className="flex flex-row items-center justify-between gap-2 mb-10">
            <h2 className="text-xl sm:text-3xl font-semibold text-[#111827]">
              Recent Work
            </h2>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-transparent hover:border-[#111827] text-xs sm:text-sm font-semibold text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>View all projects</span>
              <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </FadeIn>

          {/* 4 Cards Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Elovira Packaging',
                category: 'Branding',
                img: assetUrl('/images/featured/elovira.webp'),
                slug: 'elovira-packaging',
              },
              {
                title: 'Mochae Brand Identity',
                category: 'Branding',
                img: assetUrl('/images/featured/mochae.webp'),
                slug: 'mochae-brand-identity',
              },
              {
                title: 'Omnix Project Management',
                category: 'Development',
                img: assetUrl('/images/portfolio/Rectangle 504 (16).webp'),
                slug: 'omnix-project-management',
              },
              {
                title: 'V3 Launch Campaign',
                category: 'Marketing',
                img: assetUrl('/images/portfolio/Rectangle 504 (18).webp'),
                slug: 'the-vertical-launch',
              },
            ].map(({ title, category, img, slug }) => (
              <StaggerItem key={title}>
                <Link
                  href={`/portfolio/${slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all flex flex-col block cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-0.5 bg-white">
                    <h3 className="font-bold text-sm text-[#111827] group-hover:text-[#78B249] transition-colors">{title}</h3>
                    <p className="text-xs text-gray-400 font-medium">{category}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      <FooterSection />
    </main>
  );
}
