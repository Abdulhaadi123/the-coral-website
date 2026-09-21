import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessPath } from '@/lib/permissions';

const JWT_SECRET = process.env.JWT_SECRET || 'coral_room_super_secret_admin_jwt_key_987654321';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_session_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/admin/:path*'],
};
