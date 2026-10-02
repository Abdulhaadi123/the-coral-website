import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';

export const dynamic = 'force-dynamic';

// GET a single list with its contacts — admin screens only.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const list = await prisma.emailList.findUnique({
      where: { id: params.id },
      include: { contacts: { orderBy: { createdAt: 'asc' } } },
    });
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, list });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
  }
}

// DELETE a list (and its contacts, via cascade). Campaigns that used it keep
// their send history but lose the live link (listId becomes orphaned-safe —
// see the schema's optional relation).
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('email');
    if (denied) return denied;

    const inUse = await prisma.emailCampaign.findFirst({
      where: { listId: params.id, status: { in: ['scheduled', 'sending'] } },
      select: { id: true },
    });
    if (inUse) {
      return NextResponse.json(
        { error: 'This list is used by a scheduled or currently-sending campaign. Cancel that campaign first.' },
        { status: 400 }
      );
    }

    await prisma.emailList.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting email list:', error);
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
}
