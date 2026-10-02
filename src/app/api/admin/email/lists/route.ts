import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { parseContactsFile } from '@/lib/emailMarketing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

// GET all lists — admin screens only.
export async function GET() {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const [lists, validByList] = await Promise.all([
      prisma.emailList.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { contacts: true } } },
      }),
      prisma.emailContact.groupBy({ by: ['listId'], where: { valid: true }, _count: { _all: true } }),
    ]);
    const validCounts = new Map(validByList.map((g) => [g.listId, g._count._all]));

    return NextResponse.json({
      success: true,
      // contactCount = everyone in the file; validCount = the ones a campaign will actually be sent to.
      lists: lists.map((l) => ({
        id: l.id,
        name: l.name,
        createdAt: l.createdAt,
        contactCount: l._count.contacts,
        validCount: validCounts.get(l.id) ?? 0,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching email lists:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// POST — upload a CSV/Excel file and create a new list from it.
export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = ((formData.get('name') as string) || '').trim();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Please name this list' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let parsed;
    try {
      parsed = parseContactsFile(buffer);
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Could not read that file' }, { status: 400 });
    }

    const list = await prisma.emailList.create({
      data: {
        name,
        contacts: {
          create: parsed.contacts.map((c) => ({ email: c.email, name: c.name, valid: c.valid })),
        },
      },
      include: { _count: { select: { contacts: true } } },
    });

    const invalidCount = parsed.contacts.filter((c) => !c.valid).length;

    return NextResponse.json(
      {
        success: true,
        list: { id: list.id, name: list.name, createdAt: list.createdAt, contactCount: list._count.contacts },
        imported: parsed.contacts.length,
        invalidCount,
        blankRowsSkipped: parsed.blankRowsSkipped,
        duplicatesSkipped: parsed.duplicatesSkipped,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating email list:', error);
    return NextResponse.json({ error: error.message || 'Failed to create list' }, { status: 500 });
  }
}
