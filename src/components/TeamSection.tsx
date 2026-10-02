import React from 'react';
import Image from 'next/image';
import { Contact } from 'lucide-react';
import { FadeIn } from '@/components/Animated';
import { assetUrl } from '@/lib/assets';
import type { TeamMemberRow } from '@/lib/publicData';

interface TeamSectionProps {
  members: TeamMemberRow[];
}

/*
 * Team cards need a *consistent* size across the grid — unlike the blog cover
 * images (which read fine at varying heights in a card list), a row of
 * differently-sized headshots looks broken. A fixed box and "never crop a
 * single pixel" can't both hold for arbitrary source photos — with a portrait
 * photo in a landscape-ish box, something has to give. The practical
 * middle ground every team-page does: keep the box fixed at the Figma size,
 * and anchor the crop to the top so a headshot never loses the face — any
 * cropping that does happen trims background/shoulders below, not the head.
 * Ask whoever supplies photos to frame the subject in the upper portion of a
 * roughly 479:442 (near-square, slightly wide) image for the cleanest result.
 */
function MemberCard({ member, sizes, priority, big }: { member: TeamMemberRow; sizes: string; priority?: boolean; big?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-[479/442] rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center">
        {member.photo ? (
          <Image
            src={assetUrl(member.photo)}
            alt={member.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
        ) : (
          <Contact className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
        )}
      </div>
      <div className="text-center mt-5">
        <h3 className={`font-semibold text-[#111827] ${big ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>{member.name}</h3>
        <p className={`text-gray-500 mt-1 ${big ? 'text-sm sm:text-base' : 'text-sm'}`}>{member.designation}</p>
      </div>
    </div>
  );
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  if (members.length === 0) return null;

  // The first (highest-ranked) active member is the large featured card, set by
  // its position in the admin's reorderable list — see src/app/admin/team.
  const [featured, ...rest] = members;

  return (
    <section className="w-full bg-white py-14 sm:py-20">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[13.1%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Intro copy */}
          <FadeIn direction="up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827] mb-5" style={{ lineHeight: '1.1' }}>
              Team Behind the Coral Room
            </h1>
            <p className="text-base sm:text-lg font-medium text-[#111827] mb-4">
              Senior people. Clear ownership. One shared standard.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
              No fluff. No silos. Just smart, creative people working closely together to build websites that
              actually move the needle.
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug mb-5">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#467923] via-[#A7F076] to-[#00C0E8]">
                Real people.{' '}
              </span>
              <span className="text-[#111827]">Clear thinking. Full ownership.</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              We believe better work comes from direct communication, sharp decisions, and teams that stay
              accountable.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              When you work with The Coral Room, you get the people shaping your brand, building your website,
              improving your performance, and growing your digital presence in the same direction.
            </p>
          </FadeIn>

          {/* Featured member */}
          <FadeIn direction="up" delay={0.1}>
            <MemberCard member={featured} sizes="(max-width: 1024px) 100vw, 480px" priority big />
          </FadeIn>
        </div>

        {/* Rest of the team */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16 mt-14 sm:mt-20">
            {rest.map((m, i) => (
              <FadeIn key={m.id} direction="up" delay={Math.min(i * 0.05, 0.3)}>
                <MemberCard member={m} sizes="(max-width: 640px) 100vw, 50vw" />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
