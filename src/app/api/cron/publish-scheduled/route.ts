import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized, publishDueAndRevalidate } from '@/lib/blogPublishing';

export const dynamic = 'force-dynamic';

/**
 * Publishes scheduled blog posts whose time has arrived and refreshes the site. Called every
 * minute by the in-process scheduler (src/lib/blogScheduler.ts); an external cron can call it
 * too with `Authorization: Bearer $CRON_SECRET`. Not callable anonymously.
 */
async function handle(req: NextRequest) {
  if (!isCronAuthorized(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await publishDueAndRevalidate();
    return NextResponse.json({
      success: true,
      message: `Checked scheduled posts. ${count} post(s) published.`,
      publishedCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in publish-scheduled cron route:', error);
    return NextResponse.json({ error: 'Failed to process scheduled posts' }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
