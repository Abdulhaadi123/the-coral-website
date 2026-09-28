import { getCategories, getPortfolioProjects } from '@/lib/publicData';
import { shouldHidePakistanOnly } from '@/lib/geo';
import { projects as sampleProjects } from './data';
import PortfolioPageClient from './PortfolioPageClient';

// The grid is rendered here on the server instead of the browser fetching it
// from an API, so there is no public data URL to copy. It depends on who is
// asking (Pakistan-only projects are hidden from visitors abroad), so it is
// rendered per request; the data itself comes from the cache (lib/publicData).
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const [allProjects, categories, hidePakistanOnly] = await Promise.all([
    getPortfolioProjects(),
    getCategories('portfolio'),
    shouldHidePakistanOnly(),
  ]);

  // Built-in sample projects only when the database is empty or unreachable. When
  // projects were deliberately hidden (Pakistan-only), an empty grid is correct.
  let projects = sampleProjects;
  if (allProjects) {
    const visible = hidePakistanOnly ? allProjects.filter((p) => !p.pakistanOnly) : allProjects;
    if (visible.length > 0 || hidePakistanOnly) {
      projects = visible.map(({ pakistanOnly, ...card }) => card);
    }
  }

  return <PortfolioPageClient projects={projects} categories={categories} />;
}
