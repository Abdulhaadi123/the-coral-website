import { headers } from 'next/headers';
import { getCurrentAdmin } from '@/lib/access';

// Vercel sets `x-vercel-ip-country` on every request (clients can't spoof it
// there); `cf-ipcountry` covers Cloudflare in front of another host.
export const ALLOWED_COUNTRY = 'PK';

export function visitorCountry(): string | null {
  const h = headers();
  const raw = h.get('x-vercel-ip-country') || h.get('cf-ipcountry');
  return raw ? raw.trim().toUpperCase() : null;
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
