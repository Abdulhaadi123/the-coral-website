'use client';

import React, { useEffect, useState } from 'react';
import { UploadCloud, Loader2, Check, AlertCircle, RotateCcw, Film } from 'lucide-react';
import { adminAssetUrl } from '@/lib/adminAssets';
import { uploadAdminFile } from '@/lib/uploadClient';

export default function AdminHomepagePage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/homepage-video', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load the current video');
      setVideoUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Error loading the current video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      // No `kind` — the 150KB/550KB WebP image rules don't apply to video uploads.
      const uploaded = await uploadAdminFile(file, 'coral-room/homepage');

      const res = await fetch('/api/admin/homepage-video', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploaded.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save the video');

      setVideoUrl(data.url);
      setSuccess('Homepage banner video updated — live now.');
    } catch (err: any) {
      setError(err.message || 'Error uploading the video');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Remove the custom banner video and go back to the built-in default?')) return;
    setResetting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/homepage-video', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove the video');
      setVideoUrl(null);
      setSuccess('Reverted to the default homepage video.');
    } catch (err: any) {
      setError(err.message || 'Error removing the video');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Homepage</h1>
        <p className="text-sm text-gray-500 mt-1">
          Replace the looping banner video shown near the top of the homepage — no developer needed.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-green-500" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-5">
        <div>
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Banner Video</p>
          <p className="text-xs text-gray-500 mb-3">
            {videoUrl
              ? 'A custom video is live on the homepage.'
              : "Using the site's built-in default video — nothing uploaded yet."}
          </p>

          {loading ? (
            <div className="aspect-[1643/294] rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#78B249] animate-spin" />
            </div>
          ) : videoUrl ? (
            <div className="relative aspect-[1643/294] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              {/* Proxied through the admin panel so the preview never depends on the
                  public site's hotlink guard — see src/lib/adminAssets.ts. */}
              <video src={adminAssetUrl(videoUrl)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[1643/294] rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
              <Film className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/20">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-[#78B249] animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-xs font-semibold text-gray-600">
              {uploading ? 'Uploading...' : videoUrl ? 'Replace Video' : 'Upload Video'}
            </span>
            <span className="text-[10px] text-gray-400">MP4 recommended, muted &amp; looping</span>
            <input
              type="file"
              accept="video/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>

          {videoUrl && (
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting || uploading}
              className="sm:w-52 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              <span>{resetting ? 'Reverting...' : 'Remove / Reset to Default'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
