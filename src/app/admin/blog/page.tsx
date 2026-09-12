'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit2, Trash2, Eye, Loader2, Newspaper,
  Check, X as XIcon,
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { BulkActionBar, BulkActionButton, SelectCheckbox } from '@/components/admin/BulkActionBar';

const CATEGORIES = [
  'RevOps',
  'Website Production',
  'Digital Marketing',
  'Online Advertising',
  'Design/UI/UX',
  'Digital',
  'News',
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
      else alert('Delete failed');
    } catch (e) { alert('Error'); } finally { setDeletingId(null); }
  };

  const togglePublished = async (post: any) => {
    setTogglingId(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => (p.id === post.id ? data.post : p)));
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (e) { alert('Error'); } finally { setTogglingId(null); }
  };

  const filtered = posts.filter(p => {
    const q = search.toLowerCase();
    const ms = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.badge.toLowerCase().includes(q);
    const mc = catFilter === 'ALL' || p.category.toLowerCase() === catFilter.toLowerCase();
    return ms && mc;
  });

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
      if (allFilteredSelected) {
        const next = new Set(prev);
        filtered.forEach(p => next.delete(p.id));
        return next;
      }
      const next = new Set(prev);
      filtered.forEach(p => next.add(p.id));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} selected post(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      const ids = Array.from(selected);
      const results = await Promise.all(ids.map(id => fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })));
      const failed = results.filter(r => !r.ok).length;
      setPosts(prev => prev.filter(p => !selected.has(p.id)));
      clearSelection();
      if (failed > 0) alert(`${failed} post(s) failed to delete.`);
    } catch (e) {
      alert('Error deleting selected posts');
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkSetPublished = async (published: boolean) => {
    setBulkBusy(true);
    try {
      const ids = Array.from(selected);
      const results = await Promise.all(ids.map(id =>
        fetch(`/api/admin/blog/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published }),
        })
      ));
      const failed = results.filter(r => !r.ok).length;
      await fetchPosts();
      clearSelection();
      if (failed > 0) alert(`${failed} post(s) failed to update.`);
    } catch (e) {
      alert('Error updating selected posts');
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} posts in database</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" /><span>Add Post</span>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, category or badge..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] placeholder:text-gray-400 shadow-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${catFilter === cat ? 'bg-[#111827] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <BulkActionBar count={selected.size} onClear={clearSelection}>
        <BulkActionButton onClick={() => bulkSetPublished(true)} loading={bulkBusy}>
          <Check className="w-3.5 h-3.5" /> Publish
        </BulkActionButton>
        <BulkActionButton onClick={() => bulkSetPublished(false)} loading={bulkBusy}>
          <XIcon className="w-3.5 h-3.5" /> Unpublish
        </BulkActionButton>
        <BulkActionButton onClick={bulkDelete} loading={bulkBusy} variant="danger">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </BulkActionButton>
      </BulkActionBar>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading posts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
          <Newspaper className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No blog posts found</p>
          <Link href="/admin/blog/new" className="text-xs font-bold text-[#467923] hover:underline">+ Write your first post</Link>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map(p => (
              <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex gap-3.5 items-center transition-colors ${selected.has(p.id) ? 'border-[#78B249] ring-1 ring-[#78B249]/30' : 'border-gray-200'}`}>
                <SelectCheckbox checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} label={`Select ${p.title}`} />
                <div className="w-16 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#111827] text-sm truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400 font-mono truncate">/journal/{p.slug}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                      {p.badge || p.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${p.published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2 pt-2.5 border-t border-gray-100">
                    <Link href={`/journal/${p.slug}`} target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <Link href={`/admin/blog/${p.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title)} disabled={deletingId === p.id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50">
                      {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm table-fixed">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-[44px]">
                    <SelectCheckbox checked={allFilteredSelected} indeterminate={!allFilteredSelected && someFilteredSelected} onChange={toggleSelectAll} label="Select all posts" />
                  </th>
                  <th className="py-4 px-6 w-[88px]">Image</th>
                  <th className="py-4 px-6 w-[320px]">Title</th>
                  <th className="py-4 px-6 w-[160px]">Category</th>
                  <th className="py-4 px-6 w-[110px]">Date</th>
                  <th className="py-4 px-6 w-[110px]">Status</th>
                  <th className="py-4 px-6 text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50/70 transition-colors group ${selected.has(p.id) ? 'bg-[#78B249]/5' : ''}`}>
                    <td className="py-3.5 px-6 align-middle">
                      <SelectCheckbox checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} label={`Select ${p.title}`} />
                    </td>

                    <td className="py-3.5 px-6 align-middle">
                      <div className="w-14 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    <td className="py-3.5 px-6 align-middle">
                      <div className="font-bold text-[#111827] text-sm truncate">{p.title}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">/journal/{p.slug}</div>
                    </td>

                    <td className="py-3.5 px-6 align-middle">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                        {p.badge || p.category || '—'}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 align-middle text-xs text-gray-500 font-medium whitespace-nowrap">
                      {formatDate(p.publishedAt)}
                    </td>

                    <td className="py-3.5 px-6 align-middle">
                      <button
                        onClick={() => togglePublished(p)}
                        disabled={togglingId === p.id}
                        title={p.published ? 'Click to unpublish' : 'Click to publish'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50 ${
                          p.published ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {togglingId === p.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : p.published ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <XIcon className="w-3 h-3" />
                        )}
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3.5 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/journal/${p.slug}`} target="_blank" title="View on live website"
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/blog/${p.id}`} title="Edit post"
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer inline-block">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.title)} disabled={deletingId === p.id} title="Delete post"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer">
                          {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
              Showing {filtered.length} of {posts.length} posts
            </div>
          </div>
        </>
      )}
    </div>
  );
}
