import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';

export const metadata: Metadata = {
  title: 'Portfolio Not Available | The Coral Room',
  robots: { index: false, follow: false },
};

export default function PortfolioUnavailablePage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-3">
          Portfolio Not Available
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-md leading-relaxed mb-8">
          Our portfolio is currently only accessible from certain regions.
          Please get in touch with us directly to view our work.
        </p>

        <Link
          href="/book-a-call"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111827] text-white text-sm font-semibold hover:bg-[#1f2937] transition-colors"
        >
          Book a Discovery Call
        </Link>
      </div>

      <FooterSection />
    </main>
  );
}
