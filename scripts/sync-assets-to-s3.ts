/**
 * One-shot uploader: pushes the site's heavy media from /public into the S3 bucket,
 * preserving the exact same paths the app requests.
 *
 *   public/images/portfolio/x.webp  ->  s3://$AWS_S3_BUCKET/images/portfolio/x.webp
 *   public/WEB.mp4                  ->  s3://$AWS_S3_BUCKET/WEB.mp4
 *
 * Because the keys mirror the public paths, assetUrl() only has to prepend the
 * bucket/CloudFront origin — no path rewriting anywhere in the app.
 *
 * Usage:
 *   npm run sync:assets              # upload everything that is missing
 *   npm run sync:assets -- --force   # re-upload even if the object already exists
 *   npm run sync:assets -- --dry-run # list what would be uploaded
 */

import fs from 'fs';
import path from 'path';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

/**
 * Optional key prefix, matching AWS_S3_KEY_PREFIX in src/lib/s3.ts. Set it when the
 * bucket is shared with non-public content: everything lands under <prefix>/ and the
 * CloudFront origin path points there, so the rest of the bucket stays unreachable.
 */
const KEY_PREFIX = (process.env.AWS_S3_KEY_PREFIX || '').replace(/^\/+|\/+$/g, '');

const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

/** Directories (recursive) and single files under /public that move to S3. */
const ASSET_DIRS = ['images/portfolio', 'images/featured'];
const ASSET_FILES = ['WEB.mp4', 'ribbon-video.mp4'];

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function collectFiles(): string[] {
  const fromDirs = ASSET_DIRS.flatMap((d) => walk(path.join(PUBLIC_DIR, d)));
  const fromFiles = ASSET_FILES.map((f) => path.join(PUBLIC_DIR, f)).filter((f) =>
    fs.existsSync(f)
  );
  return [...fromDirs, ...fromFiles];
}

/** Public path ("images/portfolio/x.webp"), prefixed, becomes the S3 key. */
function keyFor(absPath: string): string {
  const rel = path.relative(PUBLIC_DIR, absPath).split(path.sep).join('/');
  return KEY_PREFIX ? `${KEY_PREFIX}/${rel}` : rel;
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function exists(s3: S3Client, key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET!, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!BUCKET || !REGION) {
    console.error('Missing AWS_S3_BUCKET or AWS_REGION. Set them in .env before running.');
    process.exit(1);
  }

  const s3 = new S3Client({
    region: REGION,
    ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }
      : {}),
  });

  const files = collectFiles();
  const totalBytes = files.reduce((sum, f) => sum + fs.statSync(f).size, 0);

  console.log(`Bucket:  s3://${BUCKET}${KEY_PREFIX ? `/${KEY_PREFIX}` : ''} (${REGION})`);
  console.log(`Files:   ${files.length} (${humanSize(totalBytes)})`);
  if (DRY_RUN) console.log('Mode:    dry run — nothing will be uploaded');
  console.log('');

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const key = keyFor(file);
    const size = fs.statSync(file).size;
    const ext = path.extname(file).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    if (DRY_RUN) {
      console.log(`  would upload  ${key}  (${humanSize(size)})`);
      continue;
    }

    if (!FORCE && (await exists(s3, key))) {
      skipped += 1;
      console.log(`  skip     ${key}  (already in bucket)`);
      continue;
    }

    try {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: key,
          Body: fs.createReadStream(file),
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        },
        queueSize: 4,
        partSize: 8 * 1024 * 1024,
      });

      await upload.done();
      uploaded += 1;
      console.log(`  upload   ${key}  (${humanSize(size)})`);
    } catch (err: any) {
      failed += 1;
      console.error(`  FAILED   ${key}: ${err.message}`);
    }
  }

  console.log('');
  console.log(`Done. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
