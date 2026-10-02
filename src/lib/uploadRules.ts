/**
 * Upload format/size rules — imported by both the browser (src/lib/uploadClient.ts and
 * every admin upload form) and the server (src/app/api/admin/upload/route.ts), so each
 * rule is defined exactly once and can't drift between the two sides.
 *
 * From the 2026-09 client change brief:
 *   02. Portfolio thumbnails — WebP only, 150 KB max, no override.
 *   07. Every other image upload site-wide — WebP only, 550 KB max by default, with a
 *       controlled admin-only override to raise that up to the server's own ceiling for
 *       one exceptional upload (never for a thumbnail).
 * Video uploads (project videos, the homepage banner) are untouched by either rule.
 */

const configuredMB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB);

/** Hard ceiling for any single upload, video included — backed by the server's own
 * request-body limit (nginx `client_max_body_size` on self-hosted; ~4.5MB on Vercel). */
export const MAX_UPLOAD_BYTES = (configuredMB > 0 ? configuredMB : 12) * 1024 * 1024;

/** Portfolio thumbnail (Project.image): WebP only, and nothing can raise this one. */
export const THUMBNAIL_MAX_BYTES = 150 * 1024;

/** Every other image upload site-wide: WebP only, 550KB by default. The admin-only
 * override raises this up to MAX_UPLOAD_BYTES for a single upload. */
export const STANDARD_IMAGE_MAX_BYTES = 550 * 1024;

/** Which upload rule applies. Anything else (undefined — a video) gets neither the
 * WebP requirement nor these size caps, only the MAX_UPLOAD_BYTES ceiling. */
export type ImageUploadKind = 'thumbnail' | 'image';

/** Client-side format check — good enough to steer someone to the right file before a
 * round trip; the server checks the real file bytes regardless (see route.ts). */
export function isWebpFile(file: { type?: string; name?: string }): boolean {
  if (file.type) return file.type === 'image/webp';
  return /\.webp$/i.test(file.name || '');
}

export function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
