import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, getCurrentAdmin } from '@/lib/access';

export const dynamic = 'force-dynamic';

// Settings the admin panel is allowed to change, with their default when no row
// exists yet. Anything not listed here is rejected, so this can't become a
// general-purpose write into the Setting table.
const DEFAULTS: Record<string, string> = {
  portfolio_geo_lock: 'false',
};

// Settings whose value must be exactly "true" or "false".
const BOOLEAN_KEYS = new Set(['portfolio_geo_lock']);

// GET /api/admin/settings?keys=portfolio_geo_lock  (any signed-in admin)
export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const keysParam = searchParams.get('keys');
    const requested = keysParam ? keysParam.split(',').map((k) => k.trim()) : Object.keys(DEFAULTS);
    const keys = requested.filter((k) => k in DEFAULTS);

    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });

    const result: Record<string, string> = {};
    for (const key of keys) {
      const row = rows.find((r) => r.key === key);
      result[key] = row ? row.value : DEFAULTS[key];
    }

    return NextResponse.json({ success: true, settings: result });
  } catch (err) {
    console.error('GET /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH /api/admin/settings  body: { key: string, value: string }
// The portfolio lock decides who can see the portfolio, so it needs the same
// permission as managing portfolio projects.
export async function PATCH(req: NextRequest) {
  try {
    const denied = await checkAccess('projects');
    if (denied) return denied;

    const { key, value } = await req.json();
    if (typeof key !== 'string' || !(key in DEFAULTS)) {
      return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
    }
    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }
    const text = String(value);
    if (BOOLEAN_KEYS.has(key) && text !== 'true' && text !== 'false') {
      return NextResponse.json({ error: 'Value must be "true" or "false"' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: text },
      create: { key, value: text },
    });

    return NextResponse.json({ success: true, setting });
  } catch (err) {
    console.error('PATCH /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
