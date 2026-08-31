import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { projects } from '../src/app/portfolio/data';

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const hasCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// ─── Testimonial data ─────────────────────────────────────────────────────────
const defaultTestimonials = [
  {
    quote: 'Working with The Coral Room transformed how our brand shows up online. Clear process, sharp execution, and results we could measure.',
    name: 'Qasim Zaman Khan', role: 'COO, Namal Education Foundation',
    avatar: '/images/testimonials/avatar-1.webp', logo: '/images/testimonials/namal.webp',
    logoWidth: 48, logoHeight: 48, rating: 5, featured: true, order: 0,
  },
  {
    quote: 'They brought strategy and craft together. Our new identity feels premium, consistent, and built for growth across every touchpoint.',
    name: 'Umar Mumtaz', role: 'Managing Director, GoGrad',
    avatar: '/images/testimonials/avatar-1.webp', logo: '/images/testimonials/gograd.webp',
    logoWidth: 100, logoHeight: 36, rating: 5, featured: true, order: 1,
  },
  {
    quote: 'From discovery to delivery, the team made complex decisions simple. The work looks sharp and performs exactly how we needed.',
    name: 'Hamza Rehman', role: 'Marketing Lead, Urban',
    avatar: '/images/testimonials/avatar-1.webp', logo: null,
    logoWidth: 0, logoHeight: 0, rating: 5, featured: true, order: 2,
  },
  {
    quote: 'The Coral Room redesigned our website and scaled our conversion rate by over 30%. Their Fourth Dimension framework gave us total clarity.',
    name: 'Sarah Jenkins', role: 'Creative Lead, Elovira',
    avatar: '/images/testimonials/avatar-1.webp', logo: '/images/partners/elovira.webp',
    logoWidth: 80, logoHeight: 32, rating: 5, featured: true, order: 3,
  },
  {
    quote: 'Fast turnarounds, clean code, and zero fluff. They feel like a natural extension of our internal design and engineering team.',
    name: 'Marcus Vance', role: 'Director, Holix',
    avatar: '/images/testimonials/avatar-1.webp', logo: '/images/partners/holix.webp',
    logoWidth: 80, logoHeight: 32, rating: 5, featured: true, order: 4,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function uploadToCloudinary(localRelPath: string | null, folder: string): Promise<string | null> {
  if (!localRelPath) return null;
  if (localRelPath.startsWith('http')) return localRelPath;
  if (!hasCloudinary) return localRelPath;

  const fullPath = path.join(process.cwd(), 'public', localRelPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ File not found: ${localRelPath}, keeping local path`);
    return localRelPath;
  }

  try {
    console.log(`  ↑ Uploading ${localRelPath}...`);
    const res = await cloudinary.uploader.upload(fullPath, { folder, resource_type: 'image' });
    return res.secure_url;
  } catch (err: any) {
    console.warn(`  ⚠ Upload failed for ${localRelPath}: ${err.message}`);
    return localRelPath;
  }
}

// ─── PHASE 1: Upload ALL images to Cloudinary FIRST (no DB during this phase)
async function uploadAllImages() {
  console.log('\n📤 PHASE 1: Uploading all images to Cloudinary...\n');

  // Projects
  const projectImageMap: Record<string, { card: string; detail: string | null }> = {};
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    console.log(`[${i + 1}/${projects.length}] ${p.title}`);
    const card = await uploadToCloudinary(p.image, 'coral-room/portfolio') || p.image || '';
    const detail = await uploadToCloudinary(p.detailImage || null, 'coral-room/portfolio');
    projectImageMap[p.slug] = { card, detail };
  }

  // Testimonials
  const testimonialImageMap: Record<string, { avatar: string | null; logo: string | null }> = {};
  for (const t of defaultTestimonials) {
    const key = `${t.name}__${t.role}`;
    console.log(`  ↑ Testimonial: ${t.name}`);
    const avatar = await uploadToCloudinary(t.avatar, 'coral-room/testimonials');
    const logo = await uploadToCloudinary(t.logo, 'coral-room/testimonials');
    testimonialImageMap[key] = { avatar, logo };
  }

  console.log('\n✅ All uploads done.\n');
  return { projectImageMap, testimonialImageMap };
}

// ─── PHASE 2: Write EVERYTHING to DB in rapid succession (no uploads, no delays)
async function seedDatabase(
  projectImageMap: Record<string, { card: string; detail: string | null }>,
  testimonialImageMap: Record<string, { avatar: string | null; logo: string | null }>
) {
  console.log('💾 PHASE 2: Writing to Supabase...\n');

  // Use DIRECT_URL (session-mode, no PgBouncer) for the actual DB writes
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
  });

  try {
    // Admin
    const existingAdmin = await prisma.admin.findUnique({ where: { email: 'admin@thecoralroom.com' } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Password123!', 10);
      await prisma.admin.create({
        data: { email: 'admin@thecoralroom.com', name: 'The Coral Room Admin', passwordHash },
      });
      console.log('✅ Admin user created.');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // Projects
    console.log(`\nSeeding ${projects.length} projects...`);
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const imgs = projectImageMap[p.slug];
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title, category: p.category,
          topBadge: p.topBadge || p.category, tags: p.tags,
          image: imgs.card, detailImage: imgs.detail, bg: p.bg, order: i,
        },
        create: {
          slug: p.slug, title: p.title, category: p.category,
          topBadge: p.topBadge || p.category, tags: p.tags,
          image: imgs.card, detailImage: imgs.detail, bg: p.bg,
          order: i, featured: i < 6,
        },
      });
      process.stdout.write(`  [${i + 1}/${projects.length}] ${p.title}\n`);
    }
    console.log('✅ Projects seeded.');

    // Testimonials
    console.log(`\nSeeding ${defaultTestimonials.length} testimonials...`);
    for (const t of defaultTestimonials) {
      const key = `${t.name}__${t.role}`;
      const imgs = testimonialImageMap[key];
      const existing = await prisma.testimonial.findFirst({ where: { name: t.name, role: t.role } });
      if (existing) {
        await prisma.testimonial.update({
          where: { id: existing.id },
          data: { quote: t.quote, avatar: imgs.avatar, logo: imgs.logo, logoWidth: t.logoWidth, logoHeight: t.logoHeight, rating: t.rating, featured: t.featured, order: t.order },
        });
      } else {
        await prisma.testimonial.create({
          data: { name: t.name, role: t.role, quote: t.quote, avatar: imgs.avatar, logo: imgs.logo, logoWidth: t.logoWidth, logoHeight: t.logoHeight, rating: t.rating, featured: t.featured, order: t.order },
        });
      }
      console.log(`  ✓ ${t.name}`);
    }
    console.log('✅ Testimonials seeded.');

  } finally {
    await prisma.$disconnect();
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Coral Room Seed (2-phase: upload then DB write)\n');

  const { projectImageMap, testimonialImageMap } = await uploadAllImages();
  await seedDatabase(projectImageMap, testimonialImageMap);

  console.log('\n🎉 Seed completed successfully!');
  console.log('   Login: admin@thecoralroom.com / Password123!');
}

main().catch((e) => {
  console.error('\n❌ Seed error:', e.message || e);
  process.exit(1);
});
