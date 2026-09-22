/** @type {import('next').NextConfig} */

// Allow next/image to load from whatever host NEXT_PUBLIC_ASSET_BASE_URL points at
// (CloudFront distribution or the S3 bucket endpoint itself).
const assetHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_ASSET_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_ASSET_BASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Next resizes to the actual rendered dimensions and negotiates
    // AVIF/WebP per-browser — real quality is unchanged, only the wasted
    // (invisible) resolution and bytes are dropped.
    formats: ['image/avif', 'image/webp'],
    // Every uploaded image is already served by S3/CloudFront with
    // `Cache-Control: public, max-age=31536000, immutable` (see src/lib/s3.ts),
    // and filenames get a random suffix on every upload, so a cached copy is
    // never stale. Set this explicitly (1 year) so Next's own optimizer cache
    // can't silently fall back to its 60s default if the origin header is ever
    // relaxed — this is the setting that makes a portfolio image load exactly
    // once per browser, full stop.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Any S3 bucket endpoint, virtual-hosted style
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
      // Any CloudFront distribution
      { protocol: 'https', hostname: '*.cloudfront.net' },
      ...(assetHost ? [{ protocol: 'https', hostname: assetHost }] : []),
    ],
  },
};

module.exports = nextConfig;
