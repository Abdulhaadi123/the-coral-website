'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { getYouTubeId } from '@/lib/youtube';

interface VideoLightboxProps {
  videoUrl: string | null;
  onClose: () => void;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ videoUrl, onClose }) => {
  const videoId = videoUrl ? getYouTubeId(videoUrl) : null;

  useEffect(() => {
    if (!videoId) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Project video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
