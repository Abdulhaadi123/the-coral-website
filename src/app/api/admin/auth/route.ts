import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, setAdminSession, removeAdminSession, getAdminSession } from '@/lib/auth';
import { getCurrentAdmin } from '@/lib/access';
import { sanitizePermissions } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Checked only after the password is right, so this never confirms that an
    // account exists to someone who doesn't know its password.
    if (!admin.active) {
      return NextResponse.json(
        { error: 'This account has been disabled. Please contact your administrator.' },
        { status: 403 }
      );
    }

    const role = admin.role === 'super' ? 'super' : 'editor';
    const permissions = role === 'super' ? [] : sanitizePermissions(admin.permissions);

    await setAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role,
      permissions,
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role, permissions },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await removeAdminSession();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error logging out' }, { status: 500 });
  }
}

// Who am I — read from the database, not trusted from the token.
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const admin = await getCurrentAdmin();
    if (!admin) {
      // Account was deleted or disabled since this token was issued.
      await removeAdminSession();
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Keep the cookie in step with the database so the middleware's page
    // gating (which can only read the token) doesn't lag behind changes.
    const sortedKey = (list?: string[]) => [...(list ?? [])].sort().join(',');
    const tokenIsStale =
      session.role !== admin.role ||
      session.name !== admin.name ||
      session.email !== admin.email ||
      sortedKey(session.permissions) !== sortedKey(admin.permissions);

    if (tokenIsStale) {
      await setAdminSession({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
      });
    }

    return NextResponse.json({ authenticated: true, admin });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error checking session' }, { status: 500 });
  }
}
