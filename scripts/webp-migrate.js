// Brief item 06: convert the jpg/png images stored in the DB (S3 / CDN) to WebP — safely.
//
//   node scripts/webp-migrate.js dry      <outDir>   fetch + convert + quality-check everything; writes <outDir>/plan.json and
//                                                    the converted files to <outDir>/cache. Touches NOTHING in S3 or the DB.
//   node scripts/webp-migrate.js apply    <outDir>   uploads the planned files to NEW .webp keys (never overwrites, never
//                                                    deletes), checks each one in S3 and through the CDN, and only then points
//                                                    the DB rows at them (each update guarded: a row edited meanwhile is skipped).
//   node scripts/webp-migrate.js rollback <outDir>   points the DB rows back at the original URLs (originals stay in S3).
//
// Set ONLY_S3HOST=1 to process just the URLs stored as direct https://<bucket>.s3.<region>.amazonaws.com/... links
// (a handful of older testimonial logos) instead of the cdn.thecoralroom.co ones.
// Needs the same .env as the site (DATABASE_URL, AWS_*, NEXT_PUBLIC_ASSET_BASE_URL).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}

const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const MODE = process.argv[2];
const OUT = process.argv[3];
const CACHE = path.join(OUT, 'cache');
const PLAN_FILE = path.join(OUT, 'plan.json');
const APPLIED_FILE = path.join(OUT, 'applied.json');
fs.mkdirSync(CACHE, { recursive: true });

const BUCKET = process.env.AWS_S3_BUCKET;
const BASE = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/+$/, '');
const BASE_PATH = new URL(BASE).pathname.replace(/\/+$/, '');
const PREFIX = (process.env.AWS_S3_KEY_PREFIX || '').replace(/^\/+|\/+$/g, '');
const S3_HOST = `${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;
const REFERER = 'https://www.thecoralroom.co/';
const THUMB_MAX = 150 * 1024;
const WEBP_MAX_DIM = 16383;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
});
const prisma = new PrismaClient();

const extOf = (u) => (String(u).split('?')[0].match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
const isLegacy = (u) => ['jpg', 'jpeg', 'png', 'gif'].includes(extOf(u));
const swapExt = (u) => u.replace(/\.(jpe?g|png|gif)(\?.*)?$/i, '.webp$2');
const sha1 = (s) => crypto.createHash('sha1').update(s).digest('hex');

function keyFromUrl(url) {
  const { pathname, host } = new URL(url);
  if (host === S3_HOST) return decodeURIComponent(pathname.replace(/^\/+/, ''));
  if (host !== new URL(BASE).host) return null;
  const withoutBase = BASE_PATH && pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : pathname;
  const publicPath = decodeURIComponent(withoutBase.replace(/^\/+/, ''));
  return PREFIX ? `${PREFIX}/${publicPath}` : publicPath;
}

async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; await fn(items[idx], idx); }
  });
  await Promise.all(workers);
}

let s3CanGet = true;
async function fetchOriginal(url, key) {
  if (s3CanGet) {
    try {
      const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      return Buffer.from(await r.Body.transformToByteArray());
    } catch (e) { s3CanGet = false; console.log(`(S3 GetObject not permitted/failed: ${e.name} — using CDN with Referer instead)`); }
  }
  const res = await fetch(url, { headers: { Referer: REFERER } });
  if (!res.ok) throw new Error(`CDN ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function psnr(origBuf, webpBuf, w, h) {
  const W = 640, H = Math.max(1, Math.round((W * h) / w));
  const raw = (b) => sharp(b, { failOn: 'none', limitInputPixels: false }).flatten({ background: '#ffffff' }).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  const [a, b] = await Promise.all([raw(origBuf), raw(webpBuf)]);
  let se = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; se += d * d; }
  const mse = se / a.length;
  return mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse);
}

async function convertOne(buf, srcExt, isThumb) {
  const mk = () => sharp(buf, { failOn: 'none', limitInputPixels: false });
  const meta = await mk().metadata();
  if ((meta.pages || 1) > 1) return { skip: 'animated' };
  if (meta.orientation && meta.orientation > 1) return { skip: 'exif-orientation' };
  if (meta.width > WEBP_MAX_DIM || meta.height > WEBP_MAX_DIM) return { skip: `webp-dimension-limit (${meta.width}x${meta.height})` };

  const baseQ = srcExt === 'png' ? 85 : 82;
  const enc = (pipeline, q) => pipeline.webp({ quality: q, effort: 5, smartSubsample: true, alphaQuality: 100 }).toBuffer();
  let q = baseQ, out = await enc(mk(), q), resizedTo = null;
  if (isThumb) {
    while (out.length > THUMB_MAX && q > 55) { q -= 5; out = await enc(mk(), q); }
    for (const w of [1400, 1200, 1000, 800]) {
      if (out.length <= THUMB_MAX || meta.width <= w) continue;
      q = baseQ;
      while (true) {
        out = await enc(mk().resize({ width: w, withoutEnlargement: true }), q);
        resizedTo = w;
        if (out.length <= THUMB_MAX || q <= 55) break;
        q -= 5;
      }
    }
  }
  const outMeta = await sharp(out).metadata();
  const score = await psnr(buf, out, meta.width, meta.height);
  return { out, quality: q, resizedTo, w: meta.width, h: meta.height, outW: outMeta.width, outH: outMeta.height, psnr: score, hasAlpha: !!meta.hasAlpha };
}

