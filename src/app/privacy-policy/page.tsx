import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, ShieldCheck, Mail, Globe, MapPin, Lock, FileText } from 'lucide-react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { FadeIn } from '@/components/Animated';
import { getPageSeo } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/privacy-policy');
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Navbar */}
      <Header />

      {/* Hero Header */}
      <section className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%] pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-10">
        <FadeIn direction="up">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9FE66F]/20 text-[#305915] border border-[#9FE66F]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#467923]" />
              <span>Legal &amp; Privacy</span>
            </span>
            <span className="text-xs text-gray-400">Effective Date: October 2026</span>
          </div>

          <h1
            className="font-medium text-black text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] leading-[1.15] tracking-tight max-w-4xl"
          >
            Privacy Policy
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
            At The Coral Room, we respect your privacy and are committed to protecting the personal information
            you share with us. This policy outlines how we collect, use, disclose, and safeguard your data when
            you visit our website or interact with our services.
          </p>
        </FadeIn>
      </section>

      {/* Main Content Body */}
      <section className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Main Policy Articles */}
          <div className="lg:col-span-8 flex flex-col gap-10 text-gray-700 leading-relaxed text-sm sm:text-base">
            
            {/* Section 1 */}
            <article className="border-t border-gray-100 pt-8 first:border-none first:pt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                <span>1. Overview &amp; Information We Collect</span>
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us when filling out our discovery call forms, requesting a proposal,
                subscribing to our communications, or contacting us directly.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                <li><strong className="text-gray-900">Personal Information:</strong> Name, business email address, phone number, company name, and project requirements.</li>
                <li><strong className="text-gray-900">Technical Data:</strong> IP address, browser type and version, device identifier, operating system, and referral sources.</li>
                <li><strong className="text-gray-900">Usage Data:</strong> Pages visited, time spent on pages, navigation paths, and interactions with buttons or links.</li>
              </ul>
            </article>

            {/* Section 2 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">
                We use the information we collect for business operations and to enhance client service delivery, including:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Service Delivery</h3>
                  <p className="text-xs text-gray-600">Reviewing project scopes, conducting discovery audits, and delivering branding and development work.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Client Communications</h3>
                  <p className="text-xs text-gray-600">Responding to inquiries, scheduling calls, sending proposals, and providing project updates.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Security &amp; Performance</h3>
                  <p className="text-xs text-gray-600">Protecting against malicious activity, detecting fraud, and optimizing page load speeds.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Analytics &amp; Optimization</h3>
                  <p className="text-xs text-gray-600">Understanding audience needs to refine our content, case studies, and user journeys.</p>
                </div>
              </div>
            </article>

            {/* Section 3 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                3. Google Services &amp; Third-Party Technologies
              </h2>
              <p className="mb-4">
                In compliance with Google Business Profile policies and search engine guidelines, we maintain strict privacy
                standards regarding automated tracking and data exchange.
              </p>
              <p className="mb-4">
                Our site may utilize analytics and performance measurement tools, including Google Analytics 4 (GA4) and Google
                Tag Manager (GTM). These tools help us analyze aggregate website traffic without personally identifying individual
                visitors. You can opt out of Google Analytics data collection by installing the official Google Analytics Opt-out Browser Add-on.
              </p>
            </article>

            {/* Section 4 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                4. Cookies &amp; Local Storage
              </h2>
              <p className="mb-4">
                Cookies are small text files placed on your device to ensure proper site functionality and provide a seamless browsing
                experience. We use essential cookies required for navigation and security, as well as analytical cookies to measure site performance.
                You can configure your browser to reject cookies or notify you when cookies are being set.
              </p>
            </article>

            {/* Section 5 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                5. Data Security &amp; Retention
              </h2>
              <p className="mb-4">
                We implement robust technical and organizational security measures to protect your personal information against
                unauthorized access, loss, misuse, or alteration. All web communications are encrypted via SSL/TLS (HTTPS).
              </p>
              <p className="mb-4">
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or to
                comply with applicable legal, accounting, and reporting obligations.
              </p>
            </article>

            {/* Section 6 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                6. Your Rights &amp; Choices
              </h2>
              <p className="mb-4">
                Depending on your location, you may have statutory rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                <li>The right to request access to the personal data we hold about you.</li>
                <li>The right to request rectification of inaccurate or incomplete information.</li>
                <li>The right to request erasure of your data when it is no longer required for legitimate business purposes.</li>
                <li>The right to withdraw consent at any time for marketing communications.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact our team via the contact details provided below.
              </p>
            </article>

            {/* Section 7 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                7. Policy Updates
              </h2>
              <p className="mb-4">
                We may periodically update this Privacy Policy to reflect changes in our operational practices, regulatory requirements,
                or service offerings. The updated version will be indicated by the &quot;Effective Date&quot; at the top of this page.
              </p>
            </article>

          </div>

          {/* Sticky Sidebar Info Card */}
          <div className="lg:col-span-4 w-full sticky top-28 flex flex-col gap-6">
            <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#9FE66F]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Data Protection</h3>
                  <p className="text-xs text-gray-400">The Coral Room Standards</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-4 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>Strict compliance with global privacy standards &amp; search platform guidelines.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>We never sell or rent your personal information to third parties.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>Client-tailored privacy commitments across all agency engagements.</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">Contact Officer</h4>
                <p className="text-sm font-semibold text-white">The Coral Room Privacy Team</p>
                <p className="text-xs text-gray-400 mt-1">For inquiries or data removal requests:</p>
                <a
                  href="mailto:hello@thecoralroom.com"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#9FE66F] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>hello@thecoralroom.com</span>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-6 flex flex-col gap-3">
              <h4 className="font-bold text-sm text-gray-900">Have specific questions?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                If you have questions regarding your project confidentiality or our data handling practices,
                reach out directly to our leadership team.
              </p>
              <Link
                href="/book-a-call"
                className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                <span>Book a Discovery Call</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
