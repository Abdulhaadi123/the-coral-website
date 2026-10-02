import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { CACHE_TAGS } from '@/lib/publicData';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET single team member — admin screens only
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const member = await prisma.teamMember.findUnique({ where: { id: params.id } });
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

// PUT update team member
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('team');
    if (denied) return denied;

    const data = await req.json();
    const { name, designation, photo, active, order } = data;

    const existing = await prisma.teamMember.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const updated = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(designation && { designation: designation.trim() }),
        // Explicit null clears the photo (reverts to the placeholder) — only
        // skip the field entirely when it's not present in the request at all.
        ...(photo !== undefined && { photo: photo ? String(photo).trim() : null }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidateTag(CACHE_TAGS.team);
    revalidatePath('/about');

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE team member
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const denied = await checkAccess('team');
    if (denied) return denied;

    await prisma.teamMember.delete({ where: { id: params.id } });

    revalidateTag(CACHE_TAGS.team);
    revalidatePath('/about');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
