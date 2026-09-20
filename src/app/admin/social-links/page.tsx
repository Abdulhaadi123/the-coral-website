'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  Share2,
  AlertCircle,
  Check,
  X,
  Pencil,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from 'lucide-react';
import { SocialIcon } from '@/components/icons/SocialIcon';
import { SOCIAL_PLATFORMS, platformLabel } from '@/lib/social';

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  active: boolean;
  order: number;
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-white';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newPlatform, setNewPlatform] = useState('youtube');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlatform, setEditPlatform] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      if (data.success) setLinks(data.links);
    } catch (e) {
      console.error('Error loading social links:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch('/api/admin/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: newPlatform, url: newUrl, label: newLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add link');
      setLinks((prev) => [...prev, data.link]);
      setNewUrl('');
      setNewLabel('');
    } catch (err: any) {
      setError(err.message || 'Error adding link');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setEditPlatform(link.platform);
    setEditUrl(link.url);
    setEditLabel(link.platform === 'other' ? link.label : '');
    setError('');
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    if (!editUrl.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: editPlatform, url: editUrl, label: editLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save link');
      setLinks((prev) => prev.map((l) => (l.id === id ? data.link : l)));
      cancelEdit();
    } catch (err: any) {
      setError(err.message || 'Error saving link');
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (link: SocialLink) => {
    setTogglingId(link.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/social-links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !link.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update link');
      setLinks((prev) => prev.map((l) => (l.id === link.id ? data.link : l)));
    } catch (err: any) {
      setError(err.message || 'Error updating link');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (link: SocialLink) => {
    if (!confirm(`Remove ${link.label || platformLabel(link.platform)} from the footer?`)) return;
    setDeletingId(link.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/social-links/${link.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete link');
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting link');
    } finally {
      setDeletingId(null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;

    const reordered = [...links];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setLinks(reordered);

    try {
      await Promise.all(
        reordered.map((l, i) =>
          fetch(`/api/admin/social-links/${l.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: i }),
          })
        )
      );
    } catch (e) {
      console.error('Error saving new order:', e);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Social Links</h1>
        <p className="text-sm text-gray-500 mt-1">
          The icons shown in the website footer. Add a profile and it appears there automatically —
          no code changes needed.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Add new link */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm"
      >
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add a profile</p>
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://www.youtube.com/@yourchannel"
            className={inputClass}
          />
        </div>
        {newPlatform === 'other' && (
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Name for this link (e.g. Behance)"
            className={inputClass}
          />
        )}
        <button
          type="submit"
          disabled={adding || !newUrl.trim()}
          className="self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Add to footer</span>
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading social links...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <Share2 className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No social links — the footer shows no icons</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {links.map((link, index) => (
            <div key={link.id} className="px-4 sm:px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col shrink-0">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === links.length - 1}
                    aria-label="Move down"
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl bg-[#171717] flex items-center justify-center shrink-0 ${
                    link.active ? '' : 'opacity-40'
                  }`}
                >
                  <SocialIcon platform={link.platform} className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111827] truncate">
                      {link.label || platformLabel(link.platform)}
                    </span>
                    {!link.active && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 shrink-0">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#467923] max-w-full"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => toggleActive(link)}
                  disabled={togglingId === link.id}
                  aria-label={link.active ? 'Hide from footer' : 'Show in footer'}
                  title={link.active ? 'Shown in footer — click to hide' : 'Hidden — click to show'}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
                    link.active ? 'bg-[#78B249]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      link.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(link)}
                  title="Edit"
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link)}
                  disabled={deletingId === link.id}
                  title="Delete"
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deletingId === link.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {editingId === link.id && (
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
                    <select
                      value={editPlatform}
                      onChange={(e) => setEditPlatform(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {editPlatform === 'other' && (
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Name for this link (e.g. Behance)"
                      className={inputClass}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(link.id)}
                      disabled={savingId === link.id || !editUrl.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#111827] hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      {savingId === link.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
