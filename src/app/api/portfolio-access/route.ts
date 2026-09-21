import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Must be dynamic: without this Next prerenders the route at build time and the
// admin toggle would never be reflected until the next deploy.
export const dynamic = 'force-dynamic';

// Public endpoint — middleware reads this to check geo-lock status without
// importing Prisma directly (edge runtime doesn't support it).
export async function GET() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'portfolio_geo_lock' } });
    const locked = row?.value === 'true';
    // Not cached, so flipping the switch in the admin panel applies immediately.
    return NextResponse.json({ locked }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // On error, default to unlocked so visitors aren't accidentally blocked
    return NextResponse.json({ locked: false });
  }
}
