'use client';

import React from 'react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

export const ShowcaseSection: React.FC = () => {
  return (
    <section className="w-full my-6 overflow-hidden">
      <FadeIn direction="up">
        <div className="relative w-full aspect-[1643/294] overflow-hidden">
          <video
            src={assetUrl('/WEB.mp4')}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center block"
          />
        </div>
      </FadeIn>
    </section>
  );
};

export default ShowcaseSection;
