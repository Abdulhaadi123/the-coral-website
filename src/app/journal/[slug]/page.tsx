import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';
import { getPublishedBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog';
import ShareButtons from './ShareButtons';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | The Coral Room Journal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: assetUrl(post.image) }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedBlogPosts(post.slug, 3);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Navbar */}
      <Header />

      {/* Hero Header Section */}
      <section className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%] pt-6 sm:pt-8 lg:pt-10 pb-6 w-full">
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
              src={assetUrl(post.image)}
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
          <FadeIn direction="up" className="lg:col-span-8">
            <div
              className="journal-prose"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
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
                <ShareButtons />
              </div>
            </div>
          </FadeIn>

        </div>

        {/* ── Related Posts Section ── */}
        {related.length > 0 && (
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
              {related.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/journal/${relatedPost.slug}`}
                  className="bg-[#F9FAFB] hover:bg-[#F3F4F6]/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group border border-gray-100/60 block cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
                    <Image
                      src={assetUrl(relatedPost.image)}
                      alt={relatedPost.title}
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
                          {relatedPost.badge}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {relatedPost.date}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-[#111827] leading-snug mb-2.5 group-hover:text-[#21A0A3] transition-colors duration-200">
                        {relatedPost.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6">
                        {relatedPost.description}
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
        )}
      </section>

      {/* ── Bottom Call To Action Banner Section ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 sm:py-24 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-2xl">
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
