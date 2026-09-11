import prisma from '@/lib/db';

export interface PageSeoData {
  title: string;
  description: string;
}

/** Falls back to this when a route has no PageSeo row yet (e.g. before seeding). */
export const DEFAULT_SEO: PageSeoData = {
  title: 'The Coral Room — Digital experiences built to be seen, trusted, and chosen',
  description:
    'We help ambitious brands turn scattered clicks into customers through sharper identity, smarter websites, and performance-led marketing.',
};

/** Every static marketing route that gets admin-editable SEO, in the order shown in /admin/seo. */
export const SEO_ROUTES: { path: string; label: string; title: string; description: string }[] = [
  {
    path: '/',
    label: 'Homepage',
    title: 'The Coral Room — Digital experiences built to be seen, trusted, and chosen',
    description:
      'We help ambitious brands turn scattered clicks into customers through sharper identity, smarter websites, and performance-led marketing.',
  },
  {
    path: '/design',
    label: 'Design',
    title: 'Design Services — Brand, UI/UX & Creative | Coral Room',
    description:
      'Brand identity, UI/UX, packaging, and campaign visuals built on our Fourth Dimension™ framework — design that looks consistent and moves people to choose you.',
  },
  {
    path: '/development',
    label: 'Development',
    title: 'Website & Ecommerce Development | The Coral Room',
    description:
      'Fast, responsive websites, ecommerce stores, WordPress and Shopify builds, and custom CMS solutions engineered to look sharp and support real business growth.',
  },
  {
    path: '/optimisation',
    label: 'Optimisation',
    title: 'Website Optimisation — CRO, SEO & Speed | Coral Room',
    description:
      'Cleaner SEO, faster load times, stronger pages, and clearer journeys — we improve the website you already have so it ranks and converts better.',
  },
  {
    path: '/marketing',
    label: 'Marketing',
    title: 'Digital Marketing — Content, CRM & Paid Media',
    description:
      'Content, email, automation, CRM, and paid campaigns working toward one goal: attract better leads and build a pipeline you can measure and grow.',
  },
  {
    path: '/marketing-campaigns',
    label: 'Marketing Campaigns',
    title: 'Marketing Campaigns That Drive Growth',
    description:
      'Full-journey campaign strategy and execution — attract, capture, nurture, and grow — planned end-to-end for measurable pipeline.',
  },
  {
    path: '/paid-advertising',
    label: 'Paid Advertising',
    title: 'Paid Advertising — Meta, Google & LinkedIn Ads',
    description:
      'Paid campaigns across Meta, Google, LinkedIn, TikTok, and Snapchat with sharp targeting, strong creative, and a focus on return, not wasted clicks.',
  },
  {
    path: '/seo-search-visibility',
    label: 'SEO & Search Visibility',
    title: 'SEO & Search Visibility Services | Coral Room',
    description:
      'On-page, off-page, and technical SEO plus local and AI/GEO search visibility — built to help the right customers find, trust, and choose you.',
  },
  {
    path: '/fourth-dimension-framework',
    label: 'Fourth Dimension™ Framework',
    title: 'The Fourth Dimension™ Framework',
    description:
      'Our four-stage process — Discover, Define, Develop, Drive — for turning scattered ideas into focused digital work that performs after launch.',
  },
  {
    path: '/portfolio',
    label: 'Portfolio',
    title: 'Our Portfolio — Client Work & Case Studies',
    description:
      'Branding, website, ecommerce, marketing, and optimisation work shaped around each client\'s goals and next stage of growth — browse the case studies.',
  },
  {
    path: '/book-a-call',
    label: 'Book a Call',
    title: 'Book a Discovery Call | The Coral Room',
    description:
      'Tell us what you\'re building, fixing, or trying to grow. We\'ll review your details and come back with a clear next step.',
  },
  {
    path: '/journal',
    label: 'Journal',
    title: 'The Coral Room Journal — Marketing & Web Insights',
    description:
      'Digital tips and tricks to help you improve efficiency, be more productive, and grow your business, from The Coral Room.',
  },
];

/** Page SEO for a static route, read from the database with a safe fallback. */
export async function getPageSeo(path: string): Promise<PageSeoData> {
  try {
    const row = await prisma.pageSeo.findUnique({ where: { path } });
    if (row) return { title: row.title, description: row.description };
  } catch (err) {
    console.error(`Error fetching PageSeo for "${path}":`, err);
  }
  const fallback = SEO_ROUTES.find((r) => r.path === path);
  return fallback ? { title: fallback.title, description: fallback.description } : DEFAULT_SEO;
}
