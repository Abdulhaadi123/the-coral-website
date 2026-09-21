'use client';

import React from 'react';
import { Globe2 } from 'lucide-react';

interface PakistanOnlyToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
}

/** Per-project switch: when on, only visitors from Pakistan can see this project. */
export const PakistanOnlyToggle: React.FC<PakistanOnlyToggleProps> = ({ checked, onChange }) => (
  <div
    className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
      checked ? 'border-[#78B249] bg-[#78B249]/5' : 'border-gray-200 bg-white'
    }`}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-[#111827] text-[#9FE66F]' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <Globe2 className="w-5 h-5" />
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#111827]">Pakistan-only project</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {checked
          ? 'ON — only visitors from Pakistan can see or open this project. Everyone else won’t see it in the portfolio.'
          : 'OFF — this project is visible to visitors from every country.'}
      </p>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Pakistan-only project"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
        checked ? 'bg-[#78B249]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default PakistanOnlyToggle;
