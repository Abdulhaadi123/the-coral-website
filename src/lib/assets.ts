/**
 * Central asset resolver.
 *
 * All heavy media (portfolio images, featured cards, homepage videos) is served
 * from an AWS S3 bucket — optionally fronted by CloudFront. Set:
 *
 *   NEXT_PUBLIC_ASSET_BASE_URL="https://d1234abcd.cloudfront.net"
 *   (or "https://<bucket>.s3.<region>.amazonaws.com")
 *
 * The value may include a path prefix, e.g. "https://cdn.example.com/coral".
 *
 * When the variable is unset the helper falls back to the local /public path,
 * so `next dev` keeps working with no AWS credentials configured.
 *
 * CDN (optional). Uploaded images are stored in the database as absolute URLs
 * on the S3 origin above, so switching to a CDN must not depend on rewriting
 * data. Instead set:
 *
 *   NEXT_PUBLIC_CDN_BASE_URL="https://d1234abcd.cloudfront.net"
 *
 * — a CloudFront distribution whose origin is the S3 bucket with the same
 * origin path as NEXT_PUBLIC_ASSET_BASE_URL (e.g. "/web"). Any URL that starts
 * with the S3 origin is then served from the CDN at render time. Unset it and
 * everything goes straight back to S3: nothing in the database changes either way.
 */

const RAW_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || '';
const RAW_CDN = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

/** Base URL with any trailing slash stripped. Empty string = serve locally. */
export const ASSET_BASE_URL = RAW_BASE.replace(/\/+$/, '');

/** CDN base URL (no trailing slash), or '' when no CDN is configured. */
export const CDN_BASE_URL = RAW_CDN.replace(/\/+$/, '');

/** True when assets are being served from S3/CloudFront rather than /public. */
export const usingRemoteAssets = ASSET_BASE_URL.length > 0;

/** Where public asset URLs should actually point: the CDN when there is one, else the S3 origin. */
const PUBLIC_BASE_URL = CDN_BASE_URL || ASSET_BASE_URL;

function parseBase(): { origin: string; path: string } {
  try {
    const u = new URL(ASSET_BASE_URL);
    return { origin: u.origin, path: u.pathname.replace(/\/+$/, '') };
  } catch {
    return { origin: '', path: '' };
  }
}
const BASE = ASSET_BASE_URL ? parseBase() : { origin: '', path: '' };

/** A direct bucket link: https://<bucket>.s3.<region>.amazonaws.com/<path> */
const S3_DIRECT_URL = /^https:\/\/[a-z0-9.-]+\.s3[.-][a-z0-9-]+\.amazonaws\.com(\/.*)$/i;

/**
 * Serve stored URLs through the public asset host, leaving every other URL untouched.
 *  - Direct bucket links are private (only the CDN may read the bucket), so they 403 in a
 *    browser; the same path on the asset host works. A few older rows (testimonial company
 *    logos) were saved that way.
 *  - With a separate CDN configured, the S3-origin prefix is swapped for the CDN's.
 * Exported for components that render stored absolute URLs without going through assetUrl().
 */
export function viaCdn(url: string): string {
  const direct = S3_DIRECT_URL.exec(url);
  if (direct && BASE.origin && BASE.path && direct[1].startsWith(`${BASE.path}/`)) {
    return BASE.origin + direct[1];
  }
  if (!CDN_BASE_URL || !ASSET_BASE_URL) return url;
  return url.startsWith(`${ASSET_BASE_URL}/`) ? CDN_BASE_URL + url.slice(ASSET_BASE_URL.length) : url;
}

/**
 * Percent-encode each path segment so keys containing spaces or parentheses
 * ("Rectangle 504 (16).webp") resolve correctly as S3 object keys.
 */
function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/**
 * Resolve a public-relative path ("/images/portfolio/x.webp") to its final URL.
 *
 * - Already-absolute URLs (Cloudinary, S3, data: URIs) are returned untouched,
 *   so database-backed records keep working.
 * - Falsy input is returned as-is so `string | null` fields stay nullable.
 */
export function assetUrl<T extends string | null | undefined>(path: T): T {
  if (!path) return path;

  const value = path as string;

  if (/^(https?:)?\/\//i.test(value)) {
    return viaCdn(value) as T;
  }

  if (value.startsWith('data:') || value.startsWith('blob:')) {
    return path;
  }

  if (!usingRemoteAssets) return path;

  const normalised = value.startsWith('/') ? value : `/${value}`;
  return `${PUBLIC_BASE_URL}${encodePath(normalised)}` as T;
}

export default assetUrl;
