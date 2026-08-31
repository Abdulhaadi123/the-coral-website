import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  console.log('Fixing featured projects...');

  // Step 1: Set ALL projects featured = false
  await prisma.project.updateMany({ data: { featured: false } });
  console.log('✓ Cleared all featured flags');

  // Step 2: Mark only Kaelvo + Mochae as featured
  const kaelvo = await prisma.project.update({
    where: { slug: 'kaelvo-brand-identity' },
    data: { featured: true, order: 0 },
  });
  console.log(`✓ Featured: ${kaelvo.title}`);

  const mochae = await prisma.project.update({
    where: { slug: 'mochae-brand-identity' },
    data: { featured: true, order: 1 },
  });
  console.log(`✓ Featured: ${mochae.title}`);

  console.log('\n🎉 Done! Featured Work will now show Kaelvo + Mochae.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
