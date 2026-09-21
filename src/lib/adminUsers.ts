import type { Admin } from '@prisma/client';
import { sanitizePermissions } from '@/lib/permissions';

export const MIN_PASSWORD_LENGTH = 8;
// bcrypt silently ignores everything past 72 bytes, so longer passwords give a false sense of strength.
export const MAX_PASSWORD_LENGTH = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: unknown): string | null {
  const email = typeof input === 'string' ? input.trim().toLowerCase() : '';
  return EMAIL_PATTERN.test(email) && email.length <= 254 ? email : null;
}

export function passwordProblem(input: unknown): string | null {
  if (typeof input !== 'string' || input.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (input.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

/** What the admin UI is allowed to see about a user — never the password hash. */
export function toPublicUser(row: Admin) {
  const role = row.role === 'super' ? 'super' : 'editor';
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role,
    permissions: role === 'super' ? [] : sanitizePermissions(row.permissions),
    active: row.active,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
