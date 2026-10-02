// Browser-side helper for /api/admin/upload.
//
// Vercel rejects request bodies over ~4.5 MB *before* our route runs and answers
// with a plain-text "Request Entity Too Large", which used to surface in the
// admin as "Unexpected token 'R' ... is not valid JSON". This turns every failure
// into a message an admin can act on.

import {
  MAX_UPLOAD_BYTES,
  STANDARD_IMAGE_MAX_BYTES,
  THUMBNAIL_MAX_BYTES,
  ImageUploadKind,
  formatBytes,
  isWebpFile,
} from './uploadRules';

export { MAX_UPLOAD_BYTES };

const toMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function tooLargeMessage(file: File): string {
  return `“${file.name || 'This file'}” is ${toMB(file.size)}, but uploads are limited to ${toMB(
    MAX_UPLOAD_BYTES
  )}. Please choose a file under ${toMB(MAX_UPLOAD_BYTES)} or compress the image and try again.`;
}

export interface UploadedFile {
  url: string;
  key: string;
  publicId: string;
}

export interface UploadOptions {
  /**
   * 'thumbnail' = the portfolio card image (WebP only, 150KB hard cap, no override).
   * 'image' = every other image upload site-wide (WebP only, 550KB by default; pass
   * `allowOverride` to raise that for this one upload). Omit entirely for a non-image
   * file such as a video, which gets neither rule — only the MAX_UPLOAD_BYTES ceiling.
   */
  kind?: ImageUploadKind;
  /** Admin has explicitly asked to bypass the 550KB cap for this one upload (kind: 'image' only — a thumbnail's cap can't be overridden). */
  allowOverride?: boolean;
}

/**
 * Thrown when a file is rejected for being too large. `overridable` tells the caller
 * whether re-trying with `{ allowOverride: true }` can get this exact file through —
 * true for an 'image' over its default 550KB cap, false for anything with a hard
 * ceiling (a thumbnail's 150KB, or MAX_UPLOAD_BYTES itself even with the override).
 */
export class UploadTooLargeError extends Error {
  overridable: boolean;
  constructor(message: string, overridable: boolean) {
    super(message);
    this.name = 'UploadTooLargeError';
    this.overridable = overridable;
  }
}

/** Uploads one file to the admin upload endpoint; throws an Error with a readable message on any failure. */
export async function uploadAdminFile(file: File, folder: string, options: UploadOptions = {}): Promise<UploadedFile> {
  const { kind, allowOverride = false } = options;

  if (kind && !isWebpFile(file)) {
    throw new Error(`“${file.name || 'This file'}” must be a WebP image (.webp). Convert it and try again.`);
  }

  if (kind === 'thumbnail') {
    if (file.size > THUMBNAIL_MAX_BYTES) {
      throw new UploadTooLargeError(
        `“${file.name || 'This file'}” is ${formatBytes(file.size)}. Portfolio thumbnails must be ${formatBytes(THUMBNAIL_MAX_BYTES)} or smaller.`,
        false
      );
    }
  } else if (kind === 'image') {
    const cap = allowOverride ? MAX_UPLOAD_BYTES : STANDARD_IMAGE_MAX_BYTES;
    if (file.size > cap) {
      throw new UploadTooLargeError(
        allowOverride
          ? `“${file.name || 'This file'}” is ${formatBytes(file.size)}, over the server's ${formatBytes(MAX_UPLOAD_BYTES)} ceiling.`
          : `“${file.name || 'This file'}” is ${formatBytes(file.size)}, over the ${formatBytes(STANDARD_IMAGE_MAX_BYTES)} limit.`,
        !allowOverride
      );
    }
  } else if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(tooLargeMessage(file));
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (kind) formData.append('kind', kind);
  if (allowOverride) formData.append('override', '1');

  let res: Response;
  try {
    res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  } catch {
    throw new Error("Couldn't reach the server. Check your internet connection and try again.");
  }

  // Read as text first: error replies from the platform aren't always JSON.
  const raw = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(raw);
  } catch {
    /* not JSON — handled below by status */
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error(
        `“${file.name || 'This file'}” is too large for the server to accept (limit about ${toMB(MAX_UPLOAD_BYTES)}). If using Nginx, make sure client_max_body_size is set.`
      );
    }
    if (res.status === 401) throw new Error('Your session has expired. Please sign in again and retry.');
    if (res.status === 403) throw new Error("You don't have permission to upload files.");
    if (data && typeof data.error === 'string' && data.error) throw new Error(data.error);
    throw new Error(`Upload failed (error ${res.status}). Please try again.`);
  }

  if (!data || typeof data.url !== 'string') {
    throw new Error('The upload finished but the server sent an unexpected reply. Please try again.');
  }

  return data as UploadedFile;
}
