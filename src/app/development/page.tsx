'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { BeyondTheCodeTimeline } from '@/components/BeyondTheCodeTimeline';

export default function DevelopmentPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col justify-between overflow-hidden">
      
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-12 w-full">
        <FadeIn direction="up">
          {/* Category Tag */}
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-4">
            WEBSITE DEVELOPMENT
          </span>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold tracking-tight max-w-4xl mb-6" style={{ lineHeight: '1.10' }}>
            Websites built to perform,{' '}
            <span
              className="block w-fit mt-1"
              style={{
                background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              scale and sell
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-3xl leading-relaxed">
            We build fast, responsive websites, ecommerce stores, WordPress platforms, Shopify stores, and custom CMS solutions that look sharp, work smoothly, and support real business growth.
          </p>
        </FadeIn>
      </section>

      {/* Hero Banner Image — Full width with clean rounded corners */}
      <ScaleIn className="w-full pb-0 overflow-hidden" delay={0.1}>
        <div className="w-full overflow-hidden rounded-[24px] sm:rounded-[36px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/development-hero.webp"
            alt="Website development mockup preview on laptop"
            className="w-full h-auto object-cover rounded-[24px] sm:rounded-[36px] transition-transform duration-700"
          />
        </div>
      </ScaleIn>

      {/* Section 2: How We Build Differently */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 w-full border-t border-gray-100">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Title */}
            <div className="md:col-span-5">
              <h2 className="text-2xl sm:text-4xl lg:text-[48px] font-medium leading-[1.2] tracking-[0px]">
                <span
                  style={{
                    background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  className="block pb-1"
                >
                  How We
                </span>
                <span
                  style={{
                    background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  className="block pb-1"
                >
                  Build
                </span>
                <span
                  style={{
                    background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  className="block pb-2"
                >
                  Differently
                </span>
              </h2>
            </div>

            {/* Right Description */}
            <div className="md:col-span-7 flex flex-col gap-5 text-sm sm:text-base text-gray-700 leading-relaxed">
              <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                Clean builds. Clear logic. No dead weight.
              </h3>
              <p>
                We build websites with the right structure behind the design: fast loading, responsive layouts, clean CMS setup, SEO-ready foundations, and smooth front-end experience.
              </p>
              <p>
                Whether it is WordPress, Shopify, ecommerce, or a custom build, we choose the stack around your goals, not trends.
              </p>
              <p className="font-medium text-gray-800">
                The result is a website that looks polished, works reliably, and can grow with your business.
              </p>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* Section 3: Website Development Services */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 w-full border-t border-gray-100">
        <div>
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-[#111827] mb-12 sm:mb-16">
              Website Development Services
            </h2>
          </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 sm:gap-y-10">
          {[
            {
              title: 'Business Website Development',
              desc: 'Fast, responsive websites built around your brand, users, and business goals.',
            },
            {
              title: 'WordPress Website Development',
              desc: 'Clean WordPress builds with custom layouts, flexible pages, and simple content control.',
            },
            {
              title: 'Shopify Store Development',
              desc: 'Conversion-focused Shopify stores built for product discovery, smooth checkout, and easy management.',
            },
            {
              title: 'Ecommerce Platform Development',
              desc: 'Online stores with clear structure, strong product pages, secure payments, and scalable setup.',
            },
            {
              title: 'Custom CMS Development',
              desc: 'Admin systems built for teams that need more control over content, products, users, or workflows.',
            },
            {
              title: 'Web Application Development',
              desc: 'Custom portals, dashboards, booking systems, and digital tools built around your business process.',
            },
            {
              title: 'Website Care & Support',
              desc: 'Ongoing updates, fixes, speed checks, backups, and technical support to keep your site running well.',
            },
          ].map(({ title, desc }) => (
            <StaggerItem key={title} className="flex flex-col gap-1.5 border-b border-gray-100 pb-6 sm:pb-8 group hover:border-[#A7F076] transition-colors duration-300">
              <h3 className="text-base font-bold text-[#111827] group-hover:text-[#467923] transition-colors duration-300">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </div>
      </section>

      {/* Section 4: Beyond the Code (#21A0A3 background) */}
      <section className="w-full bg-[#21A0A3] text-white py-20 sm:py-28">
        <FadeIn direction="up" className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4">
            Beyond the Code
          </h2>

          <p className="text-base sm:text-lg lg:text-xl font-medium text-center text-white/95 mb-3">
            We do not just turn designs into web pages.
          </p>

          <p className="text-sm sm:text-base text-center text-white/80 max-w-2xl mb-12 sm:mb-20 leading-relaxed font-normal">
            We build the structure behind your website so it loads fast, works smoothly, supports search, and stays easy to manage after launch.
          </p>

          <BeyondTheCodeTimeline />

          <p className="text-sm sm:text-base font-medium text-center text-white/90 max-w-xl mt-16 sm:mt-20 leading-relaxed">
            The result is a website that works well from launch and stays ready for what comes next.
          </p>

        </FadeIn>
      </section>

      {/* ── Built on Fourth Dimension™ Section ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 w-full border-t border-gray-100">
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
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight">
              Built on Fourth Dimension™
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-lg">
              Every development project follows our Fourth Dimension™ framework, so strategy, design, code, and growth stay connected from the start.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 mt-3 w-full">
              <Link
                href="/fourth-dimension-framework"
                className="btn-hover-gradient group w-full sm:w-auto justify-center px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 sm:gap-3 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
              >
                <span>Learn more about Fourth Dimension™</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link
                href="/book-a-call"
                className="btn-hover-gradient group w-full sm:w-auto justify-center px-5 sm:px-6 py-3 rounded-full border border-[#111827] text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 sm:gap-3 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
              >
                <span>Book a Discovery Call</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-xl">
            Need a website that&apos;s fast, flexible and built to last?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            Let&apos;s talk about the right platform, tech stack, and structure for your goals — and how we can bring your designs to life with clean, scalable code.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-6 sm:px-7 py-3 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-all duration-300">
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
