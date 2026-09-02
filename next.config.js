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
    unoptimized: true,
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
