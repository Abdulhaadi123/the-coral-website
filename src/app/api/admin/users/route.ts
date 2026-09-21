import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireSuperAdmin } from '@/lib/access';
import { sanitizePermissions } from '@/lib/permissions';
import { normalizeEmail, passwordProblem, toPublicUser } from '@/lib/adminUsers';

export const dynamic = 'force-dynamic';

// GET every admin user (Super Admin only)
export async function GET() {
  try {
    const auth = await requireSuperAdmin();
    if ('response' in auth) return auth.response;

    const rows = await prisma.admin.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ success: true, users: rows.map(toPublicUser), currentUserId: auth.admin.id });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create an admin user (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if ('response' in auth) return auth.response;

    const data = await req.json();

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name || name.length > 80) {
      return NextResponse.json({ error: 'Enter a name (up to 80 characters).' }, { status: 400 });
    }

    const email = normalizeEmail(data.email);
    if (!email) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const problem = passwordProblem(data.password);
    if (problem) {
      return NextResponse.json({ error: problem }, { status: 400 });
    }

    if (data.role !== 'super' && data.role !== 'editor') {
      return NextResponse.json({ error: 'Choose a role.' }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    const user = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(data.password),
        role: data.role,
        permissions: data.role === 'super' ? [] : sanitizePermissions(data.permissions),
        active: data.active !== undefined ? Boolean(data.active) : true,
      },
    });

    return NextResponse.json({ success: true, user: toPublicUser(user) }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
