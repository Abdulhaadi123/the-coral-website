'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { VideoLightbox } from '@/components/VideoLightbox';

/** Re-encode quality for the (very tall) detail image slices — see the note where it's used. */
const DETAIL_IMAGE_QUALITY = 75;

interface DetailImagePart {
  url: string;
  width: number;
  height: number;
}

interface ProjectDetailViewerProps {
  project: {
    title: string;
    slug?: string | null;
    image?: string | null;
    // Legacy single-image shape (only the static fallback sample data still
    // uses this — every real, DB-backed project now uses detailImages).
    detailImage?: string | null;
    // A design can be uploaded as several stacked slices instead of one huge
    // file — smaller uploads, faster/parallel loading — while still reading
    // as a single continuous image on the page (see the render below).
    detailImages?: DetailImagePart[];
    videos?: { url: string; title: string }[];
    // The project's own website (set in the admin) — shown as an "Explore Project"
    // button inside the video modal.
    exploreUrl?: string | null;
  };
}

export const ProjectDetailViewer: React.FC<ProjectDetailViewerProps> = ({ project }) => {
  const router = useRouter();
  const [firstPartLoaded, setFirstPartLoaded] = useState(false);
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

  const hasVideos = !!project.videos && project.videos.length > 0;

  const videoButton = hasVideos && (
    <button
      type="button"
      onClick={() => setVideoOpen(true)}
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 pl-3.5 pr-5 py-3 rounded-full bg-[#111827]/90 backdrop-blur-md border border-white/10 text-white text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <PlayCircle className="w-5 h-5 text-[#A7F176]" />
      <span>{project.videos!.length > 1 ? 'Watch Videos' : 'Watch Video'}</span>
    </button>
  );

  const videoLightbox = hasVideos && (
    <VideoLightbox videos={videoOpen ? project.videos! : null} exploreUrl={project.exploreUrl} onClose={() => setVideoOpen(false)} />
  );

  // Normalise both possible shapes into one ordered list of slices. A plain
  // single detailImage (legacy / static sample data) becomes a one-slice list,
  // so the exact same rendering path below handles it identically to today.
  const parts: DetailImagePart[] =
    project.detailImages && project.detailImages.length > 0
      ? project.detailImages
      : project.detailImage
      ? [{ url: project.detailImage, width: 1600, height: 1000 }]
      : [];

  if (parts.length > 0) {
    return (
      <div className="w-full bg-white leading-none overflow-hidden touch-pan-y min-h-[85vh] relative flex flex-col items-center">
        {/* Subtle loading spinner while the top of the image loads */}
        {!firstPartLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10 min-h-[85vh]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9FE66F] rounded-full animate-spin" />
          </div>
        )}

        {/*
          Slices are rendered edge-to-edge with zero gap so they read as one
          continuous image, exactly like a single detailImage always has:
            - every slice is `display:block` (an inline/inline-block image
              leaves a few px of baseline whitespace under it — block never does)
            - no margin/padding/border/gap anywhere in this stack
            - every slice spans the exact same 100% width, so there is no
              horizontal misalignment even if a slice's own pixel width differs
            - all slices start loading immediately on mount (only the first is
              `priority`, but none are deferred/lazy) — a lazily-loaded lower
              slice could still be blank when scrolled into view, which would
              look exactly like the gap this must never have
        */}
        {parts.map((part, i) => (
          <Image
            key={`${part.url}-${i}`}
            src={assetUrl(part.url)}
            alt={i === 0 ? project.title : ''}
            width={part.width}
            height={part.height}
            sizes="100vw"
            unoptimized
            quality={DETAIL_IMAGE_QUALITY}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={i === 0 ? () => setFirstPartLoaded(true) : undefined}
            className="pointer-events-none select-none"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxWidth: 'none',
              margin: 0,
              padding: 0,
              border: 0,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            {...(i === 0 ? { priority: true } : { loading: 'eager' as const })}
          />
        ))}

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
            unoptimized
            quality={88}
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
