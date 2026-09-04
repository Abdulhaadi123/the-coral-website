import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconFacebook, IconInstagram, IconLinkedin } from '@/components/icons/Icons';

export const FooterSection: React.FC = () => {
  return (
    <footer data-nav-dark className="w-full relative bg-black text-white pt-16 pb-12 overflow-hidden">

      {/* Background 3D Liquid Image */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <Image
          src="/images/footer-bg.webp"
          alt="Coral Room Footer 3D liquid background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
      </div>

      {/* Main Footer Container */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* Left Big Card Box */}
        <div className="lg:col-span-7 bg-[#121214]/85 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-12 flex flex-col justify-between shadow-2xl">

          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white mb-6">
              Let's find out<br />if we're the right fit
            </h2>

            <div className="relative inline-block mb-12">
              <div className="absolute -top-3 -left-3 text-[#9FE66F] z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
              </div>
              <Link
                href="/book-a-call"
                style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
                className="group px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg hover:opacity-90 transition-all duration-300"
              >
                <span>Book a Discovery call</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-sm sm:text-base">Services</h4>
              <Link href="/design" className="text-gray-400 hover:text-white transition-colors">Design</Link>
              <Link href="/development" className="text-gray-400 hover:text-white transition-colors">Development</Link>
              <Link href="/optimisation" className="text-gray-400 hover:text-white transition-colors">Optimisation</Link>
              <Link href="/marketing" className="text-gray-400 hover:text-white transition-colors">Marketing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-sm sm:text-base">Our Work</h4>
              <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link>
              <Link href="/fourth-dimension-framework" className="text-gray-400 hover:text-white transition-colors">Fourth Dimension™</Link>
              <Link href="/marketing-campaigns" className="text-gray-400 hover:text-white transition-colors">Campaigns</Link>
              <Link href="/paid-advertising" className="text-gray-400 hover:text-white transition-colors">Paid Ads</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-sm sm:text-base">Company</h4>
              <Link href="/book-a-call" className="text-gray-400 hover:text-white transition-colors">Book a Call</Link>
              <Link href="/seo-search-visibility" className="text-gray-400 hover:text-white transition-colors">SEO Services</Link>
              <Link href="/marketing" className="text-gray-400 hover:text-white transition-colors">Journal</Link>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">

          {/* Collaborate Card */}
          <div className="bg-[#121214]/85 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col justify-between flex-1 shadow-2xl">
            <div>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-6">
                Collaborate<br />with us
              </h3>
              <div className="relative inline-block mb-8">
                <div className="absolute -top-3 -left-3 text-[#9FE66F] z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </div>
                <Link
                  href="/book-a-call"
                  style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
                  className="px-5 py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all inline-block"
                >
                  Collaborate with us
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-6 border-t border-white/10 text-xs sm:text-sm text-gray-400">
              <Link href="/design" className="hover:text-white transition-colors">Design services</Link>
              <Link href="/development" className="hover:text-white transition-colors">Web development</Link>
              <Link href="/fourth-dimension-framework" className="hover:text-white transition-colors">Our framework</Link>
            </div>
          </div>

          {/* Social Cards Grid */}
          <div className="grid grid-cols-3 gap-4">

            <a
              href="https://www.facebook.com/people/The-Coral-Room/61574508644297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-[#171717] rounded-2xl flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300"
              style={{ width: '100%', aspectRatio: '168/156' }}
            >
              <IconFacebook />
            </a>

            <a
              href="https://www.instagram.com/thecoral_room"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-[#171717] rounded-2xl flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300"
              style={{ width: '100%', aspectRatio: '168/156' }}
            >
              <IconInstagram />
            </a>

            <a
              href="https://www.linkedin.com/company/coral-room/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="bg-[#171717] rounded-2xl flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300"
              style={{ width: '100%', aspectRatio: '168/156' }}
            >
              <IconLinkedin />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