async function collectTargets() {
  const t = [];
  for (const x of await prisma.project.findMany({ select: { id: true, slug: true, image: true } }))
    if (isLegacy(x.image)) t.push({ table: 'project', field: 'image', id: x.id, label: x.slug, url: x.image, thumb: true });
  for (const x of await prisma.projectDetailImage.findMany({ select: { id: true, url: true, width: true, height: true } }))
    if (isLegacy(x.url)) t.push({ table: 'projectDetailImage', field: 'url', id: x.id, label: x.id.slice(0, 8), url: x.url, dbW: x.width, dbH: x.height });
  for (const x of await prisma.testimonial.findMany({ select: { id: true, name: true, avatar: true, logo: true } })) {
    if (isLegacy(x.avatar)) t.push({ table: 'testimonial', field: 'avatar', id: x.id, label: x.name + ':avatar', url: x.avatar });
    if (isLegacy(x.logo)) t.push({ table: 'testimonial', field: 'logo', id: x.id, label: x.name + ':logo', url: x.logo });
  }
  const onlyS3 = !!process.env.ONLY_S3HOST;
  return t.filter((x) => (new URL(x.url).host === S3_HOST) === onlyS3);
}

async function dry() {
  const targets = await collectTargets();
  console.log(`targets: ${targets.length}`);
  const plan = [], skipped = [], failed = [];
  let done = 0;
  await pool(targets, 6, async (t) => {
    try {
      const key = keyFromUrl(t.url);
      if (!key) { skipped.push({ ...t, reason: 'url-not-on-our-cdn' }); return; }
      const buf = await fetchOriginal(t.url, key);
      const r = await convertOne(buf, extOf(t.url), !!t.thumb);
      if (r.skip) { skipped.push({ ...t, reason: r.skip }); return; }
      if (r.out.length >= buf.length) { skipped.push({ ...t, reason: `no-size-gain (${buf.length} -> ${r.out.length})` }); return; }
      const newUrl = swapExt(t.url), newKey = swapExt(key);
      fs.writeFileSync(path.join(CACHE, sha1(newKey) + '.webp'), r.out);
      plan.push({
        ...t, key, newKey, newUrl, oldBytes: buf.length, newBytes: r.out.length, quality: r.quality, resizedTo: r.resizedTo,
        w: r.w, h: r.h, outW: r.outW, outH: r.outH, psnr: Math.round(r.psnr * 10) / 10,
        dimMismatch: t.dbW != null && (t.dbW !== r.outW || t.dbH !== r.outH) ? `db ${t.dbW}x${t.dbH} vs file ${r.outW}x${r.outH}` : null,
      });
    } catch (e) { failed.push({ ...t, error: e.message }); }
    done++;
    if (done % 50 === 0) console.log(`  ${done}/${targets.length}`);
  });
  fs.writeFileSync(PLAN_FILE, JSON.stringify({ createdAt: new Date().toISOString(), plan, skipped, failed }, null, 1));
  report(plan, skipped, failed);
}

function mb(n) { return (n / 1048576).toFixed(1) + ' MB'; }
function report(plan, skipped, failed) {
  const old = plan.reduce((s, p) => s + p.oldBytes, 0), nw = plan.reduce((s, p) => s + p.newBytes, 0);
  console.log(`\n=== DRY-RUN REPORT ===\nconvertible: ${plan.length}   skipped: ${skipped.length}   failed: ${failed.length}`);
  console.log(`size: ${mb(old)} -> ${mb(nw)}  (saves ${mb(old - nw)}, ${Math.round((1 - nw / old) * 100)}%)`);
  const byTable = {};
  for (const p of plan) { const k = `${p.table}.${p.field}`; byTable[k] = byTable[k] || { n: 0, old: 0, nw: 0 }; byTable[k].n++; byTable[k].old += p.oldBytes; byTable[k].nw += p.newBytes; }
  for (const [k, v] of Object.entries(byTable)) console.log(`  ${k}: ${v.n} files, ${mb(v.old)} -> ${mb(v.nw)}`);
  const ps = plan.map((p) => p.psnr).sort((a, b) => a - b);
  console.log(`PSNR (higher = closer to original; >=35 dB is visually near-identical): min ${ps[0]}  median ${ps[Math.floor(ps.length / 2)]}  max ${ps[ps.length - 1]}`);
  console.log('lowest PSNR:'); plan.slice().sort((a, b) => a.psnr - b.psnr).slice(0, 6).forEach((p) => console.log(`   ${p.psnr} dB  q${p.quality}  ${p.table}.${p.field} ${p.label}  ${p.w}x${p.h}  ${Math.round(p.oldBytes / 1024)}KB -> ${Math.round(p.newBytes / 1024)}KB`));
  const th = plan.filter((p) => p.thumb);
  console.log(`thumbnails: ${th.length}, over 150KB after conversion: ${th.filter((p) => p.newBytes > THUMB_MAX).length}, downscaled: ${th.filter((p) => p.resizedTo).length}`);
  console.log(`dimension mismatches vs DB: ${plan.filter((p) => p.dimMismatch).length}`);
  const reasons = {}; for (const s of skipped) reasons[s.reason.split(' ')[0]] = (reasons[s.reason.split(' ')[0]] || 0) + 1;
  console.log('skipped reasons:', JSON.stringify(reasons)); skipped.slice(0, 10).forEach((s) => console.log(`   skip ${s.table}.${s.field} ${s.label}: ${s.reason}`));
  failed.slice(0, 10).forEach((f) => console.log(`   FAIL ${f.table}.${f.field} ${f.label}: ${f.error}`));
}

