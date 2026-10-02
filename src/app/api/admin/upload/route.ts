import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/access';
import { uploadToS3 } from '@/lib/s3';
import { MAX_UPLOAD_BYTES, STANDARD_IMAGE_MAX_BYTES, THUMBNAIL_MAX_BYTES, formatBytes } from '@/lib/uploadRules';

// Videos and full-page detail images can be large — stream them rather than
// buffering through the default 4MB body limit.
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * WebP's real file signature ("RIFF????WEBP" — a RIFF container tagged WEBP), checked
 * on the actual uploaded bytes rather than the filename or the browser-supplied
 * Content-Type, either of which a client can get wrong or fake.
 */
function bufferLooksLikeWebp(buf: Buffer): boolean {
  return buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';
}

export async function POST(req: NextRequest) {
  try {
    const denied = await checkAccess(['projects', 'blog', 'testimonials', 'partners', 'homepage', 'team', 'email']);
    if (denied) return denied;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'coral-room';
    // 'thumbnail' | 'image' | '' (video/unspecified) — see src/lib/uploadRules.ts.
    const kind = (formData.get('kind') as string) || '';
    const override = formData.get('override') === '1';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // The client already checks this (uploadClient.ts) — this is the real gate, since
    // a request can always be replayed straight past the browser UI.
    if (kind === 'thumbnail' || kind === 'image') {
      if (!bufferLooksLikeWebp(buffer)) {
        return NextResponse.json({ error: 'Only WebP images (.webp) are accepted here.' }, { status: 400 });
      }
      const limit = kind === 'thumbnail' ? THUMBNAIL_MAX_BYTES : override ? MAX_UPLOAD_BYTES : STANDARD_IMAGE_MAX_BYTES;
      if (buffer.length > limit) {
        return NextResponse.json(
          {
            error: `File is ${formatBytes(buffer.length)}, over the ${formatBytes(limit)} limit${
              kind === 'thumbnail' ? ' for portfolio thumbnails' : ''
            }.`,
          },
          { status: 400 }
        );
      }
    } else if (buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File is ${formatBytes(buffer.length)}, over the ${formatBytes(MAX_UPLOAD_BYTES)} server limit.` },
        { status: 400 }
      );
    }

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
