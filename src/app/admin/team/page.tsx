'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  Check,
  X,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Contact,
  EyeOff,
} from 'lucide-react';
import { adminAssetUrl } from '@/lib/adminAssets';
import { uploadAdminFile, UploadTooLargeError } from '@/lib/uploadClient';

interface TeamMemberRow {
  id: string;
  name: string;
  designation: string;
  photo: string | null;
  active: boolean;
  order: number;
}

const EMPTY_FORM = { name: '', designation: '', photo: '' as string, active: true };

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [oversizedPhoto, setOversizedPhoto] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/team', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load team members');
      setMembers(data.team);
    } catch (err: any) {
      setError(err.message || 'Error loading team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, active: true });
    setFormError('');
    setOversizedPhoto(null);
    setDrawerOpen(true);
  };

  const openEdit = (m: TeamMemberRow) => {
    setEditId(m.id);
    setForm({ name: m.name, designation: m.designation, photo: m.photo || '', active: m.active });
    setFormError('');
    setOversizedPhoto(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (saving) return;
    setDrawerOpen(false);
    setEditId(null);
  };

  const handlePhotoUpload = async (file: File, allowOverride = false) => {
    setUploading(true);
    setFormError('');
    setOversizedPhoto(null);
    try {
      const uploaded = await uploadAdminFile(file, 'coral-room/team', { kind: 'image', allowOverride });
      setForm((f) => ({ ...f, photo: uploaded.url }));
    } catch (err: any) {
      setFormError(err.message || 'Error uploading photo');
      if (err instanceof UploadTooLargeError && err.overridable) setOversizedPhoto(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim()) {
      setFormError('Please provide a name and designation.');
      return;
    }

    setSaving(true);
    setFormError('');

    const body = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      photo: form.photo || null,
      active: form.active,
      ...(editId ? {} : { order: members.length }),
    };

    try {
      const res = await fetch(editId ? `/api/admin/team/${editId}` : '/api/admin/team', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save team member');

      await load();
      setDrawerOpen(false);
      setEditId(null);
    } catch (err: any) {
      setFormError(err.message || 'Error saving team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: TeamMemberRow) => {
    if (!confirm(`Remove ${m.name} from the About Us page? This cannot be undone.`)) return;
    setDeletingId(m.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setMembers((prev) => prev.filter((row) => row.id !== m.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting team member');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (m: TeamMemberRow) => {
    const next = !m.active;
    setMembers((prev) => prev.map((row) => (row.id === m.id ? { ...row, active: next } : row)));
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch {
      setMembers((prev) => prev.map((row) => (row.id === m.id ? { ...row, active: m.active } : row)));
      setError('Error updating visibility');
    }
  };

  /** First active member gets the big featured card on the About page — see TeamSection.tsx. */
  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= members.length || reordering) return;

    const next = [...members];
    [next[index], next[target]] = [next[target], next[index]];
    setMembers(next);
    setReordering(true);

    try {
      await Promise.all(
        next.map((m, i) =>
          fetch(`/api/admin/team/${m.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: i }),
          })
        )
      );
      await load();
    } catch {
      setError('Error reordering team members');
      await load();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Team (About Us)</h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} member{members.length === 1 ? '' : 's'} · the first one is the featured card at the top of{' '}
            <span className="font-semibold">/about</span>
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
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
          <p className="text-sm text-gray-500">Loading team...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Contact className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No team members yet</p>
          <button type="button" onClick={openAdd} className="text-xs font-bold text-[#467923] hover:underline cursor-pointer">
            + Add your first team member
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {members.map((m, index) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border shadow-sm p-3.5 flex items-center gap-3.5 transition-colors ${
                m.active ? 'border-gray-200' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={adminAssetUrl(m.photo)} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <Contact className="w-6 h-6 text-gray-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111827] truncate">{m.name}</h3>
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#78B249]/15 text-[#467923] shrink-0">
                      FEATURED
                    </span>
                  )}
                  {!m.active && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 shrink-0">HIDDEN</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{m.designation}</p>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || reordering}
                  aria-label="Move up"
                  className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === members.length - 1 || reordering}
                  aria-label="Move down"
                  className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(m)}
                  aria-label={m.active ? 'Hide from About page' : 'Show on About page'}
                  className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title={m.active ? 'Showing on About page' : 'Hidden from About page'}
                >
                  <EyeOff className={`w-4 h-4 ${m.active ? 'opacity-40' : 'opacity-100 text-[#467923]'}`} />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(m)}
                  aria-label="Edit"
                  className="p-2 text-gray-400 hover:text-[#111827] cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m)}
                  disabled={deletingId === m.id}
                  aria-label="Delete"
                  className="p-2 text-gray-400 hover:text-red-600 cursor-pointer disabled:opacity-50"
                >
                  {deletingId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative w-full sm:w-[440px] bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#111827]">{editId ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button type="button" onClick={closeDrawer} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex flex-wrap items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                  {oversizedPhoto && (
                    <button
                      type="button"
                      onClick={() => handlePhotoUpload(oversizedPhoto, true)}
                      className="font-bold underline hover:no-underline cursor-pointer"
                    >
                      Upload anyway
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                    {form.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={adminAssetUrl(form.photo)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Contact className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span>{uploading ? 'Uploading...' : form.photo ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/webp"
                      disabled={uploading}
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">WebP only, 550KB max. Optional — a placeholder shows until one is added.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Shaheer Hassan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Designation *</label>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. The One Behind the Direction"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <div
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`relative rounded-full transition-colors cursor-pointer shrink-0 ${form.active ? 'bg-[#78B249]' : 'bg-gray-200'}`}
                  style={{ width: 40, height: 22 }}
                >
                  <div
                    className="absolute bg-white rounded-full shadow transition-transform"
                    style={{ width: 18, height: 18, top: 2, left: 2, transform: form.active ? 'translateX(18px)' : 'translateX(0)' }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700">Show on About Us page</span>
              </label>

              <button
                type="submit"
                disabled={saving || uploading}
                className="mt-2 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editId ? 'Save Changes' : 'Add Team Member'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