async function head(key) {
  try { return await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key })); }
  catch (e) { if (e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404) return null; throw e; }
}

async function apply() {
  const { plan } = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf8'));
  const ok = [], bad = [];
  let uploaded = 0, alreadyThere = 0, n = 0;
  console.log(`apply: ${plan.length} planned files`);
  await pool(plan, 6, async (p) => {
    try {
      const body = fs.readFileSync(path.join(CACHE, sha1(p.newKey) + '.webp'));
      if (body.length !== p.newBytes) throw new Error('cache size mismatch');
      const existing = await head(p.newKey);
      if (existing) {
        if (existing.ContentLength !== p.newBytes) throw new Error(`key already exists with different size (${existing.ContentLength} vs ${p.newBytes}) — not overwriting`);
        alreadyThere++;
      } else {
        await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: p.newKey, Body: body, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
        uploaded++;
      }
      const v = await head(p.newKey);
      if (!v || v.ContentLength !== p.newBytes || v.ContentType !== 'image/webp') throw new Error('S3 verification failed');
      // Live check through the CDN exactly as a visitor's browser would fetch it.
      const res = await fetch(p.newUrl, { method: 'HEAD', headers: { Referer: REFERER } });
      const ct = res.headers.get('content-type') || '', cl = Number(res.headers.get('content-length') || 0);
      if (!res.ok || !ct.includes('image/webp') || (cl && cl !== p.newBytes)) throw new Error(`CDN check failed: ${res.status} ${ct} ${cl}`);
      ok.push(p);
    } catch (e) { bad.push({ ...p, error: e.message }); }
    if (++n % 100 === 0) console.log(`  ${n}/${plan.length}`);
  });
  console.log(`uploaded ${uploaded}, already present ${alreadyThere}, verified ok ${ok.length}, failed ${bad.length}`);
  bad.slice(0, 10).forEach((b) => console.log('   FAIL', b.table, b.label, b.error));

  // Byte-for-byte GET check on a sample through the CDN.
  const sample = ok.slice().sort(() => Math.random() - 0.5).slice(0, 10);
  let sampleOk = 0;
  for (const p of sample) {
    const res = await fetch(p.newUrl, { headers: { Referer: REFERER } });
    const got = Buffer.from(await res.arrayBuffer());
    const want = fs.readFileSync(path.join(CACHE, sha1(p.newKey) + '.webp'));
    if (res.ok && got.equals(want)) sampleOk++;
  }
  console.log(`CDN byte-for-byte sample: ${sampleOk}/${sample.length}`);
  if (sampleOk !== sample.length) { console.log('ABORT: CDN sample mismatch — DB NOT touched.'); return; }

  // Only now switch the DB rows over, each guarded so a row an admin edited meanwhile is left alone.
  const models = { project: prisma.project, projectDetailImage: prisma.projectDetailImage, testimonial: prisma.testimonial };
  const applied = []; let changed = 0, stale = 0;
  for (const p of ok) {
    const r = await models[p.table].updateMany({ where: { id: p.id, [p.field]: p.url }, data: { [p.field]: p.newUrl } });
    if (r.count === 1) { changed++; applied.push({ table: p.table, field: p.field, id: p.id, oldUrl: p.url, newUrl: p.newUrl }); } else stale++;
  }
  fs.writeFileSync(APPLIED_FILE, JSON.stringify(applied, null, 1));
  console.log(`DB rows switched to WebP: ${changed}   skipped (row changed meanwhile): ${stale}`);
}

async function rollback() {
  const applied = JSON.parse(fs.readFileSync(APPLIED_FILE, 'utf8'));
  const models = { project: prisma.project, projectDetailImage: prisma.projectDetailImage, testimonial: prisma.testimonial };
  let n = 0;
  for (const a of applied) { const r = await models[a.table].updateMany({ where: { id: a.id, [a.field]: a.newUrl }, data: { [a.field]: a.oldUrl } }); n += r.count; }
  console.log(`rolled back ${n}/${applied.length} rows`);
}

(async () => {
  if (MODE === 'dry') await dry();
  else if (MODE === 'apply') await apply();
  else if (MODE === 'rollback') await rollback();
  else console.log('usage: dry|apply|rollback <outDir>');
})().catch((e) => { console.error('FATAL', e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
