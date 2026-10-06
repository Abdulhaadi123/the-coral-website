import type { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import PartnersSection from '@/components/PartnersSection';
import ProcessWithDepthSection from '@/components/ProcessWithDepthSection';
import FeaturedWorkSection from '@/components/FeaturedWorkSection';
import ClientTestimonialsSection from '@/components/ClientTestimonialsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BrandStatementSection from '@/components/BrandStatementSection';
import JournalSection from '@/components/JournalSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import FooterSection from '@/components/FooterSection';
import { getPageSeo } from '@/lib/seo';
import { getPartners, getTestimonials, getHomepageVideoUrl } from '@/lib/publicData';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/');
  return { title: seo.title, description: seo.description };
}

export default async function Home() {
  const [partners, testimonials, homepageVideoUrl] = await Promise.all([
    getPartners(),
    getTestimonials(),
    getHomepageVideoUrl(),
  ]);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/*
        The "What we do" section just below the hero paints this as a CSS background, which
        the browser would only discover after the stylesheet is parsed (PageSpeed: "LCP
        request discovery"). Hinting it here starts the download with the HTML.
      */}
      <link rel="preload" as="image" href="/images/cta-banner-bg.webp" fetchPriority="high" />

      {/* Top Header Navigation */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Showcase Video Section */}
      <ShowcaseSection videoUrl={homepageVideoUrl} />

      {/* What We Do Section */}
      <WhatWeDoSection />

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* Process With Depth Section */}
      <ProcessWithDepthSection />

      {/* Featured Work Section */}
      <FeaturedWorkSection />

      {/* Client Testimonials + Certification Partners */}
      <ClientTestimonialsSection testimonials={testimonials} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Brand Statement Section */}
      <BrandStatementSection />

      {/* Journal / Blog Section */}
      <JournalSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Dark 3D Fluid Footer Section */}
      <FooterSection />
    </main>
  );
}
