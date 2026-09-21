// Browser-side helper for /api/admin/upload.
//
// Vercel rejects request bodies over ~4.5 MB *before* our route runs and answers
// with a plain-text "Request Entity Too Large", which used to surface in the
// admin as "Unexpected token 'R' ... is not valid JSON". This turns every failure
// into a message an admin can act on.

/** Slightly under Vercel's 4.5 MB body limit, leaving room for the form envelope. */
export const MAX_UPLOAD_BYTES = 4.4 * 1024 * 1024;

const toMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function tooLargeMessage(file: File): string {
  return `“${file.name || 'This file'}” is ${toMB(file.size)}, but uploads are limited to ${toMB(
    MAX_UPLOAD_BYTES
  )}. Please compress or resize the image (WebP or JPG works well) and try again.`;
}

export interface UploadedFile {
  url: string;
  key: string;
  publicId: string;
}

/** Uploads one file to the admin upload endpoint; throws an Error with a readable message on any failure. */
export async function uploadAdminFile(file: File, folder: string): Promise<UploadedFile> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(tooLargeMessage(file));
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

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
        `“${file.name || 'This file'}” is too large for the server to accept (limit about 4.5 MB). Please compress or resize the image and try again.`
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
