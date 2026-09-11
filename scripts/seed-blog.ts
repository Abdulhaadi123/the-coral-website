/**
 * Seeds the BlogPost table from the original static /journal posts.
 *
 * Cover images are uploaded to S3 first (same two-phase approach as
 * scripts/seed.ts for portfolio projects) so the DB always holds an absolute
 * URL — the public pages resolve `image` through assetUrl(), which only
 * rewrites local-looking paths, so a plain "/images/..." string here would
 * 404 once the asset CDN is enabled.
 *
 * Safe to re-run: posts are matched by slug, existing ones are left alone.
 *
 *   npm run seed:blog
 */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { uploadToS3 } from '../src/lib/s3';
import { blogPosts, type BlogPost as StaticBlogPost } from '../src/app/journal/data';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

function contentToHtml(post: StaticBlogPost): string {
  const parts: string[] = [];
  (post.content?.paragraphs || []).forEach((p) => parts.push(`<p>${p}</p>`));
  if (post.content?.subheading) {
    parts.push(`<h2>${post.content.subheading}</h2>`);
  }
  (post.content?.subheadingParagraphs || []).forEach((p) => parts.push(`<p>${p}</p>`));
  if (parts.length === 0) parts.push(`<p>${post.description}</p>`);
  return parts.join('\n');
}

async function uploadCover(localRelPath: string): Promise<string> {
  if (/^https?:\/\//i.test(localRelPath)) return localRelPath;

  const fullPath = path.join(process.cwd(), 'public', localRelPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ File not found: ${localRelPath}, keeping local path`);
    return localRelPath;
  }

  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const contentType = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';

  const { url } = await uploadToS3(buffer, path.basename(fullPath), contentType, 'coral-room/journal');
  return url;
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      skipped++;
      continue;
    }

    console.log(`↑ [${i + 1}/${blogPosts.length}] ${post.title}`);
    const image = await uploadCover(post.image);

    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle || '',
        description: post.description,
        badge: post.badge,
        category: post.category,
        image,
        contentHtml: contentToHtml(post),
        featured: i === 0,
        published: true,
        order: i,
        publishedAt: new Date(post.date),
      },
    });
    created++;
  }

  const total = await prisma.blogPost.count();
  console.log(`\nBlog posts seeded: ${created} created, ${skipped} already present, ${total} total.`);
}

main()
  .catch((e) => {
    console.error('Seeding blog posts failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
