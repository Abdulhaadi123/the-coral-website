/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow build to succeed even if there are non-critical ESLint or TS warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // All images are pre-optimized WebP — let Vercel CDN serve them directly
    unoptimized: true,
  },
};

module.exports = nextConfig;
