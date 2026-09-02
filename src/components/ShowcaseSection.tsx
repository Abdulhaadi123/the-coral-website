'use client';

import React, { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';

/**
 * Source is 30.000fps constant (verified by parsing the mp4 moov atom).
 *
 * Keep this at a value where 30 * RATE divides the display refresh evenly, or the
 * frames are held for uneven durations and the result visibly judders:
 *
 *   1.0  -> 30fps -> exactly 2 refreshes per frame on 60Hz   (smooth)
 *   0.75 -> 22.5  -> 2.67 refreshes                          (JUDDERS)
 *   0.5  -> 15    -> exactly 4 refreshes                     (even, but steppy)
 *
 * Slowing this footage down smoothly is not possible from the player — it needs a
 * re-encode that interpolates real intermediate frames.
 */
const PLAYBACK_RATE = 1;

export const ShowcaseSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // playbackRate resets whenever a new source loads, so reapply on metadata.
    const applyRate = () => {
      video.playbackRate = PLAYBACK_RATE;
    };

    // Only nudge playback when the tab comes back into view. Deliberately NOT
    // listening for 'pause': the browser also pauses briefly while buffering, and
    // calling play() into a stall makes the hitching worse rather than better.
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      applyRate();
      if (video.paused) video.play().catch(() => {});
    };

    applyRate();
    video.addEventListener('loadedmetadata', applyRate);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      video.removeEventListener('loadedmetadata', applyRate);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section className="w-full my-6 overflow-hidden">
      <FadeIn direction="up">
        <div className="relative w-full aspect-[1643/294] overflow-hidden">
          <video
            ref={videoRef}
            src={assetUrl('/WEBSITE VIDEO.mp4')}
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
