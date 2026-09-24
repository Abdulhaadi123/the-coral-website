// Shared by the server (API checks), the Edge middleware and the admin UI, so it
// must stay free of any Node/Prisma imports.

export type SectionKey =
  | 'projects'
  | 'categories'
  | 'blog'
  | 'testimonials'
  | 'partners'
  | 'social'
  | 'leads'
  | 'seo'
  | 'sitemap';

export type AdminRole = 'super' | 'editor';

export interface SectionDef {
  key: SectionKey;
  label: string;
  description: string;
  href: string;
}

/** Every admin area a restricted user can be given, in sidebar order. */
export const SECTIONS: SectionDef[] = [
  { key: 'projects', label: 'Portfolio Projects', description: 'Add, edit and delete portfolio case studies and their videos', href: '/admin/projects' },
  { key: 'categories', label: 'Categories', description: 'Manage portfolio and blog categories', href: '/admin/categories' },
  { key: 'blog', label: 'Blog Posts', description: 'Write, edit, publish and delete journal posts', href: '/admin/blog' },
  { key: 'testimonials', label: 'Testimonials', description: 'Manage client reviews', href: '/admin/testimonials' },
  { key: 'partners', label: 'Partner Logos', description: 'Manage the partner logo strip', href: '/admin/partners' },
  { key: 'social', label: 'Social Links', description: 'Manage the footer social icons', href: '/admin/social-links' },
  { key: 'leads', label: 'Leads', description: 'View and delete leads from the portfolio gate and the Book a Discovery Call form', href: '/admin/leads' },
  { key: 'seo', label: 'SEO Settings', description: 'Edit page titles and descriptions, and blog post SEO', href: '/admin/seo' },
  { key: 'sitemap', label: 'Sitemap', description: 'View the auto-generated sitemap', href: '/admin/sitemap' },
];

export const SECTION_KEYS: SectionKey[] = SECTIONS.map((s) => s.key);

export interface AccessUser {
  role?: string | null;
  permissions?: string[] | null;
}

export function isSuper(user: AccessUser | null | undefined): boolean {
  return !!user && user.role === 'super';
}

/** True when the user may use `section` (Super Admins may use everything). */
export function hasPermission(user: AccessUser | null | undefined, section: SectionKey): boolean {
  if (!user) return false;
  if (isSuper(user)) return true;
  return (user.permissions ?? []).includes(section);
}

export function hasAnyPermission(user: AccessUser | null | undefined, sections: SectionKey[]): boolean {
  return sections.some((s) => hasPermission(user, s));
}

/** Keeps only known, de-duplicated section keys — never trust a client-supplied list. */
export function sanitizePermissions(input: unknown): SectionKey[] {
  if (!Array.isArray(input)) return [];
  const valid = new Set<string>(SECTION_KEYS);
  return Array.from(new Set(input.filter((v): v is string => typeof v === 'string' && valid.has(v)))) as SectionKey[];
}

// Matches are anchored on a path boundary, so "/admin/blogger" never counts as "/admin/blog".
const PATH_SECTIONS: { prefix: string; section: SectionKey | 'users' }[] = [
  { prefix: '/admin/projects', section: 'projects' },
  { prefix: '/admin/categories', section: 'categories' },
  { prefix: '/admin/blog', section: 'blog' },
  { prefix: '/admin/testimonials', section: 'testimonials' },
  { prefix: '/admin/partners', section: 'partners' },
  { prefix: '/admin/social-links', section: 'social' },
  { prefix: '/admin/leads', section: 'leads' },
  { prefix: '/admin/seo', section: 'seo' },
  { prefix: '/admin/sitemap', section: 'sitemap' },
  { prefix: '/admin/users', section: 'users' },
];

/**
 * Which permission an /admin page needs. `null` = any signed-in admin
 * (the dashboard and login page), "users" = Super Admins only.
 */
export function sectionForPath(pathname: string): SectionKey | 'users' | null {
  const match = PATH_SECTIONS.find(({ prefix }) => pathname === prefix || pathname.startsWith(prefix + '/'));
  return match ? match.section : null;
}

export function canAccessPath(user: AccessUser | null | undefined, pathname: string): boolean {
  const section = sectionForPath(pathname);
  if (section === null) return !!user;
  if (section === 'users') return isSuper(user);
  return hasPermission(user, section);
}
