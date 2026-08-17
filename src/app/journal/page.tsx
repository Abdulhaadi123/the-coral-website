'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn } from '@/components/Animated';
import { blogPosts } from './data';

const categories = [
  'View All',
  'RevOps',
  'Website Production',
  'Digital Marketing',
  'Online Advertising',
  'Design/UI/UX',
  'Digital',
  'News',
];

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState('View All');
  const [currentPage, setCurrentPage] = useState(1);

  const featuredPost = blogPosts[0];

  const filteredPosts =
    activeCategory === 'View All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory || post.badge === activeCategory);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-6 sm:pt-8 lg:pt-10 pb-8 w-full">
        <FadeIn direction="up" className="pl-6 sm:pl-12 md:pl-16 lg:pl-20 mb-8 sm:mb-10">
          {/* Main Title with exact Gradient */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold tracking-tight text-[#111827]"
            style={{ lineHeight: '1.10' }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #5E9738 0%, #9FE66F 19%, #32CEC6 100%)' }}
            >
              The Coral Room
            </span>
            <span className="text-[#111827]"> : Journal</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Digital tips and tricks to help you improve efficiency, be more productive and grow your business.
          </p>
        </FadeIn>

        {/* Featured Post Card */}
        <FadeIn direction="up" delay={0.1}>
          <Link
            href={`/journal/${featuredPost.slug}`}
            className="bg-[#F3F4F6]/75 hover:bg-[#F3F4F6] rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch p-4 sm:p-6 lg:p-8 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-10 group hover:shadow-xl transition-all duration-300 border border-gray-100 block cursor-pointer"
          >
            {/* Featured Image */}
            <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[280px] lg:min-h-[320px] rounded-2xl overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Featured Body */}
            <div className="w-full md:w-1/2 flex flex-col justify-center py-2 sm:py-4 pr-2">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="px-3 py-1 rounded-full bg-white text-gray-800 text-xs font-semibold shadow-xs">
                  {featuredPost.badge}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {featuredPost.date}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#111827] leading-snug mb-3 sm:mb-4 group-hover:text-[#21A0A3] transition-colors duration-200">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {featuredPost.description}
              </p>

              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#21A0A3] group-hover:translate-x-1 transition-all duration-200">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* Category Filter Tabs */}
        <FadeIn direction="up" delay={0.15}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 my-8 sm:my-12 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-transparent text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* 3-Column Posts Grid */}
        <FadeIn direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="bg-[#F9FAFB] hover:bg-[#F3F4F6]/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group border border-gray-100/60 block cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-white text-gray-800 text-[11px] font-semibold shadow-xs">
                        {post.badge}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-[#111827] leading-snug mb-2.5 group-hover:text-[#21A0A3] transition-colors duration-200">
                      {post.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6">
                      {post.description}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 group-hover:text-[#21A0A3] group-hover:translate-x-1 transition-all duration-200">
                    <span>Read more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 my-12 sm:my-16">
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              currentPage === 1 ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              currentPage === 2 ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              currentPage === 3 ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage(4)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              currentPage === 4 ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            4
          </button>
          <span className="text-gray-400 text-xs px-1 select-none">...</span>
          <button
            onClick={() => setCurrentPage(8)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              currentPage === 8 ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            8
          </button>
        </div>
      </section>

      {/* ── Call To Action Banner Section ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 sm:py-24 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col items-center text-center gap-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug">
            Need your own solid online presence with a lucrative inbound funnel?
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            Tell us what your goals and objectives are, and we&apos;ll help you hit them 🎯.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-3 px-7 py-3.5 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span>Book a Website Audit</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>

      {/* Dark Footer */}
      <FooterSection />
    </main>
  );
}
