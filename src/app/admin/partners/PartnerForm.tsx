'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Loader2, Check, AlertCircle } from 'lucide-react';

export interface PartnerFormValues {
  name: string;
  logo: string;
  width: number;
  height: number;
  active: boolean;
  order: number;
}

interface Props {
  /** Existing row id. Omit to create. */
  id?: string;
  initial?: Partial<PartnerFormValues>;
}

export default function PartnerForm({ id, initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const [name, setName] = useState(initial?.name ?? '');
  const [logo, setLogo] = useState(initial?.logo ?? '');
  // Intrinsic size for next/image. The marquee sizes by CSS height, so this only
  // fixes the aspect ratio — the original logo set is 183x110.
  const [width, setWidth] = useState(String(initial?.width ?? 183));
  const [height, setHeight] = useState(String(initial?.height ?? 110));
  const [active, setActive] = useState(initial?.active ?? true);
  const [order, setOrder] = useState(String(initial?.order ?? 0));

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'coral-room/partners');

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setLogo(data.url);

      // Read the real pixel size so the aspect ratio matches the file the admin
      // picked, rather than leaving the 183x110 default on a differently shaped logo.
      const img = new window.Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setWidth(String(img.naturalWidth));
          setHeight(String(img.naturalHeight));
        }
      };
      img.src = data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logo) {
      setError('Please upload a logo image first.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(isEdit ? `/api/admin/partners/${id}` : '/api/admin/partners', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          logo,
          width: Number(width) || 183,
          height: Number(height) || 110,
          active,
          order: Number(order) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save partner');

      router.push('/admin/partners');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error saving partner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/partners"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partners</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
          {isEdit ? 'Edit Partner' : 'Add Partner Logo'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Logos appear in the scrolling strip on the homepage. Use a transparent PNG or SVG in
          white — the strip has a green background.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-6"
      >
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Partner Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Crewtix"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
          />
          <p className="text-xs text-gray-400 mt-1.5">Used as the image alt text.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Logo Image *
          </label>
          {logo ? (
            <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 bg-gray-50">
              {/* Preview sits on the marquee's green so white logos are visible. */}
              <div className="h-16 w-40 rounded-xl bg-[#2ECE9E] flex items-center justify-center p-3 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
              </div>
              <label className="cursor-pointer text-xs font-bold text-[#467923] hover:underline">
                {uploading ? 'Uploading...' : 'Change Logo'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/20">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-[#78B249] animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-xs font-semibold text-gray-600">
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Intrinsic Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Intrinsic Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-4">
          Filled in automatically from the uploaded file. The strip sizes every logo to the same
          height, so these only set the aspect ratio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sort Order (0 = First)
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>

          <div className="flex flex-col justify-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div
                onClick={() => setActive(!active)}
                className={`relative rounded-full transition-colors cursor-pointer shrink-0 ${
                  active ? 'bg-[#78B249]' : 'bg-gray-200'
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
                    transform: active ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700">Show on Homepage</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="mt-4 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEdit ? 'Saving Partner...' : 'Publishing Partner...'}</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Publish Partner'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
