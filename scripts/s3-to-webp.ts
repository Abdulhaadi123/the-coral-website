/**
 * s3-to-webp.ts
 *
 * Converts every image in the S3 bucket to WebP format.
 * - Lists all objects in the bucket (with optional prefix)
 * - Downloads each non-WebP image (jpg, jpeg, png, gif, avif)
 * - Converts using sharp (already installed in the project)
 * - Re-uploads as .webp with the same path (but new extension)
 * - Updates ALL matching DB records (Project.image, ProjectDetailImage.url)
 *   so the website automatically picks up the new URLs
 * - Optionally deletes the old original file from S3
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env scripts/s3-to-webp.ts
 *   npx tsx --env-file-if-exists=.env scripts/s3-to-webp.ts --dry-run   # preview only
 *   npx tsx --env-file-if-exists=.env scripts/s3-to-webp.ts --delete-originals  # remove old files after conversion
 *   npx tsx --env-file-if-exists=.env scripts/s3-to-webp.ts --quality=85  # set WebP quality (default 85)
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';

// ─── Config ───────────────────────────────────────────────────────────────────
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
const KEY_PREFIX = (process.env.AWS_S3_KEY_PREFIX || '').replace(/^\/+|\/+$/g, '');
const ASSET_BASE = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/+$/, '');

const DRY_RUN = process.argv.includes('--dry-run');
const DELETE_ORIGINALS = process.argv.includes('--delete-originals');
const qualityArg = process.argv.find((a) => a.startsWith('--quality='));
const QUALITY = qualityArg ? Number(qualityArg.split('=')[1]) : 85;

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.avif', '.bmp', '.tiff']);

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function extOf(key: string): string {
  const dot = key.lastIndexOf('.');
  return dot > -1 ? key.slice(dot).toLowerCase() : '';
}

function toWebpKey(key: string): string {
  const dot = key.lastIndexOf('.');
  return dot > -1 ? key.slice(0, dot) + '.webp' : key + '.webp';
}

/** Build the public-facing URL for an S3 key (mirrors assetUrl() in src/lib/assets.ts) */
function publicUrl(key: string): string {
  // Strip the prefix so the path matches what the DB stores
  const withoutPrefix = KEY_PREFIX && key.startsWith(KEY_PREFIX + '/')
    ? key.slice(KEY_PREFIX.length + 1)
    : key;
  const encoded = withoutPrefix.split('/').map(encodeURIComponent).join('/');
  return ASSET_BASE ? `${ASSET_BASE}/${encoded}` : `/${withoutPrefix}`;
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function main() {
  if (!BUCKET || !REGION) {
    console.error('❌  Missing AWS_S3_BUCKET or AWS_REGION in .env');
    process.exit(1);
  }

  console.log(`\n🪣  Bucket:  s3://${BUCKET}${KEY_PREFIX ? `/${KEY_PREFIX}` : ''} (${REGION})`);
  console.log(`🎨  Quality: ${QUALITY}`);
  if (DRY_RUN) console.log('🔍  Mode:    DRY RUN — nothing will be changed\n');
  else console.log('');

  const s3 = new S3Client({
    region: REGION,
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } }
      : {}),
  });

  const prisma = new PrismaClient();

  // ── 1. List all objects ───────────────────────────────────────────────────
  console.log('📋  Listing S3 objects...');
  const toConvert: string[] = [];
  let token: string | undefined;

  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: KEY_PREFIX || undefined,
      ContinuationToken: token,
    }));

    for (const obj of res.Contents ?? []) {
      if (!obj.Key) continue;
      const ext = extOf(obj.Key);
      if (IMAGE_EXTS.has(ext)) toConvert.push(obj.Key);
    }

    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  console.log(`📁  Found ${toConvert.length} image(s) to convert\n`);

  if (toConvert.length === 0) {
    console.log('✅  Nothing to convert — all images already in WebP or no images found.');
    await prisma.$disconnect();
    return;
  }

  // ── 2. Convert & upload ───────────────────────────────────────────────────
  let converted = 0, skipped = 0, failed = 0;
  const urlUpdates: Array<{ oldUrl: string; newUrl: string }> = [];

  for (const key of toConvert) {
    const newKey = toWebpKey(key);
    const oldUrl = publicUrl(key);
    const newUrl = publicUrl(newKey);

    if (DRY_RUN) {
      console.log(`  would convert  ${key}  →  ${newKey}`);
      urlUpdates.push({ oldUrl, newUrl });
      converted++;
      continue;
    }

    try {
      // Download original
      const getRes = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const inputBuffer = await streamToBuffer(getRes.Body as Readable);

      // Convert to WebP
      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: QUALITY })
        .toBuffer();

      const savedBytes = inputBuffer.length - webpBuffer.length;
      const saving = savedBytes > 0 ? `saved ${humanSize(savedBytes)}` : `+${humanSize(-savedBytes)}`;

      // Upload WebP
      await new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: newKey,
          Body: webpBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        },
      }).done();

      // Delete original if requested
      if (DELETE_ORIGINALS && key !== newKey) {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      }

      urlUpdates.push({ oldUrl, newUrl });
      converted++;
      console.log(`  ✓  ${key}  →  ${newKey}  (${saving})`);
    } catch (err: any) {
      failed++;
      console.error(`  ✗  FAILED  ${key}: ${err.message}`);
    }
  }

  // ── 3. Update DB records ──────────────────────────────────────────────────
  if (!DRY_RUN && urlUpdates.length > 0) {
    console.log('\n🗄️   Updating database records...');
    let dbUpdated = 0;

    for (const { oldUrl, newUrl } of urlUpdates) {
      // Project.image (card thumbnail)
      const projResult = await prisma.project.updateMany({
        where: { image: oldUrl },
        data: { image: newUrl },
      });
      dbUpdated += projResult.count;

      // ProjectDetailImage.url (detail view slices)
      const detailResult = await prisma.projectDetailImage.updateMany({
        where: { url: oldUrl },
        data: { url: newUrl },
      });
      dbUpdated += detailResult.count;
    }

    console.log(`  ✓  ${dbUpdated} DB record(s) updated`);
  }

  await prisma.$disconnect();

  // ── 4. Summary ────────────────────────────────────────────────────────────
  console.log(`\n✅  Done!  converted=${converted}  skipped=${skipped}  failed=${failed}`);
  if (DRY_RUN) console.log('    (dry run — nothing was actually changed)');
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
