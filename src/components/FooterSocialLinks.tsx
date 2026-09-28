'use client';

import React, { createContext, useContext } from 'react';
import { SocialIcon } from '@/components/icons/SocialIcon';
import { DEFAULT_SOCIAL_LINKS, SocialLinkItem } from '@/lib/social';

// The footer sits inside both server and client pages, so the admin-managed
// links come down from the root layout (read on the server, see
// lib/publicData) through context rather than each footer fetching them.
const SocialLinksContext = createContext<SocialLinkItem[]>(DEFAULT_SOCIAL_LINKS);

export function SocialLinksProvider({ links, children }: { links: SocialLinkItem[]; children: React.ReactNode }) {
  return <SocialLinksContext.Provider value={links}>{children}</SocialLinksContext.Provider>;
}

export const FooterSocialLinks: React.FC = () => {
  const links = useContext(SocialLinksContext);

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
