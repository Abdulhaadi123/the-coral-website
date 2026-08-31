'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit2, Trash2, Eye, Loader2, FolderOpen,
  X, UploadCloud, ChevronDown, Check, AlertCircle,
} from 'lucide-react';

const CATEGORIES = ['Branding', 'Packaging', 'Social Media', 'Website', 'Development', 'Marketing', 'Ui & UX'];
const BG_PRESETS = ['#111827','#1a1a1a','#0d0d0d','#101820','#180818','#1f1208','#1a1a0d','#0f0d00','#0a0a1a','#201010'];

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#78B249] cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function ImageUploader({ url, onUpload, uploading, label, hint }: {
  url: string; onUpload: (f: File) => void; uploading: boolean; label: string; hint: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</p>
      {url ? (
        <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer px-4 py-2 bg-white text-xs font-bold rounded-full shadow hover:bg-gray-100">
              Change Image
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
            </label>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-gray-50/50 hover:bg-green-50/20">
          {uploading ? <Loader2 className="w-5 h-5 text-[#78B249] animate-spin" /> : <UploadCloud className="w-5 h-5 text-gray-400" />}
          <span className="text-xs font-semibold text-gray-600">{uploading ? 'Uploading...' : 'Click to upload'}</span>
          <span className="text-[10px] text-gray-400">{hint}</span>
          <input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>
      )}
    </div>
  );
}

