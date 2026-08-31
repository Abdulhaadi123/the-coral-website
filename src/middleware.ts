import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'coral_room_super_secret_admin_jwt_key_987654321';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_session_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        isAuthenticated = true;
      } catch (err) {
        isAuthenticated = false;
      }
    }

    // If on /admin/login and already authenticated, redirect to /admin dashboard
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If on /admin/* (not login) and not authenticated, redirect to /admin/login
    if (!isLoginPage && !isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
