'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

const staticTestimonials = [
  {
    quote:
      'Working with The Coral Room transformed how our brand shows up online. Clear process, sharp execution, and results we could measure.',
    name: 'Qasim Zaman Khan',
    role: 'COO, Namal Education Foundation',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: '/images/testimonials/namal.webp',
    logoAlt: 'Namal Education Foundation',
    logoWidth: 48,
    logoHeight: 48,
    rating: 5,
  },
  {
    quote:
      'They brought strategy and craft together. Our new identity feels premium, consistent, and built for growth across every touchpoint.',
    name: 'Umar Mumtaz',
    role: 'Managing Director, GoGrad',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: '/images/testimonials/gograd.webp',
    logoAlt: 'GoGrad',
    logoWidth: 100,
    logoHeight: 36,
    rating: 5,
  },
  {
    quote:
      'From discovery to delivery, the team made complex decisions simple. The work looks sharp and performs exactly how we needed.',
    name: 'Hamza Rehman',
    role: 'Marketing Lead, Urban',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: null,
    logoAlt: '',
    logoWidth: 0,
    logoHeight: 0,
    rating: 5,
  },
  {
    quote:
      'The Coral Room redesigned our website and scaled our conversion rate by over 30%. Their Fourth Dimension framework gave us total clarity.',
    name: 'Sarah Jenkins',
    role: 'Creative Lead, Elovira',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: '/images/partners/elovira.webp',
    logoAlt: 'Elovira',
    logoWidth: 80,
    logoHeight: 32,
    rating: 5,
  },
  {
    quote:
      'Fast turnarounds, clean code, and zero fluff. They feel like a natural extension of our internal design and engineering team.',
    name: 'Marcus Vance',
    role: 'Director, Holix',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: '/images/partners/holix.webp',
    logoAlt: 'Holix',
    logoWidth: 80,
    logoHeight: 32,
    rating: 5,
  },
  {
    quote:
      'Our search visibility and lead quality doubled within three months of launching. Best digital investment we have made.',
    name: 'Zane Al-Mansoor',
    role: 'Founder, Ascent',
    avatar: '/images/testimonials/avatar-1.webp',
    logo: '/images/partners/ascent.webp',
    logoAlt: 'Ascent',
    logoWidth: 80,
    logoHeight: 32,
    rating: 5,
  },
];

export const ClientTestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const totalDots = 5;

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.testimonials && data.testimonials.length > 0) {
          // Filter live/featured and map DB shape to component shape
          const liveOnly = data.testimonials.filter((t: any) => t.featured !== false);
          if (liveOnly.length > 0) {
            const mapped = liveOnly.map((t: any) => ({
              quote: t.quote,
              name: t.name,
              role: t.role,
              avatar: t.avatar || '/images/testimonials/avatar-1.webp',
              logo: t.logo || null,
              logoAlt: t.name,
              logoWidth: t.logoWidth || 80,
              logoHeight: t.logoHeight || 32,
              rating: typeof t.rating === 'number' ? t.rating : 5,
            }));
            setTestimonials(mapped);
          }
        }
      })
      .catch(() => {}); // silently fallback to static
  }, []);

  const prev = () => { setDirection('prev'); setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1)); };
  const next = () => { setDirection('next'); setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1)); };

  // Compute 3 visible cards starting from active index
  const visible = [
    testimonials[active % testimonials.length],
    testimonials[(active + 1) % testimonials.length],
    testimonials[(active + 2) % testimonials.length],
  ];

  return (
    <section className="w-full bg-[#F5F6F7] pt-16 sm:pt-20 pb-16 sm:pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] tracking-tight max-w-2xl" style={{ lineHeight: '1.10' }}>
          What Our Clients Say
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Real feedback from partners we have helped grow through clearer brand systems,
          sharper digital experiences, and performance-led execution.
        </p>

        {/* Testimonial cards - smooth transition */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {visible.map((item, idx) => (
            <article
              key={`${item.name}-${active}-${idx}`}
              className={`flex flex-col ${direction === 'next' ? 'animate-slide-from-right' : 'animate-slide-from-left'}`}
            >
              {/* Dynamic 1-5 Star Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (item.rating ?? 5)
                        ? 'fill-[#111827] text-[#111827]'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="mt-5 text-sm sm:text-[15px] text-[#374151] leading-relaxed flex-1">
                {item.quote}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-200">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                    sizes="44px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#111827] leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.role}</p>
                </div>

                {item.logo && (
                  <div className="shrink-0 relative h-9 flex items-center">
                    <Image
                      src={item.logo}
                      alt={item.logoAlt}
                      width={item.logoWidth}
                      height={item.logoHeight}
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Dots + arrows */}
        <div className="mt-10 sm:mt-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonials page ${i + 1}`}
                onClick={() => setActive(i % testimonials.length)}
                className={`rounded-full transition-all duration-300 ${
                  i === active % totalDots
                    ? 'w-2.5 h-2.5 bg-[#111827]'
                    : 'w-2 h-2 bg-[#111827]/35 hover:bg-[#111827]/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonials"
              className="w-11 h-11 rounded-full border border-[#111827]/40 text-[#111827] flex items-center justify-center hover:bg-[#111827] hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonials"
              className="w-11 h-11 rounded-full border border-[#111827]/40 text-[#111827] flex items-center justify-center hover:bg-[#111827] hover:text-white transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certification Partner badges */}
        <div className="mt-12 sm:mt-20 flex flex-col items-center">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Certification Partner
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {/* Webflow */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M17.5 3L12 12.5 8.5 7.5 3 15h5l2.5-4L14 18l7-15h-3.5z" fill="#4353FF" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-[#111827]">Webflow</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs sm:text-sm text-gray-600">Professional Partner</span>
            </div>

            {/* Meta */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white">
              <svg width="22" height="14" viewBox="0 0 36 24" fill="none" aria-hidden>
                <path
                  d="M18 4c-2.8 0-4.6 2.2-6 4.4C10.6 6.2 8.8 4 6 4 2.7 4 0 7.2 0 12s2.7 8 6 8c2.8 0 4.6-2.2 6-4.4 1.4 2.2 3.2 4.4 6 4.4 3.3 0 6-3.2 6-8s-2.7-8-6-8zm-9.2 11.2c-.9 1.4-1.8 2.3-2.8 2.3-1.7 0-3-1.9-3-5.5s1.3-5.5 3-5.5c1 0 1.9.9 2.8 2.3.7 1.1 1.3 2.4 1.8 3.5-.5 1.1-1.1 2.4-1.8 3.4zm12.4 2.3c-1 0-1.9-.9-2.8-2.3-.7-1-.1.3-1.8-3.4.5-1.1 1.1-2.4 1.8-3.5.9-1.4 1.8-2.3 2.8-2.3 1.7 0 3 1.9 3 5.5s-1.3 5.5-3 5.5z"
                  fill="#0668E1"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-[#111827]">Meta</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs sm:text-sm text-gray-600">Gold Partner</span>
            </div>

            {/* Google */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-[#111827]">Google</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs sm:text-sm text-gray-600">Partner</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonialsSection;