const EMPTY_FORM = { title: '', slug: '', category: 'Branding', topBadge: '', tagsInput: '', bg: '#111827', order: '0', image: '', detailImage: '' };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormSuccess(false);
    setDrawerOpen(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'Branding',
      topBadge: p.topBadge || '',
      tagsInput: (p.tags || []).join(', '),
      bg: p.bg || '#111827',
      order: String(p.order ?? 0),
      image: p.image || '',
      detailImage: p.detailImage || '',
    });
    setFormError('');
    setFormSuccess(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditId(null); };

  const setField = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const handleTitleChange = (val: string) => {
    setField('title', val);
    setField('slug', val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
  };

  const handleUpload = async (file: File, isThumb: boolean) => {
    if (isThumb) setUploadingThumb(true); else setUploadingDetail(true);
    setFormError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'coral-room/portfolio');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (isThumb) setField('image', data.url); else setField('detailImage', data.url);
    } catch (err: any) {
      setFormError(err.message || 'Upload error');
    } finally {
      if (isThumb) setUploadingThumb(false); else setUploadingDetail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) { setFormError('Please upload the card thumbnail image first.'); return; }
    setSaving(true); setFormError('');
    const body = {
      title: form.title, slug: form.slug, category: form.category,
      topBadge: form.topBadge || form.category,
      tags: form.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      image: form.image, detailImage: form.detailImage || null,
      bg: form.bg, order: Number(form.order) || 0,
    };
    try {
      const res = await fetch(
        editId ? `/api/admin/projects/${editId}` : '/api/admin/projects',
        { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setFormSuccess(true);
      await fetchProjects();
      setTimeout(() => { closeDrawer(); setFormSuccess(false); }, 900);
    } catch (err: any) {
      setFormError(err.message || 'Error saving project');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
      else alert('Delete failed');
    } catch (e) { alert('Error'); } finally { setDeletingId(null); }
  };

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const ms = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.tags || []).some((t: string) => t.toLowerCase().includes(q));
    const mc = catFilter === 'ALL' || p.category.toLowerCase() === catFilter.toLowerCase();
    return ms && mc;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Portfolio Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} projects in database</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" /><span>Add Project</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, category or tag..."
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

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
          <FolderOpen className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No projects found</p>
          <button onClick={openAdd} className="text-xs font-bold text-[#467923] hover:underline">+ Add your first project</button>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex gap-3.5 items-center">
                <div className="w-16 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#111827] text-sm truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400 font-mono truncate">/portfolio/{p.slug}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                      {p.category}
                    </span>
                    {(p.tags || []).slice(0, 2).map((t: string) => (
                      <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 border border-gray-200 text-gray-500 whitespace-nowrap">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2 pt-2.5 border-t border-gray-100">
                    <Link href={`/portfolio/${p.slug}`} target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button onClick={() => openEdit(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id, p.title)} disabled={deletingId === p.id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50">
                      {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table — Pixel-Perfect Centered Alignment */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm table-fixed">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-[88px]">Image</th>
                  <th className="py-4 px-6 w-[280px]">Title</th>
                  <th className="py-4 px-6 w-[160px]">Category</th>
                  <th className="py-4 px-6">Tags</th>
                  <th className="py-4 px-6 text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Image */}
                    <td className="py-3.5 px-6 align-middle">
                      <div className="w-14 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-6 align-middle">
                      <div className="font-bold text-[#111827] text-sm truncate">{p.title}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">/portfolio/{p.slug}</div>
                    </td>

                    {/* Category (Always Single Line with whitespace-nowrap) */}
                    <td className="py-3.5 px-6 align-middle">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                        {p.category}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-6 align-middle">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(p.tags || []).slice(0, 3).map((t: string) => (
                          <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-600 whitespace-nowrap">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/portfolio/${p.slug}`} target="_blank" title="View on live website"
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openEdit(p)} title="Edit project"
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.title)} disabled={deletingId === p.id} title="Delete project"
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
              Showing {filtered.length} of {projects.length} projects
            </div>
          </div>
        </>
      )}

      {/* ── RIGHT SIDE DRAWER ── */}
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out w-full sm:w-[520px] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">{editId ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{editId ? 'Update project details and images' : 'Fill in the details to publish a new project'}</p>
          </div>
          <button onClick={closeDrawer} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form — Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />{formError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Project Title *</label>
            <input type="text" required value={form.title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="e.g. Elovira Packaging"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]" />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">URL Slug *</label>
            <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#78B249]">
              <span className="bg-gray-50 px-3 py-3 text-xs text-gray-400 border-r border-gray-200 whitespace-nowrap">/portfolio/</span>
              <input type="text" required value={form.slug} onChange={e => setField('slug', e.target.value)}
                className="w-full px-4 py-3 text-sm focus:outline-none" />
            </div>
          </div>

          {/* Category + Top Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Category *</label>
              <SelectField value={form.category} onChange={v => setField('category', v)} options={CATEGORIES} label="" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Top Badge</label>
              <input type="text" value={form.topBadge} onChange={e => setField('topBadge', e.target.value)}
                placeholder="Brand Identity"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Bottom Tags</label>
            <p className="text-[11px] text-gray-400 mb-1.5">Comma separated — e.g. Olive Oil, Food</p>
            <input type="text" value={form.tagsInput} onChange={e => setField('tagsInput', e.target.value)}
              placeholder="Olive Oil, Food"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]" />
          </div>

          {/* Card Thumbnail */}
          <ImageUploader
            url={form.image}
            onUpload={f => handleUpload(f, true)}
            uploading={uploadingThumb}
            label="1. Card Thumbnail Image *"
            hint="Shown in portfolio grid · PNG / WebP / JPG"
          />

          {/* Detail Image */}
          <ImageUploader
            url={form.detailImage}
            onUpload={f => handleUpload(f, false)}
            uploading={uploadingDetail}
            label="2. Full Detail Page Image"
            hint="Edge-to-edge showcase when project is opened"
          />

          {/* BG Color */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Card Background Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {BG_PRESETS.map(c => (
                <button key={c} type="button" onClick={() => setField('bg', c)}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${form.bg === c ? 'border-[#78B249] scale-110' : 'border-transparent hover:border-gray-300'}`}
                  style={{ background: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={form.bg} onChange={e => setField('bg', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
              <input type="text" value={form.bg} onChange={e => setField('bg', e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#78B249]" />
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input type="number" value={form.order} onChange={e => setField('order', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]" />
          </div>

        </form>

        {/* Drawer Footer — Fixed */}
        <div className="px-6 py-5 border-t border-gray-100 shrink-0 flex gap-3">
          <button type="button" onClick={closeDrawer}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={saving || uploadingThumb || uploadingDetail}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {formSuccess ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Check className="w-4 h-4" /> {editId ? 'Update Project' : 'Publish Project'}</>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
