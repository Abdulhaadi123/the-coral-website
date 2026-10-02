'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, AlertCircle, Users, ArrowLeft } from 'lucide-react';

interface ListRow {
  id: string;
  name: string;
  createdAt: string;
  contactCount: number;
}

export default function AdminEmailListsPage() {
  const [lists, setLists] = useState<ListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/email/lists', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load lists');
      setLists(data.lists);
    } catch (err: any) {
      setError(err.message || 'Error loading lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (list: ListRow) => {
    if (!confirm(`Delete "${list.name}" and its ${list.contactCount} contact(s)? This cannot be undone.`)) return;
    setDeletingId(list.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/email/lists/${list.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setLists((prev) => prev.filter((l) => l.id !== list.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting list');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <Link href="/admin/email" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Email Marketing</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Contact Lists</h1>
          <p className="text-sm text-gray-500 mt-1">{lists.length} list{lists.length === 1 ? '' : 's'}</p>
        </div>
        <Link
          href="/admin/email/lists/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Upload List</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading lists...</p>
        </div>
      ) : lists.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Users className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No contact lists yet</p>
          <Link href="/admin/email/lists/new" className="text-xs font-bold text-[#467923] hover:underline">
            + Upload your first list
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {lists.map((list) => (
            <div key={list.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#78B249]/15 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#467923]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#111827] truncate">{list.name}</h3>
                <p className="text-xs text-gray-500">
                  {list.contactCount} contact{list.contactCount === 1 ? '' : 's'} · uploaded{' '}
                  {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/admin/email/lists/${list.id}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(list)}
                disabled={deletingId === list.id}
                className="p-2 text-gray-400 hover:text-red-600 cursor-pointer disabled:opacity-50 shrink-0"
                aria-label="Delete list"
              >
                {deletingId === list.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
