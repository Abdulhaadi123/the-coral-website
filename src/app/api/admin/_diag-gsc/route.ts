import { NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';
import { getCurrentAdmin } from '@/lib/access';

// TEMPORARY diagnostic route — verifies the Search Console env vars actually
// parse and authenticate on THIS deployment, without exposing their values.
// Gated behind normal admin login like every other admin API. Delete this
// file (and redeploy) right after use.

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;

  const report: Record<string, unknown> = {
    clientEmailPresent: !!clientEmail,
    privateKeyPresent: !!rawKey,
    privateKeyLength: rawKey?.length ?? 0,
    privateKeyStartsCorrectly: !!rawKey && rawKey.trim().startsWith('-----BEGIN PRIVATE KEY-----'),
    privateKeyEndsCorrectly: !!rawKey && rawKey.trim().endsWith('-----END PRIVATE KEY-----'),
    siteUrl,
  };

  if (!clientEmail || !rawKey) {
    return NextResponse.json({ ok: false, stage: 'env', report });
  }

  try {
    const privateKey = rawKey.replace(/\\n/g, '\n');
    const key = await importPKCS8(privateKey, 'RS256');
    report.keyImported = true;

    const now = Math.floor(Date.now() / 1000);
    const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/webmasters.readonly' })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(clientEmail)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(key);
    report.jwtSigned = true;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });
    const tokenText = await tokenRes.text();
    report.tokenExchangeStatus = tokenRes.status;

    if (!tokenRes.ok) {
      return NextResponse.json({ ok: false, stage: 'token-exchange', report, googleResponse: tokenText });
    }

    const { access_token } = JSON.parse(tokenText);
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const sitesText = await sitesRes.text();
    report.sitesListStatus = sitesRes.status;

    return NextResponse.json({ ok: sitesRes.ok, stage: 'sites-list', report, googleResponse: JSON.parse(sitesText) });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      stage: 'exception',
      report,
      error: err?.message || String(err),
    });
  }
}
