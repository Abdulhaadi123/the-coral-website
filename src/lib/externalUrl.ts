/**
 * Admin-entered website links (a project's "Explore Project" button and its
 * card click-through) end up in an <a href> on the public site, so they are
 * treated as untrusted input: only plain http(s) links to a real-looking host
 * may pass. Anything else — javascript:, data:, vbscript:, file: — is rejected.
 *
 * Pure and dependency-free, so the API routes, the admin form and the public
 * pages all apply exactly the same rule.
 */

const MAX_LENGTH = 2048;

export type ExternalUrlResult = { ok: true; url: string } | { ok: false };

// "example.com:8080/x" is a host:port, not a scheme — everything else that looks
// like "word:" is a scheme and must be http(s) to be accepted.
const HOST_PORT = /^[^\s/:@]+:\d+(?:[/?#]|$)/;
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Validates and normalises one link.
 *  - empty / whitespace-only  -> { ok: true, url: '' }   (means "no link")
 *  - "example.com"            -> { ok: true, url: 'https://example.com' }
 *  - "//example.com"          -> { ok: true, url: 'https://example.com' }
 *  - "http(s)://..."          -> kept as typed
 *  - anything else            -> { ok: false }
 */
export function parseExternalUrl(input: unknown): ExternalUrlResult {
  if (input === undefined || input === null) return { ok: true, url: '' };
  if (typeof input !== 'string') return { ok: false };

  const raw = input.trim();
  if (raw === '') return { ok: true, url: '' };
  if (raw.length > MAX_LENGTH) return { ok: false };
  // Whitespace or control characters inside a URL are never legitimate.
  if (/[\s\u0000-\u001f\u007f]/.test(raw)) return { ok: false };

  let candidate = raw;
  if (raw.startsWith('//')) {
    candidate = `https:${raw}`;
  } else if (HAS_SCHEME.test(raw) && !HOST_PORT.test(raw)) {
    // An explicit scheme: only http(s):// is acceptable.
    if (!/^https?:\/\//i.test(raw)) return { ok: false };
  } else {
    candidate = `https://${raw}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return { ok: false };
  // Needs a real host (a dot) — catches "https://foo" typos — and no embedded credentials.
  if (!parsed.hostname.includes('.')) return { ok: false };
  if (parsed.username || parsed.password) return { ok: false };

  return { ok: true, url: candidate };
}

/**
 * Render-time guard: the link to put in an href, or null when there is none or
 * it isn't safe. Applied on the public pages even though the API already
 * validates, so a bad value written straight into the database can never
 * become a clickable javascript: link.
 */
export function safeExternalUrl(input: unknown): string | null {
  const result = parseExternalUrl(input);
  return result.ok && result.url !== '' ? result.url : null;
}
