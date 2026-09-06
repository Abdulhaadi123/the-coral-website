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
 * Cache buster. The S3 object is served `public, max-age=31536000, immutable`, so
 * overwriting the key does not reach anyone whose browser already holds the old
 * cut — they would keep it for a year. Bumping this changes the URL and forces a
 * refetch. S3 ignores the unknown query param and there is no CDN in front of it,
 * so nothing else has to be invalidated.
 *
 * Bump on every re-encode of the video.
 *   v2 = 22.4s, 0.8x motion-interpolated, 11.6MB
 */
const ASSET_VERSION = '2';

/** How often to check that the loop is still running, in ms. */
const WATCHDOG_MS = 2000;

export const ShowcaseSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
            src={`${assetUrl('/WEBSITE VIDEO.mp4')}?v=${ASSET_VERSION}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center block"
          />
        </div>
      </FadeIn>
    </section>
  );
};

export default ShowcaseSection;
