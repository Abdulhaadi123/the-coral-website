'use client';

import React, { useState, useEffect } from 'react';

interface ProjectDetailViewerProps {
  project: {
    title: string;
    image?: string | null;
    detailImage?: string | null;
  };
}

export const ProjectDetailViewer: React.FC<ProjectDetailViewerProps> = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  if (project.detailImage) {
    return (
      <div className="w-full bg-white leading-none overflow-hidden touch-pan-y min-h-[85vh] relative flex flex-col items-center">
        {/* Subtle loading spinner while heavy image loads */}
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
    );
  }

  if (project.image) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 text-center text-gray-400">
      No showcase image available for this project.
    </div>
  );
};
