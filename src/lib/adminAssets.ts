/**
 * Image URLs for the ADMIN panel only. Public pages use `assetUrl()` (src/lib/assets.ts),
 * which points straight at S3/CloudFront — deliberately hotlink-protected (see
 * deploy/cloudfront-portfolio-image-guard.js and the nginx `valid_referers` block) so a
 * copied link only works when opened from thecoralroom.co.
 *
 * That protection is Referer-based, which is fragile for the admin panel specifically:
 * a restricted-access editor's browser, an extension, or a strict Referrer-Policy can
 * omit the Referer on a cross-subdomain image request (www.thecoralroom.co ->
 * cdn.thecoralroom.co) and get a silent 403 — the thumbnail/detail-image previews and
 * the "add another part" row just look broken, with no error to click through to.
 *
 * Every admin preview therefore loads through `/api/admin/asset` instead: a same-origin,
 * signed-in-only proxy (checkSignedIn — any active admin, any role) that fetches the
 * original from S3 directly, so it never depends on a Referer header at all. This also
 * means it always works for whoever is signed in, regardless of which section
 * permissions they hold — access to *view* an already-uploaded image was never meant to
 * be gated per-section, only the ability to *change* things is (enforced by checkAccess
 * in the save/upload routes, unchanged).
 */
export function adminAssetUrl<T extends string | null | undefined>(url: T): T {
  if (!url) return url;
  const value = url as string;

  // data:/blob: previews (a file just picked, not yet uploaded) and relative /public
  // paths need no proxying — only absolute http(s) URLs (S3/CDN) do.
  if (!/^https?:\/\//i.test(value)) return url;

  return `/api/admin/asset?url=${encodeURIComponent(value)}` as T;
}

export default adminAssetUrl;
