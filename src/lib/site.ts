/** Canonical public origin, used for the sitemap and robots.txt. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecoralroom.co').replace(/\/+$/, '');

/**
 * The timezone the business (and its content team) works in. Dates printed on the public
 * site are formatted in it — the server itself runs in UTC, which would otherwise show a post
 * scheduled for 12:30 AM on the 20th as "Oct 19".
 */
export const SITE_TIME_ZONE = 'Asia/Karachi';
