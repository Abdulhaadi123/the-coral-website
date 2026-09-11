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
import { assetUrl } from '@/lib/assets';
import RichTextEditor from '@/components/admin/RichTextEditor';

const CATEGORIES = [
  'RevOps',
  'Website Production',
  'Digital Marketing',
  'Online Advertising',
  'Design/UI/UX',
  'Digital',
  'News',
];

export default function CreateBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Marketing');
  const [category, setCategory] = useState('Digital Marketing');
  const [order, setOrder] = useState('0');
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  const [uploadingCover, setUploadingCover] = useState(false);
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

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'coral-room/journal');

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImage(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload a cover image first.');
      return;
    }
    if (!contentHtml || contentHtml === '<p></p>') {
      setError('Please write the post content.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          subtitle,
          description,
          badge,
          category,
          image,
          contentHtml,
          published,
          order: Number(order) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post');

      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Posts</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Write New Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the post details, upload a cover image, and write the content below.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Post Details */}
          <div className="lg:col-span-7 flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Post Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Create a Social Media Content Strategy in 2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                URL Slug *
              </label>
              <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#78B249]">
                <span className="bg-gray-50 px-3.5 py-3 text-xs text-gray-500 border-r border-gray-200">
                  /journal/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug"
                  className="w-full px-4 py-3 text-sm text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Subtitle
              </label>
              <p className="text-xs text-gray-400 mb-2">Shown under the title on the post page.</p>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Digital tips and tricks to help you grow your business."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Excerpt / Description *
              </label>
              <p className="text-xs text-gray-400 mb-2">Shown on listing cards and used as a fallback subtitle.</p>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short summary of the post…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Marketing"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category
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
            </div>

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

          {/* Right Column: Cover Image + Publish */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">Cover Image *</h2>
                <p className="text-xs text-gray-500">Used on cards and the post hero banner (16:9).</p>
              </div>

              {image ? (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(image)} alt="Cover preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-white text-xs font-bold rounded-full shadow hover:bg-gray-100">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/30">
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 text-[#78B249] animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-xs font-semibold text-gray-600">
                    {uploadingCover ? 'Uploading...' : 'Click to upload cover image'}
                  </span>
                  <span className="text-[10px] text-gray-400">PNG, WebP, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
              <h2 className="text-sm font-bold text-[#111827]">Visibility</h2>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 font-medium">
                  {published ? 'Published — live on the site' : 'Draft — hidden from visitors'}
                </span>
                <button
                  type="button"
                  onClick={() => setPublished((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${published ? 'bg-[#78B249]' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || uploadingCover}
              className="w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Post...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{published ? 'Publish Post Live' : 'Save as Draft'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Full-width Content Editor */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-bold text-[#111827]">Post Content *</h2>
            <p className="text-xs text-gray-500">
              Use the toolbar to format text — bold, italic, headings, lists, links — exactly as it will appear on the live page.
            </p>
          </div>
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </div>
      </form>
    </div>
  );
}
