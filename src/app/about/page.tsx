import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import TeamSection from '@/components/TeamSection';
import FeaturedWorkSection from '@/components/FeaturedWorkSection';
import OfficeLocationsSection from '@/components/OfficeLocationsSection';
import { FadeIn } from '@/components/Animated';
import { getPageSeo } from '@/lib/seo';
import { getTeamMembers } from '@/lib/publicData';

// Team changes should show up right away (an admin just added/reordered someone),
// not wait for the hourly revalidate — matches the other content-driven pages.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/about');
  return { title: seo.title, description: seo.description };
}

export default async function AboutPage() {
  const members = await getTeamMembers();

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <TeamSection members={members} />

      <FeaturedWorkSection />

      {/* ── Bottom Call To Action Banner Section (client brief item 08) ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-20 sm:py-24 relative">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-2xl">
            This could be the start of something real
          </h2>
          <p className="text-sm sm:text-base text-gray-800 max-w-xl leading-relaxed font-medium">
            You&apos;ve seen who we are, how we work, and what we believe. If that resonates, let&apos;s start a
            conversation and see where it leads.
          </p>
          <Link
            href="/book-a-call"
            className="btn-cta group mt-3 px-7 py-3.5 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-3 shadow-sm w-full sm:w-auto"
          >
            <span>Book a Discovery Call</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>

      {/* ── Office Locations (client brief item 09) ── */}
      <OfficeLocationsSection />

      <FooterSection />
    </main>
  );
}
