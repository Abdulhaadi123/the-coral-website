'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { VideoLightbox } from '@/components/VideoLightbox';

interface ProjectDetailViewerProps {
  project: {
    title: string;
    slug?: string | null;
    image?: string | null;
    detailImage?: string | null;
    videoUrl?: string | null;
  };
}

export const ProjectDetailViewer: React.FC<ProjectDetailViewerProps> = ({ project }) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lockChecked, setLockChecked] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // Check lock on mount — redirect to gate if not unlocked
  useEffect(() => {
    const isUnlocked = localStorage.getItem('coral_portfolio_unlocked') === 'true';
    if (!isUnlocked) {
      const slug = project.slug || '';
      router.replace(`/portfolio${slug ? `?redirect=/portfolio/${slug}` : ''}`);
    } else {
      setLockChecked(true);
    }
  }, [router, project.slug]);

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

  // Show spinner while checking lock or if locked (will redirect)
  if (!lockChecked) {
    return (
      <div className="flex items-center justify-center min-h-[85vh] bg-white">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9FE66F] rounded-full animate-spin" />
      </div>
    );
  }

  const videoButton = project.videoUrl && (
    <button
      type="button"
      onClick={() => setVideoOpen(true)}
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 pl-3.5 pr-5 py-3 rounded-full bg-[#111827]/90 backdrop-blur-md border border-white/10 text-white text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <PlayCircle className="w-5 h-5 text-[#A7F176]" />
      <span>Watch Video</span>
    </button>
  );

  const videoLightbox = project.videoUrl && (
    <VideoLightbox videoUrl={videoOpen ? project.videoUrl : null} onClose={() => setVideoOpen(false)} />
  );

  if (project.detailImage) {
    return (
      <div className="w-full bg-white leading-none overflow-hidden touch-pan-y min-h-[85vh] relative flex flex-col items-center">
        {/* Subtle loading spinner while heavy image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10 min-h-[85vh]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9FE66F] rounded-full animate-spin" />
          </div>
        )}

        <Image
          src={assetUrl(project.detailImage)}
          alt={project.title}
          width={1600}
          height={1000}
          sizes="100vw"
          quality={100}
          priority
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setImageLoaded(true)}
          className="pointer-events-none select-none"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxWidth: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        />

        {videoButton}
        {videoLightbox}
      </div>
    );
  }

  if (project.image) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
          <Image
            src={assetUrl(project.image)}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            quality={100}
            className="object-cover"
          />
        </div>

        {videoButton}
        {videoLightbox}
      </div>
    );
  }

  return (
    <div className="py-32 text-center text-gray-400">
      No showcase image available for this project.
    </div>
  );
};
