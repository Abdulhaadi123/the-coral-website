import { headers } from 'next/headers';
import geoip from 'geoip-lite';
import { getCurrentAdmin } from '@/lib/access';

// Vercel sets `x-vercel-ip-country` on every request (clients can't spoof it
// there); `cf-ipcountry` covers Cloudflare in front of another host. Neither
// exists on a plain self-hosted box, so `geoip-lite` — an offline, bundled
// IP-to-country database, no external API call — is the last resort, looking
// up the real visitor IP that nginx forwards via X-Real-IP/X-Forwarded-For
// (see deploy/nginx-thecoralroom.conf). Less precise than a platform header,
// but good enough for a coarse country gate.
export const ALLOWED_COUNTRY = 'PK';

/** The real visitor IP: nginx's forwarded headers, falling back to X-Forwarded-For's first hop. */
function clientIp(h: Headers): string | null {
  const real = h.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return null;
}

export function visitorCountry(): string | null {
  const h = headers();

  const platform = h.get('x-vercel-ip-country') || h.get('cf-ipcountry');
  if (platform) return platform.trim().toUpperCase();

  const ip = clientIp(h);
  if (!ip) return null;
  try {
    const result = geoip.lookup(ip);
    return result?.country ? result.country.toUpperCase() : null;
  } catch {
    // Malformed/unlookupable IP — treat as unknown, same as no header at all.
    return null;
  }
}

/**
 * True only when we positively know the visitor is outside Pakistan. An
 * unknown country (no geo header, e.g. local development) is let through so a
 * missing header can never lock out people in Pakistan.
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
