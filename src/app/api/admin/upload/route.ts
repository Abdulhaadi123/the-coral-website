import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';

// Videos and full-page detail images can be large — stream them rather than
// buffering through the default 4MB body limit.
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'coral-room';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { url, key } = await uploadToS3(
      buffer,
      file.name || 'upload',
      file.type,
      folder
    );

    return NextResponse.json({
      success: true,
      url,
      key,
      // Kept for backwards compatibility with the existing admin forms, which
      // read `publicId` from the Cloudinary-era response shape.
      publicId: key,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
