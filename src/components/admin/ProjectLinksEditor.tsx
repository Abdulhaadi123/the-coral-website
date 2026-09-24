'use client';

import React from 'react';
import { ExternalLink, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseExternalUrl } from '@/lib/externalUrl';

interface ProjectLinksEditorProps {
  exploreUrl: string;
  cardLink: string;
  onExploreUrlChange: (value: string) => void;
  onCardLinkChange: (value: string) => void;
  /** Whether the project currently has at least one complete video (url + title). */
  hasVideos: boolean;
}

/** One link field with live validation feedback. */
const LinkField: React.FC<{
  id: string;
  icon: React.ReactNode;
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, icon, label, help, value, onChange }) => {
  const parsed = parseExternalUrl(value);
  const typed = value.trim() !== '';
  const invalid = typed && !parsed.ok;
  // A bare domain is accepted and saved with https:// in front — say so, so it is never a surprise.
  const willSaveAs = parsed.ok && parsed.url !== '' && parsed.url !== value.trim() ? parsed.url : null;

  return (
    <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col gap-2.5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <label htmlFor={id} className="block text-sm font-bold text-[#111827]">
            {label}
          </label>
          <p className="text-xs text-gray-500 mt-0.5">{help}</p>
        </div>
      </div>

      <input
        id={id}
        type="text"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://clientwebsite.com"
        aria-invalid={invalid}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 ${
          invalid ? 'border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-[#78B249]'
        }`}
      />

      {invalid && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Enter a valid website address, e.g. https://clientwebsite.com
        </p>
      )}
      {willSaveAs && (
        <p className="text-xs text-gray-500 flex items-center gap-1.5 break-all">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#78B249]" />
          Will be saved as {willSaveAs}
        </p>
      )}
    </div>
  );
};

/**
 * Per-project website links. Both are optional and independent — leaving one
 * empty switches that behaviour off for the project.
 */
export const ProjectLinksEditor: React.FC<ProjectLinksEditorProps> = ({
  exploreUrl,
  cardLink,
  onExploreUrlChange,
  onCardLinkChange,
  hasVideos,
}) => {
  const exploreSet = parseExternalUrl(exploreUrl).ok && exploreUrl.trim() !== '';
  const cardSet = parseExternalUrl(cardLink).ok && cardLink.trim() !== '';

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold text-[#111827]">4. Website Links (optional)</h2>
        <p className="text-xs text-gray-500">
          Send visitors to the client&apos;s own website. Leave a field empty to keep the normal
          behaviour for this project.
        </p>
      </div>

      <LinkField
        id="project-explore-url"
        icon={<ExternalLink className="w-4 h-4" />}
        label="“Explore Project” button link"
        help="Adds an Explore Project button inside this project's video popup. Only appears when the project has a video."
        value={exploreUrl}
        onChange={onExploreUrlChange}
      />

      <LinkField
        id="project-card-link"
        icon={<Link2 className="w-4 h-4" />}
        label="Card click link"
        help="Clicking this project's card in the portfolio opens this website directly (new tab) — no popup and no detail page."
        value={cardLink}
        onChange={onCardLinkChange}
      />

      {exploreSet && !hasVideos && (
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-px text-amber-500" />
          <span>
            This project has no video yet, so the Explore Project button has nowhere to appear. Add a
            video above.
          </span>
        </p>
      )}

      {exploreSet && cardSet && (
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-px text-amber-500" />
          <span>
            The card click link is also set, so clicking the card goes straight to the website and the
            video popup (with its Explore Project button) is never opened from the portfolio. Use one or
            the other.
          </span>
        </p>
      )}
    </div>
  );
};

export default ProjectLinksEditor;
