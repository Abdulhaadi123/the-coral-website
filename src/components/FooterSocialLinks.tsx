'use client';

import React, { useEffect, useState } from 'react';
import { SocialIcon } from '@/components/icons/SocialIcon';
import { DEFAULT_SOCIAL_LINKS, SocialLinkItem } from '@/lib/social';

// Kept for the rest of the visit so client-side page changes paint the
// saved list immediately instead of flashing the defaults again.
let cachedLinks: SocialLinkItem[] | null = null;

export const FooterSocialLinks: React.FC = () => {
  // A hard load hydrates from the defaults (matching the server HTML); only
  // later, client-only mounts can start from the cached admin-managed list.
  const [links, setLinks] = useState<SocialLinkItem[]>(() => cachedLinks ?? DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    fetch('/api/social-links')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.links)) {
          cachedLinks = data.links;
          setLinks(data.links);
        }
      })
      .catch(() => {});
  }, []);

  if (links.length === 0) return null;

  // Up to four icons per row so a growing list wraps neatly instead of shrinking.
  const columns = Math.min(links.length, 4);

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className="bg-[#171717] rounded-2xl flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300"
          style={{ width: '100%', aspectRatio: '168/156' }}
        >
          <SocialIcon platform={link.platform} />
        </a>
      ))}
    </div>
  );
};

export default FooterSocialLinks;
