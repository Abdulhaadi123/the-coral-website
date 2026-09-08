/**
 * Seeds the Partner table with the original homepage marquee logos.
 *
 * PartnersSection keeps this same list hard-coded as a fallback, but the
 * fallback only renders when no active rows exist — it does not merge with the
 * database. Seeding these in means adding a new partner from the admin panel
 * appends to the strip instead of replacing it.
 *
 * Safe to re-run: rows are matched by name, so existing ones are left alone
 * rather than duplicated.
 *
 *   npm run seed:partners
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const partners = [
  { name: 'ELOVIRA',      logo: '/images/partners/elovira.webp' },
  { name: 'Holix',        logo: '/images/partners/holix.webp' },
  { name: 'ASCENT',       logo: '/images/partners/ascent.webp' },
  { name: 'MOCHAE',       logo: '/images/partners/mochae.webp' },
  { name: 'Crewtix',      logo: '/images/partners/crewtix.webp' },
  { name: 'SPACE',        logo: '/images/partners/space.webp' },
  { name: 'Nimertech',    logo: '/images/partners/nimertech.webp' },
  { name: 'The Vertical', logo: '/images/partners/the-vertical.webp' },
  { name: 'Evee',         logo: '/images/partners/evee.webp' },
  { name: 'Finlo',        logo: '/images/partners/finlo.webp' },
  { name: 'Finora',       logo: '/images/partners/finora.webp' },
  { name: 'Dexterz',      logo: '/images/partners/dexterz.webp' },
  { name: 'Noura',        logo: '/images/partners/noura.webp' },
  { name: 'Ronin',        logo: '/images/partners/ronin.webp' },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const [index, partner] of partners.entries()) {
    const existing = await prisma.partner.findFirst({ where: { name: partner.name } });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.partner.create({
      data: {
        name: partner.name,
        logo: partner.logo,
        // Matches the intrinsic size the original <Image> tags declared.
        width: 183,
        height: 110,
        active: true,
        order: index,
      },
    });
    created++;
  }

  const total = await prisma.partner.count();
  console.log(`Partners seeded: ${created} created, ${skipped} already present, ${total} total.`);
}

main()
  .catch((e) => {
    console.error('Seeding partners failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
