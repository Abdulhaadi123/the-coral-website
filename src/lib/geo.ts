import { headers } from 'next/headers';
import { getCurrentAdmin } from '@/lib/access';

// Vercel sets `x-vercel-ip-country` on every request (clients can't spoof it
// there); `cf-ipcountry` covers Cloudflare in front of another host. Neither
// exists on the current self-hosted Ubuntu/nginx box, so `geoip-lite` — an
// offline, bundled IP-to-country database, no external API call — is the last
// resort, looking up the real visitor IP nginx forwards via
// X-Real-IP/X-Forwarded-For (see deploy/nginx-thecoralroom.conf). Less
// precise than a platform header, but good enough for a coarse country gate,
// and it keeps working unchanged if this site is ever back behind
// Vercel/Cloudflare (those headers are always checked first).
export const ALLOWED_COUNTRY = 'PK';

/** The real visitor IP: nginx's forwarded headers, falling back to X-Forwarded-For's first hop. */
function clientIp(h: Headers): string | null {
  const real = h.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return null;
}

/**
 * A previous attempt at this (commit 501bd23, reverted in e8dccd2) crashed
 * every admin API route with a 500 on Vercel: `import geoip from 'geoip-lite'`
 * runs the package's own module-init code immediately, which reads its
 * bundled .dat files from disk — and Vercel's serverless file-tracing didn't
 * include them, so the import itself threw before any try/catch around the
 * *lookup call* could help. Loading it lazily, on first use, inside its own
 * try/catch, means a missing/broken data file on any given platform disables
 * this fallback for that process instead of crashing every request that
 * touches the portfolio.
 */
let geoipLoadAttempted = false;
let geoipModule: typeof import('geoip-lite') | null = null;

function loadGeoip(): typeof import('geoip-lite') | null {
  if (!geoipLoadAttempted) {
    geoipLoadAttempted = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      geoipModule = require('geoip-lite');
    } catch (err) {
      console.error('geoip-lite failed to load — IP-based country lookup disabled for this process:', err);
      geoipModule = null;
    }
  }
  return geoipModule;
}

export function visitorCountry(): string | null {
  const h = headers();

  const platform = h.get('x-vercel-ip-country') || h.get('cf-ipcountry');
  if (platform) return platform.trim().toUpperCase();

  const ip = clientIp(h);
  if (!ip) return null;

  const geoip = loadGeoip();
  if (!geoip) return null;

  try {
    const result = geoip.lookup(ip);
    return result?.country ? result.country.toUpperCase() : null;
  } catch (err) {
    // Malformed/unlookupable IP — treat as unknown, same as no header at all.
    console.error('geoip-lite lookup failed for IP', ip, err);
    return null;
  }
}

/**
 * True only when we positively know the visitor is outside Pakistan. An
 * unknown country (no geo header, no resolvable IP, e.g. local development)
 * is let through so a missing signal can never lock out people in Pakistan.
 */
export function isOutsideAllowedCountry(): boolean {
  const country = visitorCountry();
  return !!country && country !== ALLOWED_COUNTRY;
}

/**
 * Whether Pakistan-only projects must be hidden from the current request:
 * the visitor is outside Pakistan and isn't a signed-in admin (admins always
 * see everything so they can manage those projects from anywhere).
 */
export async function shouldHidePakistanOnly(): Promise<boolean> {
  if (!isOutsideAllowedCountry()) return false;
  return !(await getCurrentAdmin());
}
