'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animated';

interface ServiceCardProps {
  iconSrc: string;
  altText: string;
  title: string;
  description: string;
  serviceName: string;
  href?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ iconSrc, altText, title, description, serviceName, href = '#' }) => {
  return (
    <Link 
      href={href}
      className="flex flex-col justify-between h-full p-2 sm:p-3 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer group block"
    >
      <div className="flex-1 flex flex-col justify-start">
        {/* Icon Image */}
        <div className="w-12 h-12 flex items-center justify-start mb-4">
          <Image 
            src={iconSrc} 
            alt={altText} 
            width={44} 
            height={44} 
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#21A0A3] transition-colors">{title}</h3>
        
        {/* Description */}
        <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed mb-6 font-normal">
          {description}
        </p>
      </div>

      {/* Action Link with last word bold & aligned baseline */}
      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#111827]">
          <span className="font-normal text-gray-800">
            Learn more about <strong className="font-bold text-[#111827]">{serviceName}</strong>
          </span>
          <span className="w-5 h-5 rounded-full border border-[#111827] flex items-center justify-center text-[10px] group-hover:bg-[#111827] group-hover:text-white transition-all duration-300 shrink-0">
            <ArrowRight className="w-3 h-3" />
          </span>
        </span>
      </div>
    </Link>
  );
};

export const WhatWeDoSection: React.FC = () => {
  return (
    <section className="w-full bg-[url('/images/cta-banner-bg.webp')] bg-cover bg-center py-16 mt-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Header Content */}
        <FadeIn direction="up" className="mb-16">
          <span className="text-xs font-bold tracking-widest text-gray-700 uppercase block mb-4">
            WHAT WE DO
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-semibold text-[#111827] max-w-3xl mb-8" style={{ lineHeight: '1.10' }}>
            Brand, web, and marketing built around one goal: growth
          </h2>

          <p className="text-base sm:text-lg text-[#1F2937] max-w-4xl leading-relaxed">
            The Coral Room helps businesses shape sharper brands, build stronger digital platforms, improve
            performance, and attract better customers. We bring brand strategy, digital development, performance
            optimisation, and marketing together so your digital presence feels clear, credible, and built to grow.
          </p>
        </FadeIn>

        {/* Services Grid (4 Columns, Equal Height Alignment) */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4 items-stretch">
          <StaggerItem className="h-full">
            <ServiceCard
              iconSrc="/images/what-we-do/design.webp"
              altText="Design Service Icon"
              title="Design"
              description="Clear, refined design that makes your brand easier to trust, use, and choose."
              serviceName="Design"
              href="/design"
            />
          </StaggerItem>

          <StaggerItem className="h-full">
            <ServiceCard
              iconSrc="/images/what-we-do/development.webp"
              altText="Development Service Icon"
              title="Development"
              description="Websites, apps, ecommerce stores, and CMS platforms built for speed, scale, and clean user journeys."
              serviceName="Development"
              href="/development"
            />
          </StaggerItem>

          <StaggerItem className="h-full">
            <ServiceCard
              iconSrc="/images/what-we-do/optimisation.webp"
              altText="Optimisation Service Icon"
              title="Optimisation"
              description="SEO, CRO, maintenance, and technical improvements that help your digital presence perform better over time."
              serviceName="Optimisation"
              href="/optimisation"
            />
          </StaggerItem>

          <StaggerItem className="h-full">
            <ServiceCard
              iconSrc="/images/what-we-do/marketing.webp"
              altText="Marketing Service Icon"
              title="Marketing"
              description="Paid ads, content, email, automation, and CRM systems built to attract the right audience and turn interest into customers."
              serviceName="Marketing"
              href="/marketing"
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
