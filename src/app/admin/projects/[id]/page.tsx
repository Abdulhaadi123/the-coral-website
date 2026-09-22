'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { CategorySelect } from '@/components/admin/CategorySelect';
import { VideoListEditor, VideoEntry } from '@/components/admin/VideoListEditor';
import { DetailImagePartsEditor, DetailImagePart } from '@/components/admin/DetailImagePartsEditor';
import { PakistanOnlyToggle } from '@/components/admin/PakistanOnlyToggle';
import { uploadAdminFile } from '@/lib/uploadClient';

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

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Branding');
  const [topBadge, setTopBadge] = useState('Brand Identity');
  const [tagsInput, setTagsInput] = useState('');
  const [bg, setBg] = useState('#111827');
  const [order, setOrder] = useState('0');

  const [image, setImage] = useState('');
  const [detailImages, setDetailImages] = useState<DetailImagePart[]>([]);
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [pakistanOnly, setPakistanOnly] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        const data = await res.json();
        if (data.success && data.project) {
          const p = data.project;
          setTitle(p.title);
          setSlug(p.slug);
          setCategory(p.category);
          setTopBadge(p.topBadge || p.category);
          setTagsInput((p.tags || []).join(', '));
          setBg(p.bg || '#111827');
          setOrder(String(p.order || 0));
          setImage(p.image || '');
          setDetailImages(
            (p.detailImages || [])
              .slice()
              .sort((a: any, b: any) => a.order - b.order)
              .map((d: any) => ({ url: d.url, width: d.width, height: d.height }))
          );
          setPakistanOnly(!!p.pakistanOnly);
          setVideos(
            (p.videos || [])
              .slice()
              .sort((a: any, b: any) => a.order - b.order)
              .map((v: any) => ({ url: v.url, title: v.title }))
          );
        } else {
          setError('Project not found');
        }
      } catch (e: any) {
        setError(e.message || 'Error loading project');
      } finally {
        setInitialLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleThumbUpload = async (file: File) => {
    setUploadingThumb(true);
    setError('');
    try {
      const data = await uploadAdminFile(file, 'coral-room/portfolio');
      setImage(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading image');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          topBadge: topBadge || category,
          tags: tagsArray,
          image,
          detailImages,
          videos: videos
            .filter((v) => v.url.trim() && v.title.trim())
            .map((v, i) => ({ url: v.url.trim(), title: v.title.trim(), order: i })),
          bg: bg || '#111827',
          order: Number(order) || 0,
          pakistanOnly,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update project');

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error updating project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        alert('Failed to delete project');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting project');
    } finally {
      setDeleting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#78B249] animate-spin" />
        <span className="text-sm text-gray-500">Loading project details...</span>
      </div>
    );
  }

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

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting ? 'Deleting...' : 'Delete Project'}</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Edit Project: {title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update case study images, badges, tags, or colors.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fields */}
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
              onChange={(e) => setTitle(e.target.value)}
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
              <CategorySelect value={category} onChange={setCategory} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1 Top Tag (Badge)
              </label>
              <input
                type="text"
                value={topBadge}
                onChange={(e) => setTopBadge(e.target.value)}
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
                <img src={assetUrl(image)} alt="Thumbnail preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-white text-xs font-bold rounded-full shadow hover:bg-gray-100">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleThumbUpload(e.target.files[0])
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
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingThumb}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleThumbUpload(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          {/* Full Page Detail Image */}
          <DetailImagePartsEditor parts={detailImages} onChange={setDetailImages} folder="coral-room/portfolio" />

          {/* Project Videos */}
          <VideoListEditor videos={videos} onChange={setVideos} />

          {/* Pakistan-only */}
          <PakistanOnlyToggle checked={pakistanOnly} onChange={setPakistanOnly} />

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || uploadingThumb}
            className="w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save &amp; Update Live</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
