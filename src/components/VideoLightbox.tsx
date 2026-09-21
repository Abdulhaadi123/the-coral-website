'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, PlayCircle, ArrowLeft, Film, ArrowUpRight } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

export interface VideoItem {
  url: string;
  title: string;
}

interface VideoLightboxProps {
  videos: VideoItem[] | null;
  onClose: () => void;
  /** When set, the modal offers a way through to the project's detail page. */
  detailsHref?: string;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ videos, onClose, detailsHref }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasVideos = !!videos && videos.length > 0;

  // Reset to the right starting view whenever the gallery (re)opens: a
  // single video plays immediately, multiple videos start on the picker.
  useEffect(() => {
    if (hasVideos) {
      setActiveIndex(videos!.length === 1 ? 0 : null);
    }
  }, [videos, hasVideos]);

  useEffect(() => {
    if (!hasVideos) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (activeIndex !== null && videos!.length > 1) {
        setActiveIndex(null);
      } else {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasVideos, activeIndex, videos, onClose]);

  if (!hasVideos) return null;

  const showingPicker = activeIndex === null;
  const activeVideo = activeIndex !== null ? videos![activeIndex] : null;
  const activeVideoId = activeVideo ? getYouTubeId(activeVideo.url) : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-[#0A0E1A]/90 backdrop-blur-md" />

      {/* Back to list — only when there's a list to go back to */}
      {!showingPicker && videos!.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
          aria-label="Back to video list"
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-10 inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All videos</span>
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
          showingPicker ? 'bg-black/5 hover:bg-black/10 text-[#111827]' : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <X className="w-5 h-5" />
      </button>

      {showingPicker ? (
        <div
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl z-10 border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Accent Gradient Bar — matches the site's signature gradient */}
          <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#78B249] via-[#9FE66F] to-[#00C0E8]" />

          <div className="overflow-y-auto px-6 sm:px-9 pt-7 sm:pt-9 pb-8 sm:pb-9">
            {/* Eyebrow badge — same pattern as the portfolio access gate */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78B249]/15 text-[#305c14] border border-[#78B249]/30 text-[11px] font-bold uppercase tracking-wider mb-4">
              <Film className="w-3 h-3 text-[#467923]" />
              <span>Project Showcase</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
              {videos!.length} {videos!.length === 1 ? 'Video' : 'Videos'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 mb-6">
              Select a video below to play it right here.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {videos!.map((video, i) => {
                const thumb = getYouTubeThumbnail(video.url);
                return (
                  <button
                    key={`${video.url}-${i}`}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className="group text-left cursor-pointer rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-[52px] h-[52px] rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <PlayCircle className="w-7 h-7 text-white" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3.5">
                      <span className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug group-hover:text-[#305c14] transition-colors">
                        {video.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {detailsHref && (
              <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center">
                <Link
                  href={detailsHref}
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111827] text-white text-sm font-semibold hover:bg-[#1f2937] transition-colors"
                >
                  <span>View project details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : activeVideoId ? (
        <>
          <div
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title={activeVideo?.title || 'Project video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {detailsHref && (
            <Link
              href={detailsHref}
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-colors whitespace-nowrap"
            >
              <span>View project details</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </>
      ) : null}
    </div>
  );
};

export default VideoLightbox;
