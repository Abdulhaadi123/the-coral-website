import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'coral_room_super_secret_admin_jwt_key_987654321';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_session_token';

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function setAdminSession(payload: AdminJwtPayload) {
  const token = await signToken(payload);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
