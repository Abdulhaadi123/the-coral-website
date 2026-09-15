'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCategories } from '@/lib/useCategories';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'portfolio' | 'blog';
  className?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, type = 'portfolio', className }) => {
  const categories = useCategories(type);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          className ||
          'w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-white cursor-pointer'
        }
      >
        {categories.length === 0 && value && <option value={value}>{value}</option>}
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default CategorySelect;
