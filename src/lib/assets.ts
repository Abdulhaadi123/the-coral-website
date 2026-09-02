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
 */

const RAW_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || '';

/** Base URL with any trailing slash stripped. Empty string = serve locally. */
export const ASSET_BASE_URL = RAW_BASE.replace(/\/+$/, '');

/** True when assets are being served from S3/CloudFront rather than /public. */
export const usingRemoteAssets = ASSET_BASE_URL.length > 0;

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

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return path;
  }

  if (!usingRemoteAssets) return path;

  const normalised = value.startsWith('/') ? value : `/${value}`;
  return `${ASSET_BASE_URL}${encodePath(normalised)}` as T;
}

export default assetUrl;
