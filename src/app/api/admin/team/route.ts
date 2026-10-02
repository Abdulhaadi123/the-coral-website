import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAccess, checkSignedIn } from '@/lib/access';
import { CACHE_TAGS } from '@/lib/publicData';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET all team members — admin screens only (the About Us page reads them on the server)
export async function GET(req: NextRequest) {
  try {
    const denied = await checkSignedIn();
    if (denied) return denied;

    const team = await prisma.teamMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST create team member
export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess('team');
    if (denied) return denied;

    const data = await req.json();
    const { name, designation, photo, active, order } = data;

    if (!name || !designation) {
      return NextResponse.json(
        { error: 'Name and designation are required' },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        designation: designation.trim(),
        photo: photo ? String(photo).trim() : null,
        active: active !== undefined ? Boolean(active) : true,
        order: Number(order) || 0,
      },
    });

    revalidateTag(CACHE_TAGS.team);
    revalidatePath('/about');

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to create team member' }, { status: 500 });
  }
}
