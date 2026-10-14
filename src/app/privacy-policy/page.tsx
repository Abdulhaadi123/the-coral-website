import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, ShieldCheck, Mail, Globe, MapPin, Lock, ExternalLink } from 'lucide-react';
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
            <span className="text-xs text-gray-500 font-medium">Last Updated: October 14, 2026</span>
          </div>

          <h1 className="font-medium text-black text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] leading-[1.15] tracking-tight max-w-4xl">
            Privacy Policy
          </h1>

          <div className="mt-6 flex flex-col gap-4 text-base sm:text-lg text-gray-700 max-w-3xl leading-relaxed">
            <p>
              Welcome to The Coral Room. Your privacy matters to us. We are committed to handling personal information responsibly and being transparent about how information is collected, used, stored, and shared when you interact with our website and digital services.
            </p>
            <p>
              This Privacy Policy explains how The Coral Room (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) processes personal information through our website, <a href="https://thecoralroom.co/" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline font-semibold hover:text-black">https://thecoralroom.co/</a>, and in connection with our business activities.
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              By using our website, you acknowledge the privacy practices described in this policy. Where consent is legally required, we will request it separately.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Main Content Body */}
      <section className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Main Policy Articles */}
          <div className="lg:col-span-8 flex flex-col gap-10 text-gray-700 leading-relaxed text-sm sm:text-base">

            {/* Section 1 */}
            <article className="border-t border-gray-100 pt-8 first:border-none first:pt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                1. Who We Are
              </h2>
              <p className="mb-3">
                The Coral Room is a creative and digital agency offering branding, digital design, website development, search engine optimisation (SEO), performance marketing, paid advertising, and related digital services.
              </p>
              <p className="mb-4">
                Our website provides information about our services, projects, expertise, and opportunities to collaborate with our team.
              </p>
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 flex flex-col gap-2 text-sm">
                <div><strong className="text-gray-900">Website:</strong> <a href="https://thecoralroom.co/" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-medium">https://thecoralroom.co/</a></div>
                <div><strong className="text-gray-900">Business Name:</strong> The Coral Room</div>
                <div><strong className="text-gray-900">Privacy Contact:</strong> <a href="mailto:info@thecoralroom.co" className="text-[#305915] underline hover:text-black font-medium">info@thecoralroom.co</a></div>
                <div><strong className="text-gray-900">Business Location:</strong> 40-Broadway Commercial, Park View, Lahore, Pakistan</div>
              </div>
            </article>

            {/* Section 2 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-6">
                We may collect personal information in several ways, depending on how you interact with our website and services.
              </p>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    2.1 Information You Provide Voluntarily
                  </h3>
                  <p className="mb-3">
                    When you contact us, book a discovery call, request a proposal, or communicate with our team, we may collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-3">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Company or business name</li>
                    <li>Website URL</li>
                    <li>Project requirements and service interests</li>
                    <li>Budget or project-related information</li>
                    <li>Messages, inquiries, and other information you choose to provide</li>
                  </ul>
                  <p>
                    We use this information to respond to your inquiries, evaluate potential projects, provide requested services, and maintain professional communications.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    2.2 Information Collected Automatically
                  </h3>
                  <p className="mb-3">
                    When you visit our website, certain technical information may be collected automatically, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-3">
                    <li>Internet Protocol (IP) address</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Pages visited and navigation activity</li>
                    <li>Referral sources</li>
                    <li>Approximate geographic location derived from technical information</li>
                    <li>Website interaction and performance data</li>
                    <li>Cookie identifiers and related tracking information</li>
                  </ul>
                  <p>
                    This information may be processed through website infrastructure, analytics services, or other technologies enabled on our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    2.3 Business and Client Information
                  </h3>
                  <p className="mb-3">
                    When working with clients, we may process business contact details, project documents, marketing information, communications, and other data necessary to deliver agreed services.
                  </p>
                  <p>
                    Where we process personal information on behalf of a client, our responsibilities may also be governed by the applicable service agreement or data processing agreement.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 3 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">
                We may use personal information for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
                <li>Responding to inquiries, questions, and requests</li>
                <li>Scheduling meetings and discovery calls</li>
                <li>Preparing proposals and delivering digital services</li>
                <li>Managing client relationships and project communications</li>
                <li>Improving website functionality, usability, and performance</li>
                <li>Understanding visitor interactions and traffic sources</li>
                <li>Measuring the effectiveness of marketing activities</li>
                <li>Protecting our website against security threats, fraud, and misuse</li>
                <li>Maintaining business records and fulfilling legal obligations</li>
                <li>Sending marketing communications where permitted by applicable law</li>
              </ul>
              <p>
                We process information only for appropriate business purposes and on a legally permitted basis.
              </p>
            </article>

            {/* Section 4 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="mb-3">
                Our website may use cookies, pixels, tags, and similar technologies to support essential website functions, measure performance, and understand how visitors interact with our content.
              </p>
              <p className="mb-3">
                These technologies may include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li><strong className="text-gray-900">Essential Cookies:</strong> Support core website functionality, security, and technical operations.</li>
                <li><strong className="text-gray-900">Analytics Cookies:</strong> Help us understand website traffic, user interactions, and performance trends.</li>
                <li><strong className="text-gray-900">Marketing and Advertising Cookies:</strong> May be used to measure advertising campaigns, understand conversions, and support advertising activities.</li>
                <li><strong className="text-gray-900">Preference Cookies:</strong> Where enabled, may remember visitor choices and website preferences.</li>
              </ul>
              <p className="mb-3">
                You can manage or disable cookies through your browser settings. Where required by applicable law, we will obtain your consent before using non-essential cookies or similar technologies.
              </p>
              <p>
                Disabling certain cookies may affect website functionality.
              </p>
            </article>

            {/* Section 5 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                5. Google Analytics and Google Advertising Services
              </h2>
              <p className="mb-3">
                Our website may use Google technologies, including Google Tag Manager, Google Analytics, and Google Ads, depending on our active website configuration.
              </p>
              <p className="mb-3">
                These technologies can help us understand website performance, measure conversions, and evaluate marketing campaigns.
              </p>
              <p className="mb-3">
                Depending on which features are enabled, Google may process information such as page views, device and browser information, cookie identifiers, IP-related information, and website interactions.
              </p>
              <p className="mb-3">
                Google&apos;s processing of information is described in its own privacy documentation.
              </p>
              <p className="mb-2 font-medium text-gray-900">
                For more information, visit:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
                <li>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-semibold inline-flex items-center gap-1">
                    <span>Google Privacy Policy</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-semibold inline-flex items-center gap-1">
                    <span>How Google Uses Information From Sites or Apps That Use Its Services</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-semibold inline-flex items-center gap-1">
                    <span>Google My Ad Center</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
              <p>
                Where legally required, we obtain appropriate consent before activating relevant advertising or analytics technologies.
              </p>
            </article>

            {/* Section 6 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                6. Meta Pixel and Social Media Advertising
              </h2>
              <p className="mb-3">
                Our website may use Meta technologies, including the Meta Pixel, to understand how visitors interact with our website and to measure the performance of advertising campaigns across Facebook and Instagram.
              </p>
              <p className="mb-3">
                Depending on the technologies enabled, information processed may include page visits, website interactions, browser and device identifiers, and conversion events.
              </p>
              <p className="mb-3">
                Meta may process this information according to its own privacy practices and applicable agreements.
              </p>
              <p className="mb-3">
                You can learn more at <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-semibold inline-flex items-center gap-1"><span>Meta Privacy Policy</span><ExternalLink className="w-3.5 h-3.5" /></a>.
              </p>
              <p>
                Where required, we obtain consent before using these technologies for non-essential tracking or personalised advertising.
              </p>
            </article>

            {/* Section 7 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                7. Third-Party Services and External Websites
              </h2>
              <p className="mb-3">
                We may use trusted third-party service providers to operate our website and deliver our services.
              </p>
              <p className="mb-3">
                These providers may support website hosting, analytics, scheduling, customer relationship management, email communications, advertising, cybersecurity, or other business functions.
              </p>
              <p className="mb-3">
                Service providers may process information only as necessary to perform their functions, subject to applicable agreements and legal requirements.
              </p>
              <p className="mb-3">
                Our website may also contain links to external websites, platforms, or services.
              </p>
              <p>
                We are not responsible for the privacy practices or content of independently operated third-party websites. We encourage visitors to review their privacy policies before providing personal information.
              </p>
            </article>

            {/* Section 8 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                8. How We Share Personal Information
              </h2>
              <p className="mb-3">
                We may disclose personal information in limited circumstances, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
                <li>To service providers supporting our website and business operations</li>
                <li>To professional advisers where necessary</li>
                <li>To business partners or contractors involved in delivering requested services</li>
                <li>To regulators or authorities where required by applicable law</li>
                <li>To protect our legal rights, property, users, or website security</li>
                <li>In connection with a legitimate business restructuring or transfer, subject to applicable safeguards</li>
              </ul>
              <p className="mb-3">
                We do not share personal information for purposes that are incompatible with the disclosures and choices described in this Privacy Policy.
              </p>
              <p>
                Any use of personal information for third-party advertising or related commercial purposes will be subject to applicable disclosure, consent, and privacy requirements.
              </p>
            </article>

            {/* Section 9 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                9. Data Retention
              </h2>
              <p className="mb-3">
                We retain personal information for as long as reasonably necessary to fulfil the purposes described in this Privacy Policy.
              </p>
              <p className="mb-3">
                Retention periods may depend on:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
                <li>The nature of the information collected</li>
                <li>The purpose for which it was provided</li>
                <li>The duration of an active client relationship</li>
                <li>Contractual and recordkeeping obligations</li>
                <li>Applicable legal requirements</li>
                <li>Legitimate security and dispute-resolution needs</li>
              </ul>
              <p>
                When information is no longer required, we will delete, anonymise, or securely retain it where continued storage is legally necessary.
              </p>
            </article>

            {/* Section 10 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                10. Information Security
              </h2>
              <p className="mb-3">
                We take reasonable technical and organisational measures designed to protect personal information against unauthorised access, alteration, disclosure, loss, and misuse.
              </p>
              <p className="mb-3">
                These measures may include secure website connections, access controls, authorised service providers, and appropriate internal procedures.
              </p>
              <p className="mb-3">
                However, no method of electronic transmission or storage can be guaranteed to be completely secure.
              </p>
              <p>
                We continually aim to maintain appropriate safeguards relative to the information we process.
              </p>
            </article>

            {/* Section 11 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                11. International Data Transfers
              </h2>
              <p className="mb-3">
                Depending on the service providers and technologies we use, personal information may be processed or stored in countries outside your country of residence.
              </p>
              <p>
                Where applicable, we take steps to ensure international data transfers are conducted in accordance with relevant privacy laws and appropriate safeguards.
              </p>
            </article>

            {/* Section 12 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                12. Your Privacy Rights
              </h2>
              <p className="mb-3">
                Depending on your location and applicable data protection laws, you may have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
                <li>Request access to personal information held about you</li>
                <li>Ask us to correct inaccurate or incomplete information</li>
                <li>Request deletion of eligible personal information</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Withdraw consent where processing relies on consent</li>
                <li>Request a portable copy of eligible personal information</li>
                <li>Opt out of certain marketing communications</li>
                <li>Lodge a complaint with an appropriate data protection authority</li>
              </ul>
              <p className="mb-3">
                These rights may be subject to legal conditions and exceptions.
              </p>
              <p className="mb-3">
                To submit a privacy-related request, please contact us using the information provided in the Contact Us section.
              </p>
              <p>
                We may need to verify your identity before responding to certain requests.
              </p>
            </article>

            {/* Section 13 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                13. Marketing Communications
              </h2>
              <p className="mb-3">
                If you subscribe to our updates, request information, or otherwise agree to receive marketing communications, we may contact you about our services, insights, projects, or relevant business updates.
              </p>
              <p className="mb-3">
                You can opt out of marketing emails at any time by following an unsubscribe link, where provided, or contacting us directly.
              </p>
              <p>
                Opting out of marketing communications does not prevent us from sending necessary service-related or transactional messages.
              </p>
            </article>

            {/* Section 14 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                14. Children&apos;s Privacy
              </h2>
              <p className="mb-3">
                Our website and professional services are intended primarily for businesses and adults.
              </p>
              <p className="mb-3">
                We do not knowingly solicit personal information directly from children in circumstances where parental consent is required by applicable law.
              </p>
              <p>
                If you believe a child has provided personal information to us without appropriate authorisation, please contact us so we can review the situation and take appropriate action.
              </p>
            </article>

            {/* Section 15 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                15. Third-Party Links and Social Media Platforms
              </h2>
              <p className="mb-3">
                Our website may link to platforms such as LinkedIn, Facebook, Instagram, and other external services.
              </p>
              <p className="mb-3">
                When you visit these platforms, their respective privacy policies and terms govern the information they collect and process.
              </p>
              <p>
                We encourage users to review the privacy settings of any third-party platform they use.
              </p>
            </article>

            {/* Section 16 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                16. Changes to This Privacy Policy
              </h2>
              <p className="mb-3">
                We may update this Privacy Policy periodically to reflect changes in our website, services, data processing practices, technologies, or applicable legal requirements.
              </p>
              <p className="mb-3">
                When updates are made, we will revise the Last Updated date displayed at the top of this page.
              </p>
              <p className="mb-3">
                If significant changes require additional notice or consent under applicable law, we will take the necessary steps.
              </p>
              <p>
                We encourage visitors to review this page periodically.
              </p>
            </article>

            {/* Section 17 */}
            <article className="border-t border-gray-100 pt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">
                17. Contact Us
              </h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, how we handle personal information, or wish to exercise applicable privacy rights, please contact us.
              </p>
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 flex flex-col gap-2.5 text-sm mb-4">
                <div className="font-bold text-base text-gray-900">The Coral Room</div>
                <div><strong className="text-gray-900">Website:</strong> <a href="https://thecoralroom.co/" target="_blank" rel="noopener noreferrer" className="text-[#305915] underline hover:text-black font-medium">https://thecoralroom.co/</a></div>
                <div><strong className="text-gray-900">Email:</strong> <a href="mailto:info@thecoralroom.com" className="text-[#305915] underline hover:text-black font-medium">info@thecoralroom.com</a></div>
                <div><strong className="text-gray-900">Business Address:</strong> 40-Broadway Commercial, Park View, Lahore, Pakistan</div>
              </div>
              <p className="mb-6">
                We will review privacy-related requests and respond in accordance with applicable legal requirements.
              </p>
              <p className="font-semibold text-gray-900 text-base">
                The Coral Room — Digital experiences built to be seen, trusted, and chosen.
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
                  <h3 className="font-bold text-base text-white">The Coral Room</h3>
                  <p className="text-xs text-gray-400">Privacy &amp; Data Transparency</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-4 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>https://thecoralroom.co/</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>40-Broadway Commercial, Park View, Lahore, Pakistan</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>info@thecoralroom.co</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#9FE66F] shrink-0 mt-0.5" />
                  <span>Google Business Profile &amp; Global Privacy Compliant</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">Privacy Contact</h4>
                <p className="text-sm font-semibold text-white">The Coral Room Privacy Team</p>
                <a
                  href="mailto:info@thecoralroom.co"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#9FE66F] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>info@thecoralroom.co</span>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-3xl p-6 flex flex-col gap-3">
              <h4 className="font-bold text-sm text-gray-900">Have specific questions?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                If you have questions regarding your project confidentiality or our data handling practices,
                reach out directly to our team.
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
