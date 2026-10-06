'use client';

import React, { useEffect, useRef } from 'react';
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
 *   ffmpeg -i WEBSITE.mp4 -vf "crop=1678:300:1074:0[,scale=840:150]" -an  *     -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart out.mp4
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
  const videoRef = useRef<HTMLVideoElement>(null);

  /*
   * The video is attached only after the page has finished loading (and the browser is
   * idle), never during it: it used to be fetched immediately and its 12 MB competed
   * with the text, images and scripts that decide Largest Contentful Paint. Until it
   * arrives the strip shows the poster frame. Visitors with Data Saver on keep the
   * poster and never download the video.
   */
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
    const schedule = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
      if (idle) idle(attach, { timeout: 3000 });
      else window.setTimeout(attach, 1200);
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
     * purpose — the earlier version left it out because calling play() into a
     * buffering stall made hitching worse, but that was with a 44.7MB/19.9Mbps
     * file. It is 12.2MB/4.3Mbps now and fully buffered well before the section
     * scrolls into view, so a pause here means genuinely stopped, not stalled.
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
        <div className="relative w-full aspect-[1643/294] overflow-hidden">
          <video
            ref={videoRef}
            poster={POSTER_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover object-center block"
          />
        </div>
      </FadeIn>
    </section>
  );
};

export default ShowcaseSection;
