'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

const CATEGORIES = [
  'Branding',
  'Packaging',
  'Social Media',
  'Website',
  'Development',
  'Marketing',
  'Ui & UX',
];

const BG_PRESETS = [
  '#111827',
  '#1a1a1a',
  '#0d0d0d',
  '#101820',
  '#180818',
  '#1f1208',
  '#1a1a0d',
  '#0f0d00',
  '#0a0a1a',
  '#201010',
];

export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Branding');
  const [topBadge, setTopBadge] = useState('Brand Identity');
  const [tagsInput, setTagsInput] = useState('');
  const [bg, setBg] = useState('#111827');
  const [order, setOrder] = useState('0');

  const [image, setImage] = useState('');
  const [detailImage, setDetailImage] = useState('');

  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleFileUpload = async (file: File, isThumbnail: boolean) => {
    if (isThumbnail) setUploadingThumb(true);
    else setUploadingDetail(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'coral-room/portfolio');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (isThumbnail) {
        setImage(data.url);
      } else {
        setDetailImage(data.url);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading image to Cloudinary');
    } finally {
      if (isThumbnail) setUploadingThumb(false);
      else setUploadingDetail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload at least the 1st Small Card Thumbnail Image');
      return;
    }

    setSaving(true);
    setError('');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          topBadge: topBadge || category,
          tags: tagsArray,
          image,
          detailImage: detailImage || null,
          bg: bg || '#111827',
          order: Number(order) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create project');

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Create New Portfolio Project</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add 1 small thumbnail image, 1 full detail view image, 1 top tag, and bottom tags.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Elovira Packaging"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              URL Slug *
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#78B249]">
              <span className="bg-gray-50 px-3.5 py-3 text-xs text-gray-500 border-r border-gray-200">
                /portfolio/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="elovira-packaging"
                className="w-full px-4 py-3 text-sm text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Top Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-white cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1 Top Tag (Badge)
              </label>
              <input
                type="text"
                value={topBadge}
                onChange={(e) => setTopBadge(e.target.value)}
                placeholder="Brand Identity"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>
          </div>

          {/* Bottom Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Bottom Tags (Comma-separated)
            </label>
            <p className="text-xs text-gray-400 mb-2">e.g. Olive Oil, Food</p>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Olive Oil, Food"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>

          {/* Background Color with Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Card Background Color
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {BG_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBg(c)}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${
                    bg === c ? 'border-[#78B249] scale-110' : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sort Order (0 = Top)
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>
        </div>

        {/* Right Column: Uploaders */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card Thumbnail */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-[#111827]">1. Card Thumbnail Image *</h2>
              <p className="text-xs text-gray-500">Shown in the Portfolio grid (Aspect ~3:2).</p>
            </div>

            {image ? (
              <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Thumbnail preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-white text-xs font-bold rounded-full shadow hover:bg-gray-100">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFileUpload(e.target.files[0], true)
                      }
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/30">
                {uploadingThumb ? (
                  <Loader2 className="w-6 h-6 text-[#78B249] animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                )}
                <span className="text-xs font-semibold text-gray-600">
                  {uploadingThumb ? 'Uploading...' : 'Click to upload Card Thumbnail'}
                </span>
                <span className="text-[10px] text-gray-400">PNG, WebP, JPG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingThumb}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], true)
                  }
                />
              </label>
            )}
          </div>

          {/* Full Page Detail Image */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-[#111827]">2. Full Detail View Image</h2>
              <p className="text-xs text-gray-500">
                Edge-to-edge showcase graphic when project is opened.
              </p>
            </div>

            {detailImage ? (
              <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detailImage} alt="Detail preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-white text-xs font-bold rounded-full shadow hover:bg-gray-100">
                    Change Detail Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFileUpload(e.target.files[0], false)
                      }
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/30">
                {uploadingDetail ? (
                  <Loader2 className="w-6 h-6 text-[#78B249] animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                )}
                <span className="text-xs font-semibold text-gray-600">
                  {uploadingDetail ? 'Uploading...' : 'Upload Full Detail Image'}
                </span>
                <span className="text-[10px] text-gray-400">High-res WebP / PNG / JPG</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingDetail}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], false)
                  }
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || uploadingThumb || uploadingDetail}
            className="w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Project...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Publish Project Live</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
