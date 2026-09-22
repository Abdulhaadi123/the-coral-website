import { SignJWT, importPKCS8 } from 'jose';
import { SITE_URL } from '@/lib/site';

/**
 * Tells Google Search Console to recrawl the sitemap right after content
 * changes, instead of waiting for Google's own crawl schedule to notice.
 *
 * Auth is a service account (Google's server-to-server OAuth2 "JWT Bearer"
 * flow, RFC 7523) — no user ever logs in. The client's Google Cloud project
 * created this account and added it as an Owner on the thecoralroom.co
 * property in Search Console; without that step every call below fails with
 * 403 and is simply logged (see `pingSearchConsoleSitemap`).
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters';

interface ServiceAccountConfig {
  clientEmail: string;
  privateKey: string;
}

function getConfig(): ServiceAccountConfig | null {
  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  if (!clientEmail || !rawKey) return null;
  // .env stores the PEM with literal "\n" sequences (as Google's JSON key file
  // has them); turn them back into real newlines before signing.
  return { clientEmail, privateKey: rawKey.replace(/\\n/g, '\n') };
}

// Access tokens last an hour; reuse one across calls within that window
// instead of re-authenticating on every publish.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(config: ServiceAccountConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 30) return cachedToken.value;

  const key = await importPKCS8(config.privateKey, 'RS256');
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(config.clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = { value: data.access_token, expiresAt: now + (data.expires_in ?? 3600) };
  return cachedToken.value;
}

/**
 * Best-effort: tells Google to recrawl sitemap.xml. Never throws — a hiccup
 * here (missing config, expired permission, Google being briefly unavailable)
 * is logged and must never block or fail the publish action that triggered it.
 * A no-op when the service account isn't configured (e.g. local dev).
 */
export async function pingSearchConsoleSitemap(): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || `${SITE_URL}/`;
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  try {
    const token = await getAccessToken(config);
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Search Console sitemap ping failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Search Console sitemap ping error:', err);
  }
}
