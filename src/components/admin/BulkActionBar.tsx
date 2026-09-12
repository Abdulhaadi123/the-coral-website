'use client';

import React from 'react';
import { X } from 'lucide-react';

export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111827] text-white shadow-lg">
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold">{count} selected</span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function BulkActionButton({
  onClick,
  disabled,
  loading,
  variant = 'default',
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'danger';
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap ${
        variant === 'danger'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

/** Checkbox used in table header cells and mobile card corners — larger hit target than a bare <input>. */
export function SelectCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label || 'Select item'}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4 rounded border-gray-300 text-[#78B249] focus:ring-[#78B249] cursor-pointer accent-[#78B249]"
    />
  );
}

export default BulkActionBar;
