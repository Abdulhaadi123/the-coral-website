import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, setAdminSession, removeAdminSession, getAdminSession } from '@/lib/auth';

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

    await setAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
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

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, admin: session });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error checking session' }, { status: 500 });
  }
}
