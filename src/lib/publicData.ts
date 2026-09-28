import { unstable_cache } from 'next/cache';
import prisma from '@/lib/db';
import { DEFAULT_SOCIAL_LINKS, SocialLinkItem } from '@/lib/social';
import type { Category } from '@/lib/useCategories';

/**
 * Content the public site shows (portfolio, categories, footer links,
 * testimonials, partners), read on the server and handed to pages as props.
 *
 * None of it is served as a JSON API any more: the matching /api/admin GET
 * routes answer signed-in admins only, so the rendered website is the only
 * public way to see this data.
 *
 * Reads go through Next's data cache because the database is far from the web
 * server (every query is a long round trip). Each admin save calls
 * revalidateTag() with the tag below, so edits still show up immediately; the
 * hourly expiry is only a safety net for rows changed outside the admin panel
 * (seed scripts, the Supabase dashboard).
 */
export const CACHE_TAGS = {
  projects: 'public-projects',
  categories: 'public-categories',
  socialLinks: 'public-social-links',
  testimonials: 'public-testimonials',
  partners: 'public-partners',
  pageSeo: 'public-page-seo',
} as const;

export const PUBLIC_DATA_REVALIDATE_SECONDS = 3600;

/** A portfolio card: just what the grid and its video modal need. */
export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  topBadge: string;
  tags: string[];
  image: string;
  bg: string;
  exploreUrl: string;
  cardLink: string;
  videos: { url: string; title: string }[];
  pakistanOnly: boolean;
}

/** A featured testimonial as saved in the admin panel. */
export interface TestimonialRow {
  quote: string;
  name: string;
  role: string;
  avatar: string | null;
  logo: string | null;
  logoWidth: number;
  logoHeight: number;
  rating: number;
}

/** An active partner logo as saved in the admin panel. */
export interface PartnerRow {
  name: string;
  logo: string;
  width: number;
  height: number;
}

// The cached readers let errors through (nothing is cached for a failed read);
// the exported getters below turn a failure into each section's usual fallback.
async function orNull<T>(read: () => Promise<T>, what: string): Promise<T | null> {
  try {
    return await read();
  } catch (err) {
    console.error(`Error loading ${what}:`, err);
    return null;
  }
}

const readPortfolioProjects = unstable_cache(
  async (): Promise<PortfolioProject[]> =>
    prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        slug: true,
        title: true,
        category: true,
        topBadge: true,
        tags: true,
        image: true,
        bg: true,
        exploreUrl: true,
        cardLink: true,
        pakistanOnly: true,
        videos: { orderBy: { order: 'asc' }, select: { url: true, title: true } },
      },
    }),
  ['public-portfolio-projects'],
  { tags: [CACHE_TAGS.projects], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

/** Every portfolio project (Pakistan-only ones included), or null when the database can't be reached. */
export function getPortfolioProjects(): Promise<PortfolioProject[] | null> {
  return orNull(readPortfolioProjects, 'portfolio projects');
}

const readCategories = unstable_cache(
  async (type: string): Promise<Category[]> =>
    prisma.category.findMany({
      where: { type },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, order: true },
    }),
  ['public-categories'],
  { tags: [CACHE_TAGS.categories], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

/** Filter categories for the portfolio or the journal, in admin order (empty if unavailable). */
export async function getCategories(type: 'portfolio' | 'blog'): Promise<Category[]> {
  return (await orNull(() => readCategories(type), `${type} categories`)) ?? [];
}

const readSocialLinks = unstable_cache(
  async (): Promise<SocialLinkItem[]> =>
    prisma.socialLink.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, platform: true, label: true, url: true },
    }),
  ['public-social-links'],
  { tags: [CACHE_TAGS.socialLinks], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

/** Active footer social links in footer order; the built-in defaults if the database can't be reached. */
export async function getSocialLinks(): Promise<SocialLinkItem[]> {
  return (await orNull(readSocialLinks, 'social links')) ?? DEFAULT_SOCIAL_LINKS;
}

const readTestimonials = unstable_cache(
  async (): Promise<TestimonialRow[]> =>
    prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        quote: true,
        name: true,
        role: true,
        avatar: true,
        logo: true,
        logoWidth: true,
        logoHeight: true,
        rating: true,
      },
    }),
  ['public-testimonials'],
  { tags: [CACHE_TAGS.testimonials], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

/** Featured testimonials in admin order (empty if none or unavailable, so the section keeps its built-in set). */
export async function getTestimonials(): Promise<TestimonialRow[]> {
  return (await orNull(readTestimonials, 'testimonials')) ?? [];
}

const readPartners = unstable_cache(
  async (): Promise<PartnerRow[]> =>
    prisma.partner.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { name: true, logo: true, width: true, height: true },
    }),
  ['public-partners'],
  { tags: [CACHE_TAGS.partners], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

/** Active partner logos in admin order (empty if none or unavailable, so the marquee keeps its built-in set). */
export async function getPartners(): Promise<PartnerRow[]> {
  return (await orNull(readPartners, 'partners')) ?? [];
}
