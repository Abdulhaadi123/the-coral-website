'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FooterSection from '@/components/FooterSection';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { IconLayersStep } from '@/components/icons/Icons';

export default function BookACallPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Split 50/50 Layout */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-screen">

        {/* ── LEFT COLUMN: White Background + Menu Icon + Form ── */}
        <div className="w-full lg:w-1/2 bg-white px-6 sm:px-10 lg:px-16 pt-8 pb-16 flex flex-col justify-between">
          
          {/* Top Left Menu Icon */}
          <div className="mb-8">
            <button
              aria-label="Open Menu"
              className="text-[#111827] hover:opacity-70 transition-opacity p-1"
            >
              <svg width="26" height="26" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" width="8" height="8" rx="4" fill="currentColor"/>
                <rect width="23" height="8" rx="4" fill="currentColor"/>
                <rect y="12" width="16" height="9" rx="4.5" fill="currentColor"/>
                <rect x="17" y="12" width="16" height="9" rx="4.5" fill="currentColor"/>
                <rect y="24.8852" width="33" height="8.11475" rx="4.05738" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <FadeIn direction="up" className="max-w-lg mx-auto lg:mx-0 w-full my-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
              Book a Discovery Call
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md leading-relaxed">
              Tell us what you&apos;re building, fixing, or trying to grow. We&apos;ll review your details and come back with a clear next step.
            </p>

            <form className="flex flex-col gap-5 w-full">

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Last name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Work email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Company or brand name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Website or social link
                  </label>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  What do you need help with?
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#78B249] transition-colors resize-none"
                />
              </div>

              {/* Radio */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-700">
                  Do you already have a project brief?
                </label>
                <p className="text-xs text-gray-400">A few notes, deck, or rough outline is enough.</p>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="brief" value="yes" className="accent-[#78B249]" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="brief" value="no" className="accent-[#78B249]" />
                    No
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-hover-gradient self-start mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111827] text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
              >
                Submit →
              </button>

            </form>
          </FadeIn>

          <div />
        </div>

        {/* ── RIGHT COLUMN: Green Gradient BG + Logo Top-Right + 4 Steps ── */}
        <div className="w-full lg:w-1/2 bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center px-6 sm:px-10 lg:px-16 pt-8 pb-16 flex flex-col justify-between">
          
          {/* Top Right Logo */}
          <div className="flex justify-end mb-12">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/logo.png"
                alt="The Coral Room"
                width={135}
                height={54}
                priority
                style={{ width: 'auto', height: '36px' }}
                className="object-contain"
              />
            </Link>
          </div>

          {/* 4 Steps Grid (2x2) */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-12 max-w-xl mx-auto lg:mx-0 my-auto">
            {[
              {
                tag: 'STEP 1',
                title: 'Book a Discovery Call',
                desc: 'We talk through your business, current digital presence, goals, problems, and what you want to improve first.',
              },
              {
                tag: 'STEP 2',
                title: 'We Find the Opportunity',
                desc: 'We review what you need, where the gaps are, and which services can make the strongest impact. You get a practical direction with scope, timelines, and budget range.',
              },
              {
                tag: 'STEP 3',
                title: 'We Shape the Plan',
                desc: 'We refine the priorities, ask the right questions, and agree on the best way forward before anything is signed.',
              },
              {
                tag: 'STEP 4',
                title: 'We Start the Work',
                desc: 'Once the proposal is approved, we move ahead with a defined scope, shared responsibilities, and a focused plan of action.',
              },
            ].map(({ tag, title, desc }) => (
              <StaggerItem key={tag} className="flex flex-col">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <IconLayersStep className="w-3.5 h-3.5 text-[#555555]" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">{tag}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#111827] mt-2 mb-1.5">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div />
        </div>

      </div>

      {/* Dark Footer Card at Bottom */}
      <FooterSection />
    </main>
  );
}
