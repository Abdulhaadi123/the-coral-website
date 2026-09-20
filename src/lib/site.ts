/** Canonical public origin, used for the sitemap and robots.txt. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecoralroom.co').replace(/\/+$/, '');
