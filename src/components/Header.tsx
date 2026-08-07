'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  dark?: boolean;
}

const topLinks = [
  { label: 'Home',             href: '/' },
  { label: 'Fourth Dimension™', href: '/fourth-dimension-framework' },
  { label: 'Portfolio',        href: '/portfolio' },
  { label: 'Book a Call',      href: '/book-a-call' },
];

const solutionLinks = [
  { label: 'Design',                  href: '/design' },
  { label: 'Website',                 href: '/development' },
  { label: 'Optimisation',            href: '/optimisation' },
  { label: 'Marketing',               href: '/marketing' },
  { label: 'Marketing Campaigns',     href: '/marketing-campaigns' },
  { label: 'Paid Advertising',        href: '/paid-advertising' },
  { label: 'SEO & Search Visibility', href: '/seo-search-visibility' },
];

export const Header: React.FC<HeaderProps> = ({ dark = false }) => {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Top Header Bar ── */}
      <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between relative z-30">

        {/* Hamburger */}
        <button
          aria-label="Open Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="hover:opacity-80 transition-opacity p-1 cursor-pointer"
        >
          {dark ? (
            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" width="8" height="8" rx="4" fill="white"/>
              <rect width="23" height="8" rx="4" fill="white"/>
              <rect y="12" width="16" height="9" rx="4.5" fill="white"/>
              <rect x="17" y="12" width="16" height="9" rx="4.5" fill="white"/>
              <rect y="24.8852" width="33" height="8.11475" rx="4.05738" fill="white"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" width="8" height="8" rx="4" fill="#111827"/>
              <rect width="23" height="8" rx="4" fill="#111827"/>
              <rect y="12" width="16" height="9" rx="4.5" fill="#111827"/>
              <rect x="17" y="12" width="16" height="9" rx="4.5" fill="#111827"/>
              <rect y="24.8852" width="33" height="8.11475" rx="4.05738" fill="#111827"/>
            </svg>
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <Image
            src={dark ? '/images/logo-white.png' : '/images/logo.png'}
            alt="The Coral Room"
            width={135}
            height={54}
            priority
            style={{ width: 'auto', height: dark ? '42px' : '36px' }}
            className="object-contain"
          />
        </Link>
      </header>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ── Slide-Out Sidebar (original dark design) ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[320px] sm:w-[360px] bg-[#0a0a0a] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation Sidebar"
      >
        {/* Sidebar Top — Logo + Close */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/images/logo-white.png"
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer"
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
              pathname === '/' ? 'bg-[#9FE66F]/15 text-[#9FE66F]' : 'text-gray-300 hover:bg-white/8 hover:text-white'
            }`}
          >
            <span>Home</span>
            {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-[#9FE66F] shrink-0" />}
          </Link>

          {/* Fourth Dimension */}
          <Link
            href="/fourth-dimension-framework"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/fourth-dimension-framework' ? 'bg-[#9FE66F]/15 text-[#9FE66F]' : 'text-gray-300 hover:bg-white/8 hover:text-white'
            }`}
          >
            <span>Fourth Dimension™</span>
            {pathname === '/fourth-dimension-framework' && <span className="w-1.5 h-1.5 rounded-full bg-[#9FE66F] shrink-0" />}
          </Link>

          {/* Solutions Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full text-left ${
                solutionLinks.some(l => pathname === l.href)
                  ? 'bg-[#9FE66F]/15 text-[#9FE66F]'
                  : 'text-gray-300 hover:bg-white/8 hover:text-white'
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
                solutionsOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {solutionLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between pl-8 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    pathname === href
                      ? 'text-[#9FE66F] font-semibold'
                      : 'text-gray-400 hover:text-white font-medium'
                  }`}
                >
                  <span>{label}</span>
                  {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-[#9FE66F] shrink-0" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <Link
            href="/portfolio"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/portfolio' ? 'bg-[#9FE66F]/15 text-[#9FE66F]' : 'text-gray-300 hover:bg-white/8 hover:text-white'
            }`}
          >
            <span>Portfolio</span>
            {pathname === '/portfolio' && <span className="w-1.5 h-1.5 rounded-full bg-[#9FE66F] shrink-0" />}
          </Link>

          {/* Book a Call */}
          <Link
            href="/book-a-call"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === '/book-a-call' ? 'bg-[#9FE66F]/15 text-[#9FE66F]' : 'text-gray-300 hover:bg-white/8 hover:text-white'
            }`}
          >
            <span>Book a Call</span>
            {pathname === '/book-a-call' && <span className="w-1.5 h-1.5 rounded-full bg-[#9FE66F] shrink-0" />}
          </Link>

        </nav>

        {/* Sidebar Bottom — CTA */}
        <div className="px-8 py-8 border-t border-white/10">
          <Link
            href="/book-a-call"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-[#111827] transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #9FE66F 100%)' }}
          >
            Book a Discovery Call
          </Link>
          <p className="text-center text-[11px] text-gray-600 mt-4">
            © {new Date().getFullYear()} The Coral Room. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Header;
