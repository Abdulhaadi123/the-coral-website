import { NextResponse } from 'next/server';
import { publishDueScheduledPosts } from '@/lib/blogScheduler';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await publishDueScheduledPosts();
    return NextResponse.json({
      success: true,
      message: `Checked scheduled posts. ${count} post(s) published.`,
      publishedCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in publish-scheduled cron route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process scheduled posts' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
