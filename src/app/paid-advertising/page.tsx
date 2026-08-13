'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import {
  IconPaidSnapchat,
  IconPaidGoogle,
  IconPaidMeta,
  IconPaidRetargeting,
  IconPaidLinkedIn,
  IconPaidTikTok,
  IconPaidTracking,
  IconPaidLandingPage,
  IconPaidAdCreative,
} from '@/components/icons/Icons';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animated';

// ── Services data ─────────────────────────────────────────────────────────────

const services = [
  {
    Icon: IconPaidSnapchat,
    title: 'Snapchat Ads',
    desc: 'Mobile-first campaigns for local reach, younger audiences, and quick engagement.',
  },
  {
    Icon: IconPaidGoogle,
    title: 'Google Ads',
    desc: 'Search, display, shopping, Performance Max, and YouTube campaigns built to capture demand and drive measurable action.',
  },
  {
    Icon: IconPaidMeta,
    title: 'Meta Ads',
    desc: 'Facebook, Instagram, Messenger, and WhatsApp campaigns built around creative, targeting, leads, and sales.',
  },
  {
    Icon: IconPaidRetargeting,
    title: 'Retargeting Campaigns',
    desc: 'Ads that bring back people who visited, clicked, added to cart, or showed interest.',
  },
  {
    Icon: IconPaidLinkedIn,
    title: 'LinkedIn Ads',
    desc: 'B2B campaigns for lead generation, brand awareness, hiring, and decision-maker reach.',
  },
  {
    Icon: IconPaidTikTok,
    title: 'TikTok Ads',
    desc: 'Short-form campaigns built for attention, discovery, and product interest.',
  },
  {
    Icon: IconPaidTracking,
    title: 'Tracking & Reporting',
    desc: 'Pixel, tag, event, and conversion tracking with clear performance reports.',
  },
  {
    Icon: IconPaidLandingPage,
    title: 'Landing Page Strategy',
    desc: 'Campaign pages shaped to turn paid traffic into leads, bookings, or sales.',
  },
  {
    Icon: IconPaidAdCreative,
    title: 'Ad Creative & Copy',
    desc: 'Visuals, hooks, headlines, and messages built for each platform.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaidAdvertisingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col overflow-hidden">
      <Header />

      {/* ── Hero Section ── */}
      <section
        className="w-full relative overflow-hidden"
        style={{ background: 'linear-gradient(0deg, #A7F076 0%, #FFFFFF 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-16 sm:pt-24 pb-0">
          <FadeIn direction="up" className="pl-6 sm:pl-12 md:pl-16 lg:pl-20">
            {/* Label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Paid Advertising Services
            </p>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold text-[#111827] mb-5" style={{ lineHeight: '1.10' }}>
              Paid campaigns built to bring{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #467923 0%, #A7F076 39.9%, #00C0E8 74.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                better leads, not wasted clicks
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed mb-10 font-normal">
              From Meta and Google to LinkedIn, TikTok, and Snapchat, we plan, launch, and manage paid
              campaigns with clear targeting, strong creative, clean tracking, and a sharp focus on return.
            </p>
          </FadeIn>

          {/* Hero image — inside section, original placement */}
          <ScaleIn delay={0.2} className="relative flex justify-center items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/paid-ads-hero.webp"
              alt="Paid Advertising Dashboard — AdLaunch platform showing campaign performance across Meta, Google, LinkedIn, TikTok, and Snapchat"
              className="w-full max-w-5xl h-auto object-contain object-bottom hover:scale-[1.01] transition-transform duration-500"
            />
          </ScaleIn>
        </div>
      </section>

      {/* ── Paid Advertising Services Grid ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 py-16 sm:py-24 w-full">
        <div>
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight mb-8 sm:mb-12 max-w-sm">
              Paid Advertising Services
            </h2>
          </FadeIn>

          {/* 3-column grid with horizontal dividers */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, desc }, i) => {
              const isLastRow = i >= services.length - (services.length % 3 || 3);
              return (
                <StaggerItem
                  key={title}
                  className={`flex flex-col gap-3 py-6 sm:py-8 pr-4 sm:pr-8 hover:translate-x-1 transition-transform duration-300 ${
                    !isLastRow ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-start text-[#111827]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── PPC & Paid Advertising Section ── */}
      <section className="w-full pt-4 sm:pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24">
          <FadeIn direction="up">
            {/* Two-column text row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12">

              {/* Left Column */}
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] leading-tight mb-3">
                    PPC &amp; Paid Advertising
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-[#111827]">
                    Fast visibility for the customers most likely to buy
                  </p>
                </div>

                {/* Bullet points */}
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-3 text-sm text-[#111827] font-medium hover:translate-x-1 transition-transform">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.13512 1.52271C9.42089 1.52271 9.70259 1.53819 9.98023 1.56915C10.0796 1.58015 10.1759 1.61061 10.2635 1.65881C10.3511 1.707 10.4283 1.77198 10.4908 1.85003C10.5533 1.92808 10.5998 2.01768 10.6277 2.11371C10.6556 2.20973 10.6643 2.31031 10.6533 2.40969C10.6423 2.50908 10.6118 2.60532 10.5636 2.69293C10.5154 2.78054 10.4505 2.8578 10.3724 2.9203C10.2943 2.9828 10.2048 3.02931 10.1087 3.05718C10.0127 3.08505 9.91212 3.09374 9.81273 3.08274C8.55804 2.94238 7.29074 3.19538 6.18611 3.80674C5.08149 4.4181 4.19414 5.35761 3.64681 6.49532C3.09947 7.63303 2.9192 8.91271 3.13092 10.1573C3.34265 11.402 3.93591 12.5501 4.82865 13.4428C5.72139 14.3355 6.86948 14.9288 8.11412 15.1405C9.35876 15.3523 10.6384 15.172 11.7761 14.6247C12.9138 14.0773 13.8534 13.19 14.4647 12.0854C15.0761 10.9807 15.3291 9.71342 15.1887 8.45873C15.1777 8.35934 15.1864 8.25877 15.2143 8.16274C15.2422 8.06671 15.2887 7.97711 15.3512 7.89906C15.4774 7.74143 15.6611 7.64039 15.8618 7.61818C16.0625 7.59597 16.2638 7.6544 16.4214 7.78062C16.4995 7.84312 16.5645 7.92038 16.6127 8.00799C16.6609 8.0956 16.6913 8.19184 16.7023 8.29123C16.7328 8.56887 16.7482 8.85058 16.7488 9.13634C16.7488 13.3414 13.3401 16.75 9.13512 16.75C4.93011 16.75 1.52148 13.3414 1.52148 9.13634C1.52148 4.93133 4.93011 1.52271 9.13512 1.52271ZM9.11076 5.99724C9.16093 6.1927 9.13146 6.40008 9.02882 6.57382C8.92617 6.74757 8.75875 6.87345 8.56334 6.92382C8.02648 7.06445 7.55912 7.39561 7.24849 7.85551C6.93786 8.3154 6.80516 8.8726 6.87517 9.42315C6.94517 9.97369 7.2131 10.4799 7.62894 10.8475C8.04479 11.215 8.58015 11.4186 9.13512 11.4204C9.64166 11.4206 10.1339 11.2525 10.5344 10.9424C10.9349 10.6323 11.221 10.1978 11.3476 9.70736C11.4016 9.51577 11.5285 9.35293 11.701 9.25372C11.8736 9.15452 12.0782 9.12684 12.2709 9.17661C12.4636 9.22639 12.6292 9.34966 12.7321 9.52002C12.8351 9.69038 12.8672 9.89428 12.8216 10.088C12.5881 10.9834 12.0366 11.763 11.2701 12.2814C10.5037 12.7997 9.5747 13.0213 8.6568 12.9047C7.7389 12.7881 6.89484 12.3414 6.2823 11.6479C5.66976 10.9544 5.33064 10.0616 5.3283 9.13634C5.32817 8.29229 5.60856 7.47212 6.12539 6.8048C6.64221 6.13747 7.36616 5.66083 8.18342 5.44982C8.28025 5.42486 8.38105 5.41922 8.48007 5.43323C8.57908 5.44723 8.67437 5.4806 8.76048 5.53144C8.8466 5.58227 8.92185 5.64957 8.98195 5.7295C9.04205 5.80942 9.08582 5.9004 9.11076 5.99724ZM14.087 1.6194C14.226 1.67702 14.3448 1.77452 14.4284 1.89959C14.512 2.02466 14.5567 2.17169 14.5568 2.32214V3.71543H15.9493C16.0999 3.71546 16.2471 3.76013 16.3722 3.8438C16.4974 3.92746 16.595 4.04636 16.6526 4.18546C16.7102 4.32456 16.7253 4.47762 16.6959 4.62529C16.6665 4.77295 16.5941 4.9086 16.4876 5.01508L13.7947 7.70498C13.6519 7.84777 13.4583 7.92801 13.2564 7.92806H11.4192L10.0274 9.32059C9.88458 9.46345 9.69081 9.54371 9.48877 9.54371C9.28674 9.54371 9.09297 9.46345 8.95011 9.32059C8.80725 9.17773 8.72699 8.98396 8.72699 8.78193C8.72699 8.57989 8.80725 8.38612 8.95011 8.24326L10.3426 6.85225V5.01432C10.3427 4.81241 10.4229 4.61878 10.5657 4.47603L13.2571 1.78385C13.3636 1.67731 13.4993 1.60475 13.647 1.57534C13.7947 1.54593 13.9479 1.561 14.087 1.61864M13.0341 4.15931L11.8654 5.32952V6.40609H12.9419L14.1114 5.2374H13.7954C13.5935 5.2374 13.3998 5.15718 13.2571 5.0144C13.1143 4.87162 13.0341 4.67796 13.0341 4.47603V4.15931Z" fill="black"/>
                      </svg>
                    </span>
                    <span>Target the right audience</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#111827] font-medium hover:translate-x-1 transition-transform">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.13681 6.85236H7.61408M9.13681 4.56827H6.85272M9.13681 9.13645H6.85272M9.13681 13.7046H6.85272M9.13681 11.4205H7.61408M15.9891 2.28418H12.9436M14.4664 2.28418V15.9887M15.9891 15.9887H12.9436M9.13681 15.1322C9.13681 15.605 8.74699 15.9887 8.26657 15.9887H3.91614C3.80275 15.9896 3.6903 15.9682 3.58521 15.9256C3.48011 15.8831 3.38443 15.8202 3.30362 15.7407C3.22281 15.6612 3.15845 15.5665 3.11423 15.4621C3.07002 15.3577 3.04679 15.2456 3.0459 15.1322V3.04554C3.0459 2.84362 3.12611 2.64996 3.2689 2.50718C3.41168 2.36439 3.60534 2.28418 3.80726 2.28418H8.26657C8.74699 2.28418 9.13681 2.66791 9.13681 3.14071V15.1322Z" stroke="black" strokeWidth="1.52273" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>Get measurable results faster</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#111827] font-medium hover:translate-x-1 transition-transform">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_paid_ads)">
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.4933 5.7509C13.5763 5.69979 13.6422 5.6251 13.6825 5.53638C13.7229 5.44766 13.7359 5.34892 13.7198 5.25278L13.0727 1.38943C13.0619 1.32526 13.0385 1.26387 13.0037 1.20884C12.969 1.15381 12.9237 1.10624 12.8704 1.06891C12.8171 1.03159 12.7569 1.00524 12.6933 0.991417C12.6297 0.977592 12.564 0.976564 12.5 0.988391L8.83279 1.66987C8.73887 1.68739 8.65211 1.73196 8.58318 1.79812C8.51426 1.86428 8.46616 1.94913 8.44481 2.04225C8.42345 2.13538 8.42977 2.23271 8.46299 2.32229C8.49621 2.41187 8.55487 2.48979 8.63178 2.54648L10.2516 3.74078L7.46101 7.7267L4.91355 5.94014C4.7805 5.84701 4.61592 5.8105 4.45597 5.83863C4.29602 5.86676 4.15377 5.95723 4.06048 6.09017L0.108881 11.7303C0.0627178 11.7962 0.0299925 11.8706 0.0125733 11.9491C-0.00484587 12.0277 -0.00661782 12.109 0.00735867 12.1882C0.0213351 12.2675 0.0507863 12.3432 0.0940307 12.4111C0.137275 12.479 0.193466 12.5377 0.259394 12.5838C0.392543 12.6771 0.557275 12.7136 0.717349 12.6853C0.79661 12.6714 0.872342 12.6419 0.94022 12.5987C1.0081 12.5554 1.0668 12.4992 1.11296 12.4333L4.71156 7.29526L7.25901 9.08181C7.39218 9.17484 7.55684 9.2112 7.71681 9.18288C7.87677 9.15457 8.01894 9.0639 8.11209 8.9308L11.2371 4.46933L12.9442 5.72835C13.0229 5.78632 13.1172 5.81944 13.2148 5.82346C13.3125 5.82748 13.4091 5.80221 13.4923 5.7509" fill="black"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_paid_ads">
                            <rect width="13.7276" height="13.7276" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <span>Increase leads, sales, and revenue</span>
                  </li>
                </ul>
              </div>

              {/* Right Column — description text */}
              <div className="flex flex-col justify-center gap-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Paid ads help your brand show up when your best customers are searching, scrolling, comparing, or ready to act.
                </p>
                <p>
                  At The Coral Room, we plan and manage campaigns across Google, Meta, LinkedIn, TikTok, and Snapchat with clear targeting, strong creative, landing page alignment, and clean tracking.
                </p>
                <p>
                  SEO builds long-term visibility. Paid media gives you speed. Used together, they help you capture demand now and build stronger growth over time.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Magnet image — exact Figma placement overlapping upper green CTA area */}
          <div className="flex justify-end overflow-hidden">
            <ScaleIn delay={0.2} className="w-full max-w-lg sm:max-w-xl lg:max-w-[740px] -mb-[6%] sm:-mb-[9%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/magnet-hand.webp"
                alt="Hand holding a horseshoe magnet — attract the right customers"
                style={{ rotate: '7deg', transformOrigin: '35% 55%' }}
                className="w-full h-auto object-contain object-right ml-auto"
              />
            </ScaleIn>
          </div>

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 sm:py-20 relative overflow-hidden z-10">
        <FadeIn direction="up" className="max-w-3xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col items-center text-center gap-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-snug max-w-xl">
            Need paid campaigns that bring better customers?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-xl leading-relaxed font-medium">
            Let&apos;s build campaigns across Google, Meta, LinkedIn, TikTok, and Snapchat with the right targeting, creative, tracking, and landing page flow.
          </p>
          <Link
            href="/book-a-call"
            className="group mt-2 px-5 sm:px-7 py-3 rounded-full border border-[#111827] bg-transparent text-[#111827] font-semibold text-xs sm:text-sm inline-flex items-center gap-3 hover:bg-white hover:text-[#111827] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Start a Campaign Discussion</span>
            <span className="w-6 h-6 rounded-full border border-[#111827] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#111827]" />
            </span>
          </Link>
        </FadeIn>
      </section>


      <FooterSection />
    </main>
  );
}
