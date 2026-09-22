'use client';

/**
 * Client-side cache for the public portfolio project list.
 *
 * The images themselves are already cached correctly at the HTTP layer — S3
 * serves them `public, max-age=31536000, immutable`, so once a browser has an
 * image it never re-downloads it. What actually made /portfolio feel like it
 * "reloaded" on every visit was the DATA: the page always started from an
 * empty list and re-fetched /api/admin/projects on every mount, showing a full
 * loading spinner before the (already-cached) images could even be painted.
 *
 * This gives the page a stale-while-revalidate cache: the last-seen project
 * list is kept for the tab session (sessionStorage, so it survives a reload of
 * the tab but not a brand new one) and an in-memory copy for instant reads
 * during the same page load. A revisit renders immediately from this cache
 * while a fresh copy is fetched quietly in the background.
 */

const STORAGE_KEY = 'coral_portfolio_projects_v1';

// Survives client-side route changes within the current page load without
// touching sessionStorage on every read.
let memoryCache: unknown[] | null = null;

export function readCachedProjects<T = unknown>(): T[] | null {
  if (memoryCache) return memoryCache as T[];
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    memoryCache = parsed;
    return parsed as T[];
  } catch {
    // Corrupt entry or storage unavailable (private browsing) — just refetch.
    return null;
  }
}

export function writeCachedProjects<T>(projects: T[]): void {
  memoryCache = projects as unknown[];
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Quota exceeded or blocked — the in-memory copy above still helps for
    // the rest of this page load, we just won't survive a reload.
  }
}
