import React from 'react';
import { Globe } from 'lucide-react';
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconYoutube,
  IconXTwitter,
  IconTiktok,
} from '@/components/icons/Icons';

/** White brand glyph for a social platform key; unknown/"other" falls back to a globe. */
export const SocialIcon: React.FC<{ platform: string; className?: string }> = ({ platform, className }) => {
  switch (platform) {
    case 'facebook':
      return <IconFacebook className={className} />;
    case 'instagram':
      return <IconInstagram className={className} />;
    case 'linkedin':
      return <IconLinkedin className={className} />;
    case 'youtube':
      return <IconYoutube className={className} />;
    case 'x':
      return <IconXTwitter className={className} />;
    case 'tiktok':
      return <IconTiktok className={className} />;
    default:
      return <Globe className={className} width={30} height={30} strokeWidth={1.6} color="white" />;
  }
};

export default SocialIcon;
