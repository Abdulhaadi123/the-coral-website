'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';

export default function FourthDimensionFrameworkPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-hidden">
      <Header />

      {/* ── Hero Section ── */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 pt-14 sm:pt-20 pb-12">
        <FadeIn direction="up">
          {/* Muted Label */}
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
            INSIGHT FIRST. STRATEGY LOCKED. RESULTS TRACKED.
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold text-[#111827] leading-[1.1] mb-6">
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
            className="btn-hover-gradient inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#A7F076] text-[#111827] font-semibold text-sm hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 duration-200"
          >
            Book a Discovery Call →
          </Link>
        </FadeIn>

        {/* ── Diagram Graphic ── */}
        <ScaleIn delay={0.2} className="w-full mt-12 sm:mt-16 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fourth-dimension-framework.webp"
            alt="The Fourth Dimension Framework Diagram — Discover, Define, Develop, and Drive stages"
            className="w-full max-w-5xl h-auto object-contain hover:scale-[1.01] transition-transform duration-500"
          />
        </ScaleIn>

      </section>

      {/* ── What is Fourth Dimension™ & What Makes Our Approach Different (Unified White Section) ── */}
      <section className="w-full bg-white py-16 sm:py-24 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-20 sm:gap-28">
          
          {/* Part 1: What is Fourth Dimension™ & Why it Matters */}
          <FadeIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Left Title */}
              <div className="lg:col-span-5">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight sticky top-24">
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
                      Most digital projects struggle because the work happens in pieces. The brand says one
                      thing, the website does another, and the marketing has no clear path to follow.
                    </p>
                    <p>
                      Fourth Dimension™ brings everything into alignment before the work moves forward. It helps us
                      understand the business, define the direction, build with purpose, and keep improving after
                      launch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Part 2: What Makes Our Approach Different */}
          <FadeIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Left Title */}
              <div className="lg:col-span-5">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight sticky top-24">
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
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
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
      <section className="w-full pt-16 sm:pt-24">
        
        {/* Section Header */}
        <FadeIn direction="up" className="max-w-6xl mx-auto px-6 sm:px-12 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3 leading-tight">
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
            <FadeIn
              key={title}
              direction="up"
              className="w-full px-6 sm:px-12 py-16 sm:py-24 text-white"
              style={{ backgroundColor: bg }}
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                
                {/* Left Column — Large Title */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/80">
                    STAGE {num}
                  </span>
                  <h3 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
                    {title}
                  </h3>
                </div>

                {/* Right Column — Details & Badges */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {subtitle}
                  </h4>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl font-normal">
                    {desc}
                  </p>

                  {/* Badges / Tags */}
                  <div className="flex flex-wrap gap-2 pt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </section>

      {/* ── Want to see how Fourth Dimension... Section (White BG) ── */}
      <section className="w-full bg-white py-20 sm:py-28 px-6 sm:px-12">
        <FadeIn direction="up" className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-[1.18] tracking-tight">
              Want to see how Fourth Dimension™ could shape your digital growth?
            </h2>
            <Link
              href="/book-a-call"
              className="btn-hover-gradient inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#82D642] text-[#111827] font-semibold text-sm hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 duration-200"
            >
              Explore the Framework With Us →
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
      <section className="w-full bg-[#F8FAFC] py-16 sm:py-24 px-6 sm:px-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <FadeIn direction="up" className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Recent Work
            </h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors"
            >
              <span>View all projects</span>
              <span>↗</span>
            </Link>
          </FadeIn>

          {/* 4 Cards Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'JI Beach',
                category: 'Website',
                img: '/images/recent-work/ji-beach.webp',
              },
              {
                title: 'Nemo Restaurant',
                category: 'Website',
                img: '/images/recent-work/nemo-restaurant.webp',
              },
              {
                title: 'The First Group',
                category: 'Hospitality Website',
                img: '/images/recent-work/the-first-group.webp',
              },
              {
                title: 'Cloud Spaces',
                category: 'Website',
                img: '/images/recent-work/cloud-spaces.webp',
              },
            ].map(({ title, category, img }) => (
              <StaggerItem
                key={title}
                className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all flex flex-col"
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
                  <h3 className="font-bold text-sm text-[#111827]">{title}</h3>
                  <p className="text-xs text-gray-400 font-medium">{category}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      <FooterSection />
    </main>
  );
}
