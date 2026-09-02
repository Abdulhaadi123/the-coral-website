import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

/**
 * Server-side S3 access for admin uploads.
 *
 * Required env vars:
 *   AWS_REGION              e.g. "eu-west-1"
 *   AWS_S3_BUCKET           e.g. "coral-room-assets"
 *   AWS_ACCESS_KEY_ID       IAM user key with s3:PutObject / s3:DeleteObject
 *   AWS_SECRET_ACCESS_KEY
 * Optional:
 *   NEXT_PUBLIC_ASSET_BASE_URL  CloudFront (or bucket) origin used to build public URLs
 */

export const S3_REGION = process.env.AWS_REGION || 'us-east-1';
export const S3_BUCKET = process.env.AWS_S3_BUCKET || '';

/**
 * Prefix applied to every object key we write ("web").
 *
 * It exists so a shared bucket can hold non-public content alongside the site's
 * media: the CloudFront distribution points at s3://<bucket>/<prefix> via its
 * origin path, so nothing outside that subtree is reachable from the internet.
 *
 * The prefix is deliberately absent from public URLs — CloudFront re-adds it when
 * it fetches from S3. When serving straight from the bucket endpoint instead,
 * include it in NEXT_PUBLIC_ASSET_BASE_URL (".../coral-room-content/web").
 *
 * Leave AWS_S3_KEY_PREFIX unset for a dedicated bucket; keys are then unprefixed.
 */
export const S3_KEY_PREFIX = (process.env.AWS_S3_KEY_PREFIX || '').replace(/^\/+|\/+$/g, '');

/** Public path ("coral-room/x.webp") -> S3 object key ("web/coral-room/x.webp"). */
export function toS3Key(publicPath: string): string {
  const clean = publicPath.replace(/^\/+/, '');
  return S3_KEY_PREFIX ? `${S3_KEY_PREFIX}/${clean}` : clean;
}

/** S3 object key -> public path. Inverse of toS3Key; a no-op on unprefixed input. */
export function fromS3Key(key: string): string {
  const clean = key.replace(/^\/+/, '');
  return S3_KEY_PREFIX && clean.startsWith(`${S3_KEY_PREFIX}/`)
    ? clean.slice(S3_KEY_PREFIX.length + 1)
    : clean;
}

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: S3_REGION,
      // Falls back to the ambient credential chain (IAM role, SSO, ~/.aws)
      // when explicit keys are not provided.
      ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });
  }
  return client;
}

/** Public URL for an object — CloudFront domain if configured, else the bucket endpoint. */
export function publicUrlForKey(key: string): string {
  const base = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/+$/, '');
  const publicPath = fromS3Key(key);
  const encode = (p: string) => p.split('/').map(encodeURIComponent).join('/');

  // The configured origin already resolves the prefix (CloudFront origin path,
  // or a prefix baked into the base URL), so emit the unprefixed public path.
  if (base) return `${base}/${encode(publicPath)}`;

  // No origin configured: address the bucket directly, prefix and all.
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${encode(toS3Key(publicPath))}`;
}

/** Slugify a filename so uploaded keys never contain spaces or odd characters. */
function safeFileName(originalName: string): string {
  const dot = originalName.lastIndexOf('.');
  const ext = dot > -1 ? originalName.slice(dot + 1).toLowerCase() : '';
  const stem = (dot > -1 ? originalName.slice(0, dot) : originalName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'file';

  return ext ? `${stem}-${randomUUID().slice(0, 8)}.${ext}` : `${stem}-${randomUUID().slice(0, 8)}`;
}

export interface S3UploadResult {
  url: string;
  key: string;
}

export async function uploadToS3(
  buffer: Buffer,
  originalName: string,
  contentType: string,
  folder = 'coral-room'
): Promise<S3UploadResult> {
  if (!S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET is not configured');
  }

  const publicPath = `${folder.replace(/^\/+|\/+$/g, '')}/${safeFileName(originalName)}`;
  const key = toS3Key(publicPath);

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return { url: publicUrlForKey(publicPath), key };
}

export async function deleteFromS3(key: string): Promise<boolean> {
  if (!S3_BUCKET) return false;
  try {
    await getS3Client().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
}

/** Recover the object key from a public asset URL (CloudFront or bucket endpoint). */
export function keyFromUrl(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const base = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/+$/, '');
    const basePath = base ? new URL(base).pathname.replace(/\/+$/, '') : '';
    const withoutBase = basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length)
      : pathname;
    const publicPath = decodeURIComponent(withoutBase.replace(/^\/+/, ''));
    return publicPath ? toS3Key(publicPath) : null;
  } catch {
    return null;
  }
}
