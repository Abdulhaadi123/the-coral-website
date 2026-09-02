'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollProgressOptions {
  /**
   * How progress is derived from the element's position.
   *
   * 'pinned'  — the element is a tall spacer containing a `sticky` child
   *             (How It Works). Progress runs 0 → 1 across the scrollable
   *             remainder, i.e. the whole time the sticky child is parked.
   * 'through' — the element sits in normal flow (Beyond the Code). Progress
   *             runs 0 → 1 as it travels up through the viewport.
   */
  mode?: 'pinned' | 'through';
  /** Number of sequential items that light up. Omit if nothing activates. */
  itemCount?: number;
  /**
   * Easing factor, 0–1. The DOM value chases the raw scroll value by this
   * fraction each frame: lower trails further and feels smoother, higher
   * tracks the scroll more tightly. 0.12 is a good middle.
   */
  ease?: number;
  /** Progress at which the final item activates. */
  activateBy?: number;
  /**
   * Called every frame with the eased progress. Write to the DOM here —
   * this deliberately runs outside React so scrolling causes no re-render.
   */
  onFrame?: (progress: number) => void;
}

/**
 * Drives a scroll-linked animation with a requestAnimationFrame loop.
 *
 * The scroll listener only records a target value; a rAF loop eases toward it
 * and hands the result to `onFrame` for imperative DOM writes. The only React
 * state is the active item index, which changes a handful of times, so
 * scrolling never re-renders the component.
 *
 * Returns the active item index (always 0 when `itemCount` is omitted).
 */
export function useScrollProgress(
  wrapperRef: RefObject<HTMLElement>,
  {
    mode = 'through',
    itemCount = 0,
    ease = 0.12,
    activateBy = 0.85,
    onFrame,
  }: ScrollProgressOptions = {}
): number {
  const [activeIndex, setActiveIndex] = useState(0);

  // Kept in a ref so changing the callback identity never restarts the loop.
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    let frame = 0;
    let target = 0;
    let current = 0;
    let lastActive = -1;
    let running = true;

    const readTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (mode === 'pinned') {
        const scrollable = el.offsetHeight - vh;
        target = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
        return;
      }

      // 'through': begins filling once the top is 80% down the viewport and
      // completes shortly after the bottom clears it.
      const distance = rect.height + vh * 0.3;
      const travelled = vh * 0.8 - rect.top;
      target = distance > 0 ? Math.min(1, Math.max(0, travelled / distance)) : 0;
    };

    const tick = () => {
      if (!running) return;

      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.0005) current = target;

      onFrameRef.current?.(current);

      if (itemCount > 1) {
        let next = 0;
        for (let i = itemCount - 1; i >= 0; i -= 1) {
          if (current >= (i / (itemCount - 1)) * activateBy) {
            next = i;
            break;
          }
        }
        if (next !== lastActive) {
          lastActive = next;
          setActiveIndex(next);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    readTarget();
    current = target; // start settled so nothing animates in on load
    frame = requestAnimationFrame(tick);

    window.addEventListener('scroll', readTarget, { passive: true });
    window.addEventListener('resize', readTarget);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', readTarget);
      window.removeEventListener('resize', readTarget);
    };
  }, [wrapperRef, mode, itemCount, ease, activateBy]);

  return activeIndex;
}

export default useScrollProgress;
