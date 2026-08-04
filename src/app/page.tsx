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

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Header Navigation */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Showcase Video Section */}
      <ShowcaseSection />

      {/* What We Do Section */}
      <WhatWeDoSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Process With Depth Section */}
      <ProcessWithDepthSection />

      {/* Featured Work Section */}
      <FeaturedWorkSection />

      {/* Client Testimonials + Certification Partners */}
      <ClientTestimonialsSection />

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
