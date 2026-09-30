import { NextRequest, NextResponse } from 'next/server';
import { checkSignedIn } from '@/lib/access';

// Streams a stored image to the admin panel, bypassing the public hotlink guard
// (see src/lib/adminAssets.ts for why). Never cached/prerendered — it's a live proxy.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Patterns this proxy is willing to fetch — never an arbitrary caller-supplied host,
// so this can't be turned into an open proxy/SSRF tool. Mirrors next.config.js's
// images.remotePatterns: whichever of NEXT_PUBLIC_ASSET_BASE_URL / NEXT_PUBLIC_CDN_BASE_URL
// is configured (raw S3 in one environment, a CloudFront domain in another — see
// src/lib/assets.ts) plus the underlying S3 host directly, because a record's stored
// `url` is always the S3-origin address even when the env is set to serve it via a CDN.
const STATIC_ALLOWED_HOST_PATTERNS = [/(^|\.)s3\.amazonaws\.com$/i, /(^|\.)s3[.-][a-z0-9-]+\.amazonaws\.com$/i, /(^|\.)cloudfront\.net$/i];

function configuredHosts(): string[] {
  return [process.env.NEXT_PUBLIC_ASSET_BASE_URL, process.env.NEXT_PUBLIC_CDN_BASE_URL]
    .filter((v): v is string => !!v)
    .map((v) => {
      try {
        return new URL(v).host;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
}

function isAllowedHost(host: string): boolean {
  if (configuredHosts().includes(host)) return true;
  return STATIC_ALLOWED_HOST_PATTERNS.some((re) => re.test(host));
}

export async function GET(req: NextRequest) {
  const denied = await checkSignedIn();
  if (denied) return denied;

  const raw = req.nextUrl.searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (target.protocol !== 'https:' || !isAllowedHost(target.host)) {
    return NextResponse.json({ error: 'That host is not an allowed asset source' }, { status: 400 });
  }

  let upstream: Response;
  try {
    // The CloudFront Function guard (deploy/cloudfront-portfolio-image-guard.js) lets a
    // request through either when its Referer is our own site, or when it comes from the
    // EC2 server's specific Elastic IP. Relying on the IP path here is fragile — it only
    // works from that one production box, and silently 403s from local dev or if that IP
    // is ever reassigned. Sending our own site as the Referer instead works everywhere
    // this route runs, matching what any real browser tab open on /admin already sends.
    upstream = await fetch(target.toString(), { headers: { Referer: 'https://www.thecoralroom.co/' } });
  } catch {
    return NextResponse.json({ error: 'Could not reach the asset host' }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Image not found' }, { status: upstream.status || 404 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
      // Short-lived and private: only ever requested by a signed-in admin's own
      // browser, never cached by a shared/public cache.
      'Cache-Control': 'private, max-age=300',
    },
  });
}
