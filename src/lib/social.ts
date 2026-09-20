export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'x' | 'tiktok' | 'other';

export interface SocialLinkItem {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export const SOCIAL_PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'other', label: 'Other (any website)' },
];

export function platformLabel(platform: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.key === platform)?.label ?? platform;
}

/** Shown until the database list loads (and if it can't be reached). Mirrors the seeded rows. */
export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: 'default-facebook', platform: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/people/The-Coral-Room/61574508644297/' },
  { id: 'default-instagram', platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/thecoral_room' },
  { id: 'default-linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/coral-room/' },
  { id: 'default-youtube', platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@TheCoralRoom' },
];

/**
 * Trims and validates a profile link. Adds https:// when the scheme is
 * missing and only ever returns an http(s) URL (never javascript:, data:, etc.),
 * since the value ends up in an href on every page.
 */
export function normalizeSocialUrl(input: string): string | null {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
