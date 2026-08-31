import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// GET all leads (Admin Protected)
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// DELETE lead by ID (Admin Protected)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
