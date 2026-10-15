'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

/**
 * The file is 30.000fps constant (verified by parsing the mp4 moov atom), and the
 * slow pace is encoded into it rather than applied here.
 *
 * Leave this at 1. Anything else re-times the existing frames, and unless
 * 30 * RATE divides the display refresh evenly the frames are held for uneven
 * durations and the result visibly judders:
 *
 *   1.0  -> 30fps -> exactly 2 refreshes per frame on 60Hz   (smooth)
 *   0.75 -> 22.5  -> 2.67 refreshes                          (JUDDERS)
 *   0.5  -> 15    -> exactly 4 refreshes                     (even, but steppy)
 *
 * To change the pace, re-encode with motion interpolation so real intermediate
 * frames exist, and keep the output at 30fps:
 *
 *   ffmpeg -i in.mp4 \
 *     -vf "minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:me_mode=bidir:fps=37.5',setpts=1.25*PTS" \
 *     -r 30 -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart -an out.mp4
 *
 * fps=30/SPEED and setpts=(1/SPEED)*PTS. The 37.5 / 1.25 above is 0.8x.
 */
const PLAYBACK_RATE = 1;

/**
 * The built-in banner (client brief item 14, PageSpeed). The original cut
 * (S3 /WEBSITE.mp4, v3) is 3826x300 and 12 MB, but the banner only ever shows its
 * centre (object-cover in a 1643:294 box), so it was cropped to exactly that
 * region — identical on screen — and re-encoded:
 *
 *   desktop  1678x300  ~3.0 MB
 *   phone     840x150  ~1.0 MB
 *
 *   ffmpeg -i WEBSITE.mp4 -vf "crop=1678:300:1074:0[,scale=840:150]" -an \
 *     -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart out.mp4
 *
 * They live in /public/videos with a version in the name; next.config.js serves that
 * folder with a one-year immutable cache, so bump the "-v1" if the cut ever changes.
 */
const DESKTOP_SRC = '/videos/showcase-desktop-v1.mp4';
const MOBILE_SRC = '/videos/showcase-mobile-v1.mp4';
const POSTER_SRC = '/videos/showcase-poster-v1.webp';

/** How often to check that the loop is still running, in ms. */
const WATCHDOG_MS = 2000;

interface ShowcaseSectionProps {
  /**
   * Admin-uploaded replacement for the built-in video below (Settings row
   * "homepage_banner_video", set from /admin/homepage — see src/lib/publicData.ts).
   * Null/undefined when no override is set, which plays the default instead.
   * Uploaded videos already get a unique S3 key per upload, so — unlike the
   * built-in asset — they never need a cache-busting `?v=`.
   */
  videoUrl?: string | null;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ videoUrl }) => {
  // An uploaded video that cannot be played (file deleted, unsupported format, URL blocked)
  // falls back to the built-in banner instead of leaving an empty black strip on the homepage.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const activeUrl = videoUrl && videoUrl !== failedUrl ? videoUrl : null;

  // Keyed by the video in use, so switching videos starts from a clean slate (fresh <video>,
  // fresh "ready" state) rather than carrying anything over from the previous one.
  return (
    <ShowcaseVideo
      key={activeUrl ?? 'default'}
      videoUrl={activeUrl}
      onSourceError={() => setFailedUrl(activeUrl)}
    />
  );
};

interface ShowcaseVideoProps {
  videoUrl: string | null;
  onSourceError: () => void;
}

const ShowcaseVideo: React.FC<ShowcaseVideoProps> = ({ videoUrl, onSourceError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  /*
   * The built-in banner shows its poster frame until the video arrives. An uploaded video has
   * no poster — showing the built-in one would flash the previous banner before the new video —
   * so it stays hidden (black strip) until it can play, then fades in.
   */
  const hasOverride = videoUrl !== null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    let cancelled = false;
    const attach = () => {
      if (cancelled) return;
      const phone = window.matchMedia('(max-width: 767px)').matches;
      const src = videoUrl ? assetUrl(videoUrl) : phone ? MOBILE_SRC : DESKTOP_SRC;
      if (video.getAttribute('src') !== src) {
        video.src = src;
        video.load();
      }
    };

    // An uploaded video is the page's content, so it starts loading as soon as the page is
    // interactive. The built-in one waits until the page has loaded and the browser is idle:
    // it used to compete with the text, images and scripts that decide Largest Contentful Paint.
    if (videoUrl) {
      attach();
      return () => {
        cancelled = true;
      };
    }

    const schedule = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      if (idle) idle(attach, { timeout: 2000 });
      else window.setTimeout(attach, 800);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
    };
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let disposed = false;

    /*
     * play() rejects if it is called while another play() is still settling, and
     * an unhandled rejection in that case is noise rather than signal. Guarding on
     * a flag also stops a burst of events (pause + stalled + waiting all firing
     * together) from queueing several overlapping calls.
     */
    let resuming = false;

    const resume = () => {
      if (disposed || resuming) return;
      // playbackRate resets on every fresh load, so reassert it alongside play.
      video.playbackRate = PLAYBACK_RATE;
      if (!video.paused) return;

      resuming = true;
      const attempt = video.play();
      if (attempt && typeof attempt.then === 'function') {
        attempt.catch(() => {}).finally(() => {
          resuming = false;
        });
      } else {
        resuming = false;
      }
    };

    /*
     * Belt and braces on top of the `loop` attribute: some browsers fire `ended`
     * without wrapping when the file is served with a partial range response.
     */
    const onEnded = () => {
      if (disposed) return;
      try {
        video.currentTime = 0;
      } catch {
        /* seeking before metadata is ready throws; the watchdog picks it up */
      }
      resume();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resume();
    };

    /*
     * Every event that can leave the element stopped. `pause` is included on
     * purpose — a pause here means genuinely stopped, not stalled: the files are small
     * (3 MB / 1 MB) and fully buffered well before the section scrolls into view.
     */
    const EVENTS = ['loadedmetadata', 'canplay', 'pause', 'stalled', 'suspend', 'waiting'] as const;
    EVENTS.forEach((type) => video.addEventListener(type, resume));
    video.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', onVisibility);

    /*
     * Last line of defence. Power saving, tab discarding and mobile browsers
     * pausing offscreen media can all stop playback without firing anything we
     * listen for, so poll as well. Cheap: one boolean read per tick.
     */
    const watchdog = window.setInterval(resume, WATCHDOG_MS);

    resume();

    return () => {
      disposed = true;
      window.clearInterval(watchdog);
      EVENTS.forEach((type) => video.removeEventListener(type, resume));
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section className="w-full my-6 overflow-hidden">
      <FadeIn direction="up">
        <div className={`relative w-full aspect-[1643/294] overflow-hidden${hasOverride ? ' bg-black' : ''}`}>
          <video
            ref={videoRef}
            poster={hasOverride ? undefined : POSTER_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload={hasOverride ? 'auto' : 'none'}
            onLoadedData={hasOverride ? () => setIsReady(true) : undefined}
            onPlaying={hasOverride ? () => setIsReady(true) : undefined}
            onError={hasOverride ? onSourceError : undefined}
            className={`w-full h-full object-cover object-center block${
              hasOverride ? ` transition-opacity duration-700 ease-out ${isReady ? 'opacity-100' : 'opacity-0'}` : ''
            }`}
          />
        </div>
      </FadeIn>
    </section>
  );
};

export default ShowcaseSection;
