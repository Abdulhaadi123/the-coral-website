/**
 * switch-to-cdn.ts
 *
 * Updates all database records from direct S3 URLs to CloudFront CDN URLs.
 * Old: https://coral-room-content.s3.us-east-2.amazonaws.com
 * New: https://cdn.thecoralroom.co
 *
 * Usage:
 *   node --env-file=.env scripts/switch-to-cdn.ts
 */

import { PrismaClient } from '@prisma/client';

const OLD_HOST = 'https://coral-room-content.s3.us-east-2.amazonaws.com';
const NEW_HOST = 'https://cdn.thecoralroom.co';

async function main() {
  const prisma = new PrismaClient();

  console.log(`🔄 Switching asset URLs in database...`);
  console.log(`From: ${OLD_HOST}`);
  console.log(`To:   ${NEW_HOST}\n`);

  // 1. Project.image
  const projects = await prisma.project.findMany({
    where: {
      image: { contains: OLD_HOST },
    },
  });
  for (const p of projects) {
    if (p.image) {
      const updated = p.image.replaceAll(OLD_HOST, NEW_HOST);
      await prisma.project.update({
        where: { id: p.id },
        data: { image: updated },
      });
    }
  }
  console.log(`✓ Project thumbnails updated: ${projects.length}`);

  // 2. ProjectDetailImage.url (parts/slices)
  const detailImages = await prisma.projectDetailImage.findMany({
    where: {
      url: { contains: OLD_HOST },
    },
  });
  for (const d of detailImages) {
    const updated = d.url.replaceAll(OLD_HOST, NEW_HOST);
    await prisma.projectDetailImage.update({
      where: { id: d.id },
      data: { url: updated },
    });
  }
  console.log(`✓ Project detail image slices updated: ${detailImages.length}`);

  // 3. BlogPost.image
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      image: { contains: OLD_HOST },
    },
  });
  for (const b of blogPosts) {
    if (b.image) {
      const updated = b.image.replaceAll(OLD_HOST, NEW_HOST);
      await prisma.blogPost.update({
        where: { id: b.id },
        data: { image: updated },
      });
    }
  }
  console.log(`✓ Blog post images updated: ${blogPosts.length}`);

  // 4. Testimonial.avatar
  const testimonials = await prisma.testimonial.findMany({
    where: {
      avatar: { contains: OLD_HOST },
    },
  });
  for (const t of testimonials) {
    if (t.avatar) {
      const updated = t.avatar.replaceAll(OLD_HOST, NEW_HOST);
      await prisma.testimonial.update({
        where: { id: t.id },
        data: { avatar: updated },
      });
    }
  }
  console.log(`✓ Testimonials updated: ${testimonials.length}`);

  // 5. Partner.logo
  const partners = await prisma.partner.findMany({
    where: {
      logo: { contains: OLD_HOST },
    },
  });
  for (const pt of partners) {
    const updated = pt.logo.replaceAll(OLD_HOST, NEW_HOST);
    await prisma.partner.update({
      where: { id: pt.id },
      data: { logo: updated },
    });
  }
  console.log(`✓ Partners updated: ${partners.length}`);

  await prisma.$disconnect();
  console.log(`\n🎉 All done! All database image URLs are now pointing to CloudFront CDN!`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
