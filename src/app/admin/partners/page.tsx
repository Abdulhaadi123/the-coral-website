'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Handshake,
  EyeOff,
  Eye,
} from 'lucide-react';
import { BulkActionBar, BulkActionButton, SelectCheckbox } from '@/components/admin/BulkActionBar';

interface Partner {
  id: string;
  name: string;
  logo: string;
  width: number;
  height: number;
  active: boolean;
  order: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      if (data.success) setPartners(data.partners);
    } catch (e) {
      console.error('Error loading partners:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from the partner strip? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Error deleting partner');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = partners.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q);
  });

  const liveCount = partners.filter((p) => p.active).length;

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));
  const someFilteredSelected = filtered.some(p => selected.has(p.id));

  const toggleSelectAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach(p => next.delete(p.id));
      else filtered.forEach(p => next.add(p.id));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} selected partner(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      const ids = Array.from(selected);
      const results = await Promise.all(ids.map(id => fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })));
      const failed = results.filter(r => !r.ok).length;
      setPartners(prev => prev.filter(p => !selected.has(p.id)));
      clearSelection();
      if (failed > 0) alert(`${failed} partner(s) failed to delete.`);
    } catch (e) {
      alert('Error deleting selected partners');
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkSetActive = async (active: boolean) => {
    setBulkBusy(true);
    try {
      const ids = Array.from(selected);
      const results = await Promise.all(ids.map(id =>
        fetch(`/api/admin/partners/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active }),
        })
      ));
      const failed = results.filter(r => !r.ok).length;
      await load();
      clearSelection();
      if (failed > 0) alert(`${failed} partner(s) failed to update.`);
    } catch (e) {
      alert('Error updating selected partners');
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Partner Logos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {partners.length} logo{partners.length === 1 ? '' : 's'} in database
            {partners.length > 0 && ` · ${liveCount} showing on the homepage strip`}
          </p>
        </div>
        <Link
          href="/admin/partners/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
        </Link>
      </div>

      {/*
        The homepage falls back to its built-in logo set whenever no active rows
        exist, so an empty (or fully hidden) table never leaves a blank strip.
      */}
      {!loading && liveCount === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2.5">
          <EyeOff className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            No active partners, so the homepage is showing its built-in logo set. Add one or
            switch a row back on to take over the strip.
          </span>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by partner name..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] placeholder:text-gray-400 shadow-sm"
        />
      </div>

      <BulkActionBar count={selected.size} onClear={clearSelection}>
        <BulkActionButton onClick={() => bulkSetActive(true)} loading={bulkBusy}>
          <Eye className="w-3.5 h-3.5" /> Activate
        </BulkActionButton>
        <BulkActionButton onClick={() => bulkSetActive(false)} loading={bulkBusy}>
          <EyeOff className="w-3.5 h-3.5" /> Deactivate
        </BulkActionButton>
        <BulkActionButton onClick={bulkDelete} loading={bulkBusy} variant="danger">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </BulkActionButton>
      </BulkActionBar>

      {/* ── Content ── */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading partners...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Handshake className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No partners found</p>
          <Link href="/admin/partners/new" className="text-xs font-bold text-[#467923] hover:underline">
            + Add your first partner
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card Stack View */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col gap-3 transition-colors ${selected.has(p.id) ? 'border-[#78B249] ring-1 ring-[#78B249]/30' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <SelectCheckbox checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} label={`Select ${p.name}`} />
                  <div className="h-12 w-24 rounded-xl bg-[#2ECE9E] shrink-0 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#111827] truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500">Order {p.order}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      p.active ? 'bg-[#78B249]/15 text-[#467923]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.active ? 'LIVE' : 'HIDDEN'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/partners/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 w-[44px]">
                    <SelectCheckbox checked={allFilteredSelected} indeterminate={!allFilteredSelected && someFilteredSelected} onChange={toggleSelectAll} label="Select all partners" />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Logo</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Partner</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Order</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${selected.has(p.id) ? 'bg-[#78B249]/5' : ''}`}>
                    <td className="px-6 py-4">
                      <SelectCheckbox checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} label={`Select ${p.name}`} />
                    </td>
                    <td className="px-6 py-4">
                      {/* Green tile mirrors the marquee background so white logos stay visible. */}
                      <div className="h-12 w-28 rounded-xl bg-[#2ECE9E] flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#111827]">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.active ? 'bg-[#78B249]/15 text-[#467923]' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.active ? 'LIVE' : 'HIDDEN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/partners/${p.id}`}
                          className="p-2 rounded-lg text-gray-500 hover:text-[#111827] hover:bg-gray-100 transition-colors"
                          title="Edit partner"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete partner"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
