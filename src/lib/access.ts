import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import {
  AdminRole,
  SectionKey,
  hasAnyPermission,
  isSuper,
  sanitizePermissions,
} from '@/lib/permissions';

export interface CurrentAdmin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: SectionKey[];
}

/**
 * The signed-in admin as they are *right now* in the database. The JWT only
 * proves who someone is; role, permissions and active/disabled status are read
 * fresh so revoking access or disabling an account takes effect immediately,
 * without waiting for their 7-day token to expire.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await getAdminSession();
  if (!session) return null;

  const row = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!row || !row.active) return null;

  const role: AdminRole = row.role === 'super' ? 'super' : 'editor';
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role,
    permissions: role === 'super' ? [] : sanitizePermissions(row.permissions),
  };
}

/**
 * Gate for admin API routes. Returns a ready-to-send 401/403 response when the
 * caller may not proceed, or null when they may. Pass several sections to allow
 * a user holding any one of them.
 *
 *   const denied = await checkAccess('blog');
 *   if (denied) return denied;
 */
export async function checkAccess(required: SectionKey | SectionKey[]): Promise<NextResponse | null> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sections = Array.isArray(required) ? required : [required];
  if (!hasAnyPermission(admin, sections)) {
    return NextResponse.json({ error: 'You do not have permission to do this.' }, { status: 403 });
  }

  return null;
}

/** Gate for user-management routes: Super Admins only. */
export async function requireSuperAdmin(): Promise<{ admin: CurrentAdmin } | { response: NextResponse }> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isSuper(admin)) {
    return { response: NextResponse.json({ error: 'Only a Super Admin can manage users.' }, { status: 403 }) };
  }
  return { admin };
}
