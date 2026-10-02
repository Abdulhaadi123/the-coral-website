'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Contact {
  id: string;
  email: string;
  name: string | null;
  valid: boolean;
  createdAt: string;
}

interface ListDetail {
  id: string;
  name: string;
  createdAt: string;
  contacts: Contact[];
}

export default function EmailListDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [list, setList] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/email/lists/${id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load list');
        setList(data.list);
      } catch (err: any) {
        setError(err.message || 'Error loading list');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validCount = list?.contacts.filter((c) => c.valid).length ?? 0;
  const invalidCount = list ? list.contacts.length - validCount : 0;
  const visible = list?.contacts.filter((c) => (filter === 'all' ? true : filter === 'valid' ? c.valid : !c.valid)) ?? [];

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl">
      <Link href="/admin/email/lists" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lists</span>
      </Link>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : list ? (
        <>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{list.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {list.contacts.length} contact{list.contacts.length === 1 ? '' : 's'} · uploaded{' '}
              {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'valid', 'invalid'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  filter === f ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? `All (${list.contacts.length})` : f === 'valid' ? `Valid (${validCount})` : `Invalid (${invalidCount})`}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
              {visible.length === 0 ? (
                <p className="p-6 text-sm text-gray-500 text-center">No contacts match this filter.</p>
              ) : (
                visible.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                    {c.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-[#78B249] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.email}</p>
                      {c.name && <p className="text-xs text-gray-500 truncate">{c.name}</p>}
                    </div>
                    {!c.valid && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 shrink-0">
                        INVALID FORMAT
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
