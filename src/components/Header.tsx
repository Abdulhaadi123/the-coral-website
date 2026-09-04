'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  dark?: boolean;
}

/*
 * Logo geometry. The source lockup is 144x68 with the mark occupying a 49x49
 * square, so at a 46px lockup height the mark reads as ~33px. It grows to
 * MARK_LARGE once the wordmark collapses away.
 */
const MARK_SMALL = 34;
const MARK_LARGE = 50;
const WORDMARK_H = 46;
const WORDMARK_W = Math.round(WORDMARK_H * (85 / 68)); // preserve crop aspect

const solutionLinks = [
  { label: 'Design',                  href: '/design' },
  { label: 'Development',             href: '/development' },
  { label: 'Optimisation',            href: '/optimisation' },
  { label: 'Marketing',               href: '/marketing' },
  { label: 'Marketing Campaigns',     href: '/marketing-campaigns' },
  { label: 'Paid Advertising',        href: '/paid-advertising' },
  { label: 'SEO & Search Visibility', href: '/seo-search-visibility' },
];

export const Header: React.FC<HeaderProps> = ({ dark = false }) => {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  /** Manual `dark` prop OR a dark section currently sitting under the header. */
  const isDark = dark || overDark;

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Collapses the lockup to just the mark once the page leaves the top.
  // Setting the same value is a no-op in React, so this only renders on a crossing.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /*
   * Automatic light/dark logo switching.
   *
   * Rather than tagging individual sections, this samples what is actually
   * rendered behind the logo and treats anything that is not essentially white
   * as dark. That covers solid colours, gradients, background images and video
   * without every section needing to opt in.
   */
  useEffect(() => {
    // Luminance at or above this counts as "white enough" for the dark logo.
    const NEAR_WHITE = 0.86;

    const parseColor = (value: string) => {
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(',').map((v) => parseFloat(v.trim()));
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    };

    const isDarkBehind = (x: number, y: number) => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (el.closest('header')) continue; // ignore the bar itself
        if (el.hasAttribute('data-nav-dark')) return true; // explicit override

        const cs = getComputedStyle(el);

        // Media and gradients can be any colour — assume they need the light logo.
        if (el.tagName === 'VIDEO' || el.tagName === 'IMG') return true;
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;

        const c = parseColor(cs.backgroundColor);
        if (!c || c.a === 0) continue; // transparent: keep looking further down

        const lum = (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
        return lum < NEAR_WHITE;
      }
      return false;
    };

    const update = () => {
      const bar = headerRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      const y = Math.max(1, Math.min(window.innerHeight - 1, r.top + r.height / 2));
      const logo = logoRef.current?.getBoundingClientRect();
      const x = logo ? logo.left + logo.width / 2 : window.innerWidth - 80;
      setOverDark(isDarkBehind(x, y));
    };

    // elementsFromPoint forces a style/layout read, so cap it at ~30fps and
    // always run once more after scrolling settles.
    let last = 0;
    let trailing: number | undefined;
    const onScroll = () => {
      const now = performance.now();
      window.clearTimeout(trailing);
      trailing = window.setTimeout(update, 60);
      if (now - last < 32) return;
      last = now;
      update();
    };

    update();
    const settle = window.setTimeout(update, 400); // late-rendering sections
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.clearTimeout(trailing);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  return (
    <>
      {/* ── Top Header Bar ── */}
      <header
        ref={headerRef}
        className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-4 flex items-center justify-between sticky top-0 z-30"
      >

        {/* Hamburger */}
        <button
          aria-label="Open Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" width="8" height="8" rx="4" fill="white"/>
              <rect width="23" height="8" rx="4" fill="white"/>
              <rect y="12" width="16" height="9" rx="4.5" fill="white"/>
              <rect x="17" y="12" width="16" height="9" rx="4.5" fill="white"/>
              <rect y="24.8852" width="33" height="8.11475" rx="4.05738" fill="white"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" width="8" height="8" rx="4" fill="#111827"/>
              <rect width="23" height="8" rx="4" fill="#111827"/>
              <rect y="12" width="16" height="9" rx="4.5" fill="#111827"/>
              <rect x="17" y="12" width="16" height="9" rx="4.5" fill="#111827"/>
              <rect y="24.8852" width="33" height="8.11475" rx="4.05738" fill="#111827"/>
            </svg>
          )}
        </button>

        {/*
          The logo is two independent parts rather than one image, so scrolling
          can animate them: the wordmark collapses to zero width while the CR mark
          grows. Each part keeps both colour variants stacked and crossfades
          between them, so moving over a dark background is a fade rather than the
          hard swap you get from changing an <img src>.
        */}
        <Link
          href="/"
          ref={logoRef}
          className="flex items-center cursor-pointer shrink-0"
          aria-label="The Coral Room — home"
        >
          {/* CR mark — grows once scrolling starts */}
          <span
            className="relative block shrink-0 transition-[width,height] duration-500 ease-out"
            style={{ width: scrolled ? MARK_LARGE : MARK_SMALL, height: scrolled ? MARK_LARGE : MARK_SMALL }}
          >
            <Image
              src="/images/logo-mark.png"
              alt=""
              fill
              priority
              sizes="64px"
              className="object-contain transition-opacity duration-300"
              style={{ opacity: isDark ? 0 : 1 }}
            />
            <Image
              src="/images/logo-mark-white.png"
              alt=""
              fill
              sizes="64px"
              className="object-contain transition-opacity duration-300"
              style={{ opacity: isDark ? 1 : 0 }}
            />
          </span>

          {/* Wordmark — clipped away to zero width on scroll */}
          <span
            className="relative block overflow-hidden shrink-0 transition-all duration-500 ease-out"
            style={{
              width: scrolled ? 0 : WORDMARK_W,
              height: WORDMARK_H,
              marginLeft: scrolled ? 0 : 10,
              opacity: scrolled ? 0 : 1,
            }}
          >
            {/* Fixed width on the images so the wrapper CLIPS them rather than
                squashing the artwork as it narrows. */}
            <Image
              src="/images/logo-wordmark.png"
              alt="The Coral Room"
              width={85}
              height={68}
              priority
              className="absolute left-0 top-0 max-w-none transition-opacity duration-300"
              style={{ width: WORDMARK_W, height: WORDMARK_H, opacity: isDark ? 0 : 1 }}
            />
            <Image
              src="/images/logo-wordmark-white.png"
              alt=""
              width={85}
              height={68}
              className="absolute left-0 top-0 max-w-none transition-opacity duration-300"
              style={{ width: WORDMARK_W, height: WORDMARK_H, opacity: isDark ? 1 : 0 }}
            />
          </span>
        </Link>
      </header>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ── Slide-Out Sidebar (Clean White Design) ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[320px] sm:w-[360px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation Sidebar"
      >
        {/* Sidebar Top — Logo + Close */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="The Coral Room"
              width={135}
              height={54}
              style={{ width: 'auto', height: '36px' }}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close Menu"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#111827] transition-colors duration-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-1">

          {/* Home */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/' ? 'bg-[#78B249]/15 text-[#467923]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#111827]'
            }`}
          >
            <span>Home</span>
            {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-[#78B249] shrink-0" />}
          </Link>

          {/* Fourth Dimension */}
          <Link
            href="/fourth-dimension-framework"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/fourth-dimension-framework' ? 'bg-[#78B249]/15 text-[#467923]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#111827]'
            }`}
          >
            <span>Fourth Dimension™</span>
            {pathname === '/fourth-dimension-framework' && <span className="w-1.5 h-1.5 rounded-full bg-[#78B249] shrink-0" />}
          </Link>

          {/* Solutions Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full text-left ${
                solutionLinks.some(l => pathname === l.href)
                  ? 'bg-[#78B249]/15 text-[#467923]'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#111827]'
              }`}
            >
              <span>Solutions</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Solutions Sub-items */}
            <div
              className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                solutionsOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {solutionLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between pl-8 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    pathname === href
                      ? 'text-[#467923] font-bold'
                      : 'text-gray-600 hover:text-[#111827] font-medium'
                  }`}
                >
                  <span>{label}</span>
                  {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-[#78B249] shrink-0" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <Link
            href="/portfolio"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/portfolio' ? 'bg-[#78B249]/15 text-[#467923]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#111827]'
            }`}
          >
            <span>Portfolio</span>
            {pathname === '/portfolio' && <span className="w-1.5 h-1.5 rounded-full bg-[#78B249] shrink-0" />}
          </Link>



        </nav>

        {/* Sidebar Bottom — CTA */}
        <div className="px-8 py-8 border-t border-gray-100">
          <Link
            href="/book-a-call"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-[#111827] transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-sm"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #9FE66F 100%)' }}
          >
            Book a Discovery Call
          </Link>
          <p className="text-center text-[11px] text-gray-400 mt-4">
            © {new Date().getFullYear()} The Coral Room. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Header;
