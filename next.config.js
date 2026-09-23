/** @type {import('next').NextConfig} */

// Allow next/image to load from whatever hosts the asset env vars point at: the
// S3 origin (NEXT_PUBLIC_ASSET_BASE_URL) and the optional CDN in front of it
// (NEXT_PUBLIC_CDN_BASE_URL — a *.cloudfront.net domain or a custom one).
const hostOf = (value) => {
  try {
    return value ? new URL(value).hostname : null;
  } catch {
    return null;
  }
};
const assetHost = hostOf(process.env.NEXT_PUBLIC_ASSET_BASE_URL);
const cdnHost = hostOf(process.env.NEXT_PUBLIC_CDN_BASE_URL);

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
      ...(cdnHost && cdnHost !== assetHost ? [{ protocol: 'https', hostname: cdnHost }] : []),
    ],
  },
};

module.exports = nextConfig;
