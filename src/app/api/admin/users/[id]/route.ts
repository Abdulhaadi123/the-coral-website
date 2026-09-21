import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireSuperAdmin } from '@/lib/access';
import { sanitizePermissions } from '@/lib/permissions';
import { normalizeEmail, passwordProblem, toPublicUser } from '@/lib/adminUsers';

export const dynamic = 'force-dynamic';

const LAST_SUPER_ERROR = 'At least one active Super Admin is required.';

// PUT update an admin user: name, email, role, sections, enabled/disabled, or a new password
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireSuperAdmin();
    if ('response' in auth) return auth.response;

    const target = await prisma.admin.findUnique({ where: { id: params.id } });
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await req.json();
    const updates: Record<string, unknown> = {};

    if (data.name !== undefined) {
      const name = typeof data.name === 'string' ? data.name.trim() : '';
      if (!name || name.length > 80) {
        return NextResponse.json({ error: 'Enter a name (up to 80 characters).' }, { status: 400 });
      }
      updates.name = name;
    }

    if (data.email !== undefined) {
      const email = normalizeEmail(data.email);
      if (!email) {
        return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
      }
      if (email !== target.email) {
        const clash = await prisma.admin.findUnique({ where: { email } });
        if (clash) {
          return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
        }
      }
      updates.email = email;
    }

    if (data.role !== undefined && data.role !== 'super' && data.role !== 'editor') {
      return NextResponse.json({ error: 'Choose a role.' }, { status: 400 });
    }

    const nextRole: 'super' | 'editor' = data.role ?? (target.role === 'super' ? 'super' : 'editor');
    const nextActive = data.active !== undefined ? Boolean(data.active) : target.active;

    if (data.role !== undefined) updates.role = nextRole;
    if (data.active !== undefined) updates.active = nextActive;

    // Sections only matter for restricted users; a Super Admin holds none explicitly.
    if (nextRole === 'super') {
      if (data.role !== undefined || data.permissions !== undefined) updates.permissions = [];
    } else if (data.permissions !== undefined) {
      updates.permissions = sanitizePermissions(data.permissions);
    }

    if (data.password !== undefined && data.password !== '') {
      const problem = passwordProblem(data.password);
      if (problem) {
        return NextResponse.json({ error: problem }, { status: 400 });
      }
      updates.passwordHash = await hashPassword(data.password);
    }

    // Lock-out guards.
    if (target.id === auth.admin.id && (nextRole !== 'super' || !nextActive)) {
      return NextResponse.json(
        { error: "You can't remove your own Super Admin access or disable your own account." },
        { status: 400 }
      );
    }

    const wasActiveSuper = target.role === 'super' && target.active;
    const willBeActiveSuper = nextRole === 'super' && nextActive;
    if (wasActiveSuper && !willBeActiveSuper) {
      const otherActiveSupers = await prisma.admin.count({
        where: { role: 'super', active: true, id: { not: target.id } },
      });
      if (otherActiveSupers === 0) {
        return NextResponse.json({ error: LAST_SUPER_ERROR }, { status: 400 });
      }
    }

    const user = await prisma.admin.update({ where: { id: target.id }, data: updates });
    return NextResponse.json({ success: true, user: toPublicUser(user) });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE an admin user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireSuperAdmin();
    if ('response' in auth) return auth.response;

    const target = await prisma.admin.findUnique({ where: { id: params.id } });
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (target.id === auth.admin.id) {
      return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
    }

    if (target.role === 'super' && target.active) {
      const otherActiveSupers = await prisma.admin.count({
        where: { role: 'super', active: true, id: { not: target.id } },
      });
      if (otherActiveSupers === 0) {
        return NextResponse.json({ error: LAST_SUPER_ERROR }, { status: 400 });
      }
    }

    await prisma.admin.delete({ where: { id: target.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
