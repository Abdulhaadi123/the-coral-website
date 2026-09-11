/**
 * Seeds the PageSeo table with a distinct, real title + meta description for
 * every static marketing route — fixing the "every page shares the same
 * <title>/description" on-page SEO issue.
 *
 * Safe to re-run: rows are matched by path, existing ones are left alone so
 * edits made in /admin/seo are never overwritten.
 *
 *   npm run seed:seo
 */
import { PrismaClient } from '@prisma/client';
import { SEO_ROUTES } from '../src/lib/seo';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  let created = 0;
  let skipped = 0;

  for (const route of SEO_ROUTES) {
    const existing = await prisma.pageSeo.findUnique({ where: { path: route.path } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.pageSeo.create({
      data: {
        path: route.path,
        label: route.label,
        title: route.title,
        description: route.description,
      },
    });
    created++;
  }

  const total = await prisma.pageSeo.count();
  console.log(`Page SEO seeded: ${created} created, ${skipped} already present, ${total} total.`);
}

main()
  .catch((e) => {
    console.error('Seeding page SEO failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
