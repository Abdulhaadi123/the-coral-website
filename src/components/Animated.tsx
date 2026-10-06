'use client';

import React, { useEffect, useRef } from 'react';

/*
 * Scroll-reveal helpers (client brief item 14 — PageSpeed).
 *
 * These used to be framer-motion components that rendered `opacity: 0` into the
 * server HTML, so every headline and paragraph stayed invisible until the
 * framer-motion bundle had downloaded, hydrated and fired — the main reason
 * Largest Contentful Paint sat at 5-9 s on mobile. They are now plain CSS
 * transitions (see `.fx-*` in globals.css) driven by one IntersectionObserver
 * each, and framer-motion is no longer shipped at all.
 *
 * Rules that keep the page fast and the animation intact:
 *  - The server HTML is fully visible. Nothing is hidden until the browser has
 *    hydrated, so the LCP element paints with the first frame.
 *  - After hydration, only content that is *below* the first screen is hidden
 *    and revealed as it scrolls into view — the same effect as before, where
 *    you could see it. Content already on screen is left alone.
 *  - Only opacity/transform animate, so the reveal never causes layout shift.
 *  - prefers-reduced-motion users get no motion (handled in the CSS).
 */

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  style?: React.CSSProperties;
}

const OFFSETS: Record<NonNullable<AnimationProps['direction']>, [number, number]> = {
  up: [0, 30],
  down: [0, -30],
  left: [30, 0],
  right: [-30, 0],
  none: [0, 0],
};

/*
 * Every reveal element registers here during hydration and one microtask handles
 * the whole batch: all position reads first, then all class writes. Doing a read
 * and a write per element instead forces a fresh layout for each one — on a long
 * page that was a 700 ms task on a throttled phone.
 */
interface Pending {
  el: HTMLElement;
  threshold: number;
  cancelled: boolean;
}

const observers = new Map<number, IntersectionObserver>();
const pending: Pending[] = [];
let flushQueued = false;

function observerFor(threshold: number) {
  let observer = observers.get(threshold);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.remove('fx-hidden');
          el.classList.add('fx-in');
          observer!.unobserve(el);
        }
      },
      { threshold }
    );
    observers.set(threshold, observer);
  }
  return observer;
}

function flushPending() {
  flushQueued = false;
  const batch = pending.splice(0).filter((p) => !p.cancelled && p.el.isConnected);
  const viewportHeight = window.innerHeight;

  // Read phase: one layout, however many elements there are.
  const belowFold = batch.filter((p) => p.el.getBoundingClientRect().top >= viewportHeight);

  // Write phase: hide only what is below the first screen, then watch it.
  for (const p of belowFold) p.el.classList.add('fx-hidden');
  for (const p of belowFold) observerFor(p.threshold).observe(p.el);
}

/** Hides `el` and reveals it when it scrolls into view — unless it is already on screen. */
function useReveal(ref: React.RefObject<HTMLElement>, threshold: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const entry: Pending = { el, threshold, cancelled: false };
    pending.push(entry);
    if (!flushQueued) {
      flushQueued = true;
      queueMicrotask(flushPending);
    }

    return () => {
      entry.cancelled = true;
      observers.get(threshold)?.unobserve(el);
    };
  }, [ref, threshold]);
}

export const FadeIn: React.FC<AnimationProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 0.1);
  const [x, y] = OFFSETS[direction] ?? OFFSETS.up;

  return (
    <div
      ref={ref}
      className={className}
      style={
        {
          ...style,
          '--fx-x': `${x}px`,
          '--fx-y': `${y}px`,
          '--fx-delay': `${delay}s`,
          '--fx-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export const ScaleIn: React.FC<AnimationProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 0.1);

  return (
    <div
      ref={ref}
      className={`fx-scale ${className}`}
      style={{ ...style, '--fx-delay': `${delay}s`, '--fx-duration': `${duration}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

/**
 * Reveals its direct children one after another once it scrolls into view.
 * Children are normally <StaggerItem>s, but any element works.
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.08 }) => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 0.05);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--fx-delay', `${i * staggerDelay}s`);
    });
  }, [staggerDelay, children]);

  return (
    <div ref={ref} className={`fx-stagger ${className}`}>
      {children}
    </div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`fx-item ${className}`}>{children}</div>;
};
