'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Loader2,
  MessageSquare,
  X,
  UploadCloud,
  Check,
  AlertCircle,
  ChevronDown,
  Quote,
} from 'lucide-react';

function StarRatingSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1.5 p-3 rounded-2xl border border-gray-200 bg-gray-50/50">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating !== null ? hoverRating : value) >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                  : 'text-gray-300 hover:text-amber-200'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-3 text-xs font-bold text-gray-700">
        {value}.0 Star{value !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

const EMPTY_TESTIMONIAL = {
  name: '',
  role: '',
  quote: '',
  rating: 5,
  avatar: '',
  logo: '',
  featured: true,
  order: '0',
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Drawer state for Add/Edit Modal
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_TESTIMONIAL);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (e) {
      console.error('Error fetching testimonials:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_TESTIMONIAL);
    setFormError('');
    setFormSuccess(false);
    setDrawerOpen(true);
  };

  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({
      name: t.name || '',
      role: t.role || '',
      quote: t.quote || '',
      rating: Number(t.rating) || 5,
      avatar: t.avatar || '',
      logo: t.logo || '',
      featured: Boolean(t.featured),
      order: String(t.order ?? 0),
    });
    setFormError('');
    setFormSuccess(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditId(null);
  };

  const setField = (key: string, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleUpload = async (file: File, isAvatar: boolean) => {
    if (isAvatar) setUploadingAvatar(true);
    else setUploadingLogo(true);
    setFormError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'coral-room/testimonials');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (isAvatar) setField('avatar', data.url);
      else setField('logo', data.url);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      if (isAvatar) setUploadingAvatar(false);
      else setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      setFormError('Please provide client name and testimonial quote.');
      return;
    }

    setSaving(true);
    setFormError('');

    const body = {
      name: form.name,
      role: form.role,
      quote: form.quote,
      rating: Number(form.rating) || 5,
      avatar: form.avatar || null,
      logo: form.logo || null,
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    try {
      const res = await fetch(
        editId ? `/api/admin/testimonials/${editId}` : '/api/admin/testimonials',
        {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save testimonial');

      setFormSuccess(true);
      await fetchTestimonials();
      setTimeout(() => {
        closeDrawer();
        setFormSuccess(false);
      }, 800);
    } catch (err: any) {
      setFormError(err.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (e) {
      alert('Error deleting testimonial');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.quote.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Client Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {testimonials.length} reviews published in database
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name, role, company or quote..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <MessageSquare className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No testimonials found</p>
          <button onClick={openAdd} className="text-xs font-bold text-[#467923] hover:underline">
            + Add your first testimonial
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card Stack View */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111827] text-sm truncate">{t.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.role}</p>
                  </div>
                  {t.logo && (
                    <div className="shrink-0 h-7 max-w-[70px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.logo} alt="brand" className="h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Rating & Quote */}
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed italic line-clamp-3">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {t.featured && (
                  <div className="flex">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A7F176]/30 text-[#2b5910]">
                      <Star className="w-2.5 h-2.5 fill-current" /> Displayed on Homepage
                    </span>
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    disabled={deletingId === t.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                  >
                    {deletingId === t.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Client</th>
                  <th className="py-4 px-5">Quote</th>
                  <th className="py-4 px-5 text-center w-24">Rating</th>
                  <th className="py-4 px-5 text-center w-28">Company Logo</th>
                  <th className="py-4 px-5 text-center w-28">Homepage</th>
                  <th className="py-4 px-5 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {t.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              {t.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#111827] text-sm">{t.name}</div>
                          <div className="text-[11px] text-gray-400">{t.role}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 max-w-xs lg:max-w-md">
                      <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span>{t.rating || 5}.0</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      {t.logo ? (
                        <div className="h-7 max-w-[90px] mx-auto inline-flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.logo} alt="Brand logo" className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      {t.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#A7F176]/30 text-[#2b5910]">
                          <Star className="w-3 h-3 fill-current" /> Active
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          title="Edit review"
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={deletingId === t.id}
                          title="Delete review"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          {deletingId === t.id ? (
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
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
              Showing {filtered.length} of {testimonials.length} reviews
            </div>
          </div>
        </>
      )}

      {/* ── RIGHT-SIDE SLIDE DRAWER (ADD / EDIT MODAL) ── */}
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out w-full sm:w-[520px] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              {editId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editId
                ? 'Update client feedback, photo, or brand logo'
                : 'Publish a new client review to the homepage'}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Client Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Qasim Zaman Khan"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Role &amp; Company *
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setField('role', e.target.value)}
                placeholder="COO, Namal Education"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>
          </div>

          {/* Review Quote */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Client Review Quote *
            </label>
            <textarea
              required
              rows={4}
              value={form.quote}
              onChange={(e) => setField('quote', e.target.value)}
              placeholder="Working with The Coral Room transformed how our brand shows up online..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] leading-relaxed resize-none"
            />
          </div>

          {/* Interactive Star Rating Selector (1 - 5) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Star Rating (Click to Select 1 - 5) *
            </label>
            <StarRatingSelector
              value={form.rating}
              onChange={(newRating) => setField('rating', newRating)}
            />
          </div>

          {/* Image Uploaders: Avatar & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Avatar Uploader */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Client Avatar Photo
              </label>
              {form.avatar ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 shrink-0"
                  />
                  <label className="cursor-pointer text-xs font-bold text-[#467923] hover:underline">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], true)}
                    />
                  </label>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors bg-gray-50/50 hover:bg-green-50/20">
                  {uploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-[#78B249] animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs font-semibold text-gray-600">
                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingAvatar}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], true)}
                  />
                </label>
              )}
            </div>

            {/* Brand Logo Uploader */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Brand Logo (Optional)
              </label>
              {form.logo ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logo}
                    alt="logo"
                    className="h-9 max-w-[90px] object-contain shrink-0"
                  />
                  <label className="cursor-pointer text-xs font-bold text-[#467923] hover:underline">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], false)}
                    />
                  </label>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors bg-gray-50/50 hover:bg-green-50/20">
                  {uploadingLogo ? (
                    <Loader2 className="w-5 h-5 text-[#78B249] animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs font-semibold text-gray-600">
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingLogo}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], false)}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Sort Order & Display Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setField('order', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <div
                  onClick={() => setField('featured', !form.featured)}
                  className={`relative rounded-full transition-colors cursor-pointer shrink-0 ${
                    form.featured ? 'bg-[#78B249]' : 'bg-gray-200'
                  }`}
                  style={{ width: 40, height: 22 }}
                >
                  <div
                    className="absolute bg-white rounded-full shadow transition-transform"
                    style={{
                      width: 18,
                      height: 18,
                      top: 2,
                      left: 2,
                      transform: form.featured ? 'translateX(18px)' : 'translateX(0)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700">Display Live</span>
              </label>
            </div>
          </div>
        </form>

        {/* Drawer Footer (Fixed) */}
        <div className="px-6 py-5 border-t border-gray-100 shrink-0 flex gap-3">
          <button
            type="button"
            onClick={closeDrawer}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={saving || uploadingAvatar || uploadingLogo}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {formSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{editId ? 'Update Testimonial' : 'Publish Testimonial'}</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
