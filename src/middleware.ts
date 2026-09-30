import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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
    if (token) {
      try {
        await jwtVerify(token, secretKey);
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

    // Section permissions are NOT checked here from the JWT's `role`/`permissions`
    // claims: those are baked in at login time, so a Super Admin granting or
    // revoking a section right now would only take effect for that person after
    // they signed out and back in — not "immediately" as the Users & Access page
    // promises. The admin layout (src/app/admin/layout.tsx) already re-checks
    // this on every navigation straight from the database via GET /api/admin/auth
    // and redirects to /admin?denied=1 itself; every admin API route re-checks
    // it again via checkAccess()/checkSignedIn() (src/lib/access.ts). This layer
    // only needs to gate "is anyone logged in at all", which the JWT proves fine.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
