'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';
import { IconLayersStep } from '@/components/icons/Icons';

export default function BookACallPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden relative">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1">

        {/* ── LEFT COLUMN (Form) — Aligned with hamburger ── */}
        <div className="w-full lg:w-1/2 bg-white px-8 sm:px-16 lg:px-24 pt-4 pb-16 flex flex-col justify-between">

          {submitted ? (
            /* ── SUCCESS STATE ── */
            <div className="w-full max-w-lg my-auto">
              <div
                className="relative rounded-3xl overflow-hidden p-10 sm:p-14 flex flex-col items-start gap-6"
                style={{ background: 'linear-gradient(135deg, #9FE66F 0%, #78B249 50%, #21A0A3 100%)' }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 blur-2xl pointer-events-none" />

                {/* Checkmark */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                  <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
                    Submission Received
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                    We&apos;ve got<br />your details!
                  </h2>
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-sm">
                    Our team will review your information and reach out within{' '}
                    <strong className="text-white">1–2 business days</strong>{' '}
                    with a clear next step for your project.
                  </p>
                </div>

                <div className="relative z-10 w-full border-t border-white/20 pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#111827] font-semibold text-sm hover:bg-white/90 transition-all duration-200 shadow-sm"
                  >
                    ← Back to Home
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200"
                  >
                    View Our Work ↗
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <FadeIn direction="up" className="w-full max-w-lg my-auto">
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#111827] mb-3">
                Book a Discovery Call
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md leading-relaxed">
                Tell us what you&apos;re building, fixing, or trying to grow. We&apos;ll review your details and come back with a clear next step.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

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
                  className="group self-start mt-2 inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#111827] text-white font-semibold text-sm hover:bg-[#111827]/90 transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Submit</span>
                  <span className="w-6 h-6 rounded-full border border-white flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </button>

              </form>
          </FadeIn>
          )}

          <div />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full lg:w-1/2 bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center px-8 sm:px-16 lg:px-16 pt-8 pb-16 flex flex-col justify-between">

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-12 w-full max-w-xl my-auto">
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

      {/* ── FIGMA CUSTOM DARK FOOTER FOR BOOK A CALL PAGE ── */}
      <section className="w-full px-4 sm:px-8 pb-8 pt-6 bg-white">
        <div className="max-w-7xl mx-auto bg-[#202020] rounded-[32px] sm:rounded-[40px] px-8 sm:px-16 lg:px-20 pt-12 sm:pt-16 pb-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden shadow-2xl">
          
          {/* Massive "the coral room." Logo Banner */}
          <div className="w-full flex justify-center items-center my-auto py-6">
            <Image
              src="/images/the-coral-room-footer-logo.webp"
              alt="the coral room."
              width={1400}
              height={300}
              priority
              className="w-full h-auto max-h-[160px] sm:max-h-[220px] object-contain brightness-200 opacity-30 hover:opacity-50 transition-opacity duration-500"
            />
          </div>

          {/* Bottom Divider & Row matching Figma */}
          <div className="w-full border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400 font-medium">
            <a
              href="mailto:dronexia@youremail.com"
              className="underline hover:text-white transition-colors cursor-pointer"
            >
              dronexia@youremail.com
            </a>
            <span className="text-gray-400">Ready to get started?</span>
          </div>

        </div>
      </section>

    </main>
  );
}
