'use client';

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { projects } from '../data';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const staticProject = projects.find(p => p.slug === slug);
  const [project, setProject] = React.useState(staticProject || null);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.projects) {
          const match = data.projects.find((p: any) => p.slug === slug);
          if (match) setProject(match);
        }
      })
      .catch(e => console.log('Using static fallback project'));
  }, [slug]);

  if (!project && !staticProject) notFound();
  const currentProject = project || staticProject!;

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
      {currentProject.detailImage ? (
        <div className="w-full bg-white leading-none overflow-hidden touch-pan-y min-h-[85vh] relative flex flex-col items-center">
          {/* Subtle loading spinner/shimmer while heavy image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10 min-h-[85vh]">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9FE66F] rounded-full animate-spin" />
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentProject.detailImage}
            alt={currentProject.title}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-auto object-contain block mx-auto pointer-events-none select-none max-w-none"
            style={{
              display: 'block',
              maxWidth: '100%',
              width: '100%',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
          />
        </div>
      ) : currentProject.image ? (
        <div className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="py-32 text-center text-gray-400">
          No showcase image available for this project.
        </div>
      )}

      {/* Bottom Footer */}
      <FooterSection />
    </main>
  );
}
