import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessPath } from '@/lib/permissions';

const JWT_SECRET = process.env.JWT_SECRET || 'coral_room_super_secret_admin_jwt_key_987654321';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_session_token';

// ── Geo-lock helper ───────────────────────────────────────────────────────────
// Vercel provides `x-vercel-ip-country` on every request for free.
// We also support `cf-ipcountry` (Cloudflare) as a fallback.
function getCountry(req: NextRequest): string | null {
  return (
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    null
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Portfolio geo-lock check ──────────────────────────────────────────────
  // Applies to /portfolio and /portfolio/[slug] only.
  // Reads the geo-lock flag from a lightweight internal API so we avoid
  // importing Prisma (which can't run on the edge runtime).
  if (
    (pathname === '/portfolio' || pathname.startsWith('/portfolio/')) &&
    !pathname.startsWith('/api/')
  ) {
    try {
      // Fetch setting from our own API (same origin)
      const settingsUrl = new URL('/api/portfolio-access', request.url);
      const res = await fetch(settingsUrl.toString(), {
        // next: { revalidate: 30 } — middleware fetch doesn't support next options,
        // but the API itself sets Cache-Control so CDN caches it.
        cache: 'no-store',
      });

      if (res.ok) {
        const { locked } = await res.json();

        if (locked) {
          const country = getCountry(request);
          // Allow Pakistan (PK), block every other known country. If the country
          // can't be determined (no geo header) let the visitor through rather
          // than risk locking out people in Pakistan.
          if (country && country.toUpperCase() !== 'PK') {
            // Redirect to a "not available" page
            const blocked = new URL('/portfolio-unavailable', request.url);
            return NextResponse.redirect(blocked);
          }
        }
      }
    } catch {
      // On error, allow access — don't accidentally block everyone
    }
  }

  // ── Admin auth guard ──────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let isAuthenticated = false;
    let claims: Record<string, unknown> = {};
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secretKey);
        claims = payload as Record<string, unknown>;
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isLoginPage && !isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isAuthenticated && !isLoginPage && typeof claims.role === 'string') {
      const permissions = Array.isArray(claims.permissions)
        ? claims.permissions.filter((p): p is string => typeof p === 'string')
        : [];
      if (!canAccessPath({ role: claims.role, permissions }, pathname)) {
        const url = new URL('/admin', request.url);
        url.searchParams.set('denied', '1');
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portfolio', '/portfolio/:path*'],
};
