'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowUpRight, Facebook, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn } from '@/components/Animated';
import { blogPosts } from '../data';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  // If fewer than 3 related posts, include all blog posts
  const displayedRelated = relatedPosts.length > 0 ? relatedPosts : blogPosts;

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Navbar */}
      <Header />

      {/* Hero Header Section */}
      <section className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-6 w-full">
        {/* Top Header Text — flush with the section gutter, no extra indent */}
        <FadeIn direction="up" className="mb-8 sm:mb-10">
          {/* Back link */}
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider mb-5 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>ALL POSTS</span>
          </Link>

          {/* Badge & Date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {post.badge}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {post.date}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold tracking-tight text-[#111827] max-w-4xl mb-4"
            style={{ lineHeight: '1.10' }}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {post.subtitle || post.description}
          </p>
        </FadeIn>

        {/* Hero Banner Image */}
        <FadeIn direction="up" delay={0.1}>
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[24px] sm:rounded-[36px] overflow-hidden mb-12 sm:mb-16 bg-gray-200 shadow-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </FadeIn>

        {/* 2-Column Article & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 sm:mb-20">
          
          {/* ── Left Column: Article Body ── */}
          <FadeIn direction="up" className="lg:col-span-8 flex flex-col gap-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {post.content?.paragraphs ? (
              post.content.paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p className="leading-relaxed">{post.description}</p>
            )}

            {/* Subheading */}
            {post.content?.subheading && (
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#111827] leading-snug my-4 sm:my-6">
                {post.content.subheading}
              </h2>
            )}

            {/* Subheading Paragraphs */}
            {post.content?.subheadingParagraphs &&
              post.content.subheadingParagraphs.map((p, idx) => (
                <p key={`sub-${idx}`} className="leading-relaxed">
                  {p}
                </p>
              ))}
          </FadeIn>

          {/* ── Right Column: Sticky Sidebar Card ── */}
          <FadeIn direction="up" delay={0.1} className="lg:col-span-4 w-full">
            <div className="bg-[#F3F4F6]/75 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col gap-5 border border-gray-100/60 sticky top-28 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#111827] mb-2">
                  The Bottomline Booster
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Partial to some tips and tricks on how to make your business more prosperous?
                </p>
              </div>

              <div>
                <Link
                  href="/book-a-call"
                  className="bg-[#A7F076] hover:bg-[#94df62] text-black font-semibold text-xs px-5 py-2.5 rounded-full inline-block transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
                >
                  Join the list
                </Link>
              </div>

              <div className="border-t border-gray-200/80 pt-5">
                <p className="text-xs font-semibold text-gray-700 mb-3">
                  Share this page
                </p>
                <div className="flex items-center gap-4 text-gray-800">
                  <button
                    aria-label="Share on Facebook"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      }
                    }}
                    className="p-1 hover:opacity-75 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                  >
                    <Image
                      src="/images/Vector (1).webp"
                      alt="Facebook"
                      width={26}
                      height={26}
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                  <button
                    aria-label="Share on LinkedIn"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }
                    }}
                    className="p-1 hover:opacity-75 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                  >
                    <Image
                      src="/images/Vector (2).webp"
                      alt="LinkedIn"
                      width={26}
                      height={26}
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>

        {/* ── Related Posts Section ── */}
        <div className="border-t border-gray-100 pt-14 sm:pt-16 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#111827] tracking-tight">
              Related Posts
            </h2>
            <Link
              href="/journal"
              className="px-6 py-2.5 rounded-full border border-gray-400 text-gray-700 hover:text-black hover:border-black text-xs sm:text-sm font-semibold transition-all duration-300"
            >
              View all posts
            </Link>
          </div>

          {/* Related Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {displayedRelated.map((related) => (
              <Link
                key={related.id}
                href={`/journal/${related.slug}`}
                className="bg-[#F9FAFB] hover:bg-[#F3F4F6]/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group border border-gray-100/60 block cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
                  <Image
                    src={related.image}
                    alt={related.title}
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
                        {related.badge}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {related.date}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-[#111827] leading-snug mb-2.5 group-hover:text-[#21A0A3] transition-colors duration-200">
                      {related.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6">
                      {related.description}
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
        </div>
      </section>

      {/* ── Bottom Call To Action Banner Section ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 sm:py-24 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center gap-4 relative z-10">
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
