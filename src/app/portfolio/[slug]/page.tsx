'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { projects } from '../data';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Scroll to top on mount + Prevent keyboard & mouse wheel zoom gestures
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };

    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('gesturestart', handleGesture);
    window.addEventListener('gesturechange', handleGesture);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col w-full overflow-x-hidden select-none">
      {/* Top Navbar */}
      <Header />

      {/* Full Screen Edge-to-Edge Image (Zero side space, Non-zoomable) */}
      {project.detailImage ? (
        <div className="w-full bg-white leading-none overflow-hidden touch-pan-y min-h-[85vh] relative flex flex-col items-center">
          {/* Subtle loading spinner/shimmer while heavy image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10 min-h-[85vh]">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9FE66F] rounded-full animate-spin" />
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.detailImage}
            alt={project.title}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-auto block min-w-full pointer-events-none select-none touch-none transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'pan-y',
            } as React.CSSProperties}
          />
        </div>
      ) : (
        /* Fallback view if no full vertical image is uploaded yet */
        <div className="w-full max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-12">
            Full case study layout image for this project will be uploaded soon.
          </p>

          {project.image && (
            <div className="relative w-full max-w-3xl aspect-[16/10] mx-auto rounded-3xl overflow-hidden shadow-2xl mb-16">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-center"
              />
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer */}
      <FooterSection />
    </main>
  );
}
