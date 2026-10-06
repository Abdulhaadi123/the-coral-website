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
  experimental: {
    // geoip-lite reads its bundled .dat files from disk via `__dirname`;
    // letting webpack bundle/rewrite it (the default) breaks that path
    // resolution during the build's page-data-collection step. Keeping it as
    // a real `require()` resolved from node_modules at runtime fixes it.
    serverComponentsExternalPackages: ['geoip-lite'],
    // src/instrumentation.ts (starts the email-campaign scheduler on boot)
    // needs this on Next 14.x — it's stable with no flag from Next 15 on.
    instrumentationHook: true,
  },
  // Long browser caching for static files served from /public (PageSpeed: "efficient
  // cache lifetimes"). Next serves /public with max-age=0 by default, so every visit
  // revalidated every logo and banner. These files are cached for a year, the same as
  // the optimised copies next/image makes of them (images.minimumCacheTTL below), so
  // a file in public/ that is replaced must be given a NEW NAME — the video files
  // already follow this (showcase-desktop-v1.mp4).
  async headers() {
    // Production only, so replacing a file while developing still shows up on refresh.
    if (process.env.NODE_ENV !== 'production') return [];
    const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
    return [
      { source: '/videos/:path*', headers: immutable },
      { source: '/images/:path*', headers: immutable },
      { source: '/process-depth.webp', headers: immutable },
    ];
  },
  images: {
    // `next dev` only: the browser loads images straight from the CDN instead
    // of through the local resizer. The CDN serves portfolio images only to our
    // own pages (deploy/cloudfront-portfolio-image-guard.js), and the resizer
    // fetches without a Referer from a laptop's IP, so it would be refused.
    // Production keeps resizing as below.
    unoptimized: process.env.NODE_ENV === 'development',
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
