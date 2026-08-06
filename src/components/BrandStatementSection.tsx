import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const BrandStatementSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-20 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Headline & CTA */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#111827] leading-[1.15] tracking-tight max-w-xl">
            Not every brand needs us. The right ones know why they do.
          </h2>

          {/* Single Action Button */}
          <div className="mt-8">
            <Link href="/book-a-call" className="btn-hover-gradient group px-7 py-3.5 rounded-full border border-gray-900 text-gray-900 font-semibold text-sm sm:text-base flex items-center gap-3 hover:border-transparent hover:text-white transition-all duration-300 shadow-sm">
              <span>Let's Talk About Your Goals</span>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs group-hover:rotate-45 group-hover:border-white transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Paragraph Text */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-gray-600 text-base sm:text-lg leading-relaxed pt-2">
          <p>
            The Coral Room is built for companies that want more than tasks checked off a list. We work with founders and teams who care about strategy, quality, speed, and measurable growth.
          </p>
          <p>
            We will question weak ideas, protect the customer experience, and push for work that has a clear business reason behind it.
          </p>
          <p>
            If you want a partner who can think, build, market, and improve with you, let's talk.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BrandStatementSection;
