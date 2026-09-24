'use client';

import React, { useEffect, useState } from 'react';
import { X, PlayCircle, ArrowLeft, Film, ArrowUpRight } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';
import { safeExternalUrl } from '@/lib/externalUrl';

export interface VideoItem {
  url: string;
  title: string;
}

interface VideoLightboxProps {
  videos: VideoItem[] | null;
  onClose: () => void;
  detailsHref?: string;
  /**
   * The project's own website, set per project in the admin. When present (and a
   * safe http/https link) an "Explore Project" button is shown in the modal; when
   * empty nothing is rendered and the modal is exactly as it always was.
   */
  exploreUrl?: string | null;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ videos, onClose, exploreUrl }) => {
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

  const exploreHref = safeExternalUrl(exploreUrl);

  // A plain left-click opens the site in a new tab and closes the modal, so the
  // video does not keep playing (with sound) behind the tab the visitor just
  // left. Modified / middle clicks fall through to the browser's normal link
  // behaviour (open in background tab etc.) and leave the modal open.
  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.open(exploreHref!, '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Same anatomy as the site's green CTA pills (btn-hover-gradient + arrow-in-circle).
  const exploreButton = exploreHref ? (
    <a
      href={exploreHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleExploreClick}
      className="btn-hover-gradient group px-6 py-3 rounded-full bg-[#A7F176] text-[#111827] font-semibold text-sm inline-flex items-center justify-center gap-3 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <span>Explore Project</span>
      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-300">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </a>
  ) : null;

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
          </div>

          {/* Footer action bar — only present when the project has an Explore link. */}
          {exploreButton && (
            <div className="shrink-0 border-t border-gray-100 bg-white px-6 sm:px-9 py-4 flex justify-center">
              {exploreButton}
            </div>
          )}
        </div>
      ) : activeVideoId ? (
        <div className="relative w-full max-w-5xl z-10 flex flex-col items-center gap-4">
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
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
          {exploreButton}
        </div>
      ) : null}
    </div>
  );
};

export default VideoLightbox;

