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
  Star,
} from 'lucide-react';

function StarRatingSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-2 p-3 rounded-2xl border border-gray-200 bg-gray-50/50">
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

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('');
  const [logo, setLogo] = useState('');
  const [featured, setFeatured] = useState(true);
  const [order, setOrder] = useState('0');

  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTestimonial() {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`);
        const data = await res.json();
        if (data.success && data.testimonial) {
          const t = data.testimonial;
          setName(t.name);
          setRole(t.role);
          setQuote(t.quote);
          setRating(Number(t.rating) || 5);
          setAvatar(t.avatar || '');
          setLogo(t.logo || '');
          setFeatured(Boolean(t.featured));
          setOrder(String(t.order || 0));
        } else {
          setError('Testimonial not found');
        }
      } catch (e: any) {
        setError(e.message || 'Error loading testimonial');
      } finally {
        setInitialLoading(false);
      }
    }
    loadTestimonial();
  }, [id]);

  const handleFileUpload = async (file: File, isAvatar: boolean) => {
    if (isAvatar) setUploadingAvatar(true);
    else setUploadingLogo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'coral-room/testimonials');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (isAvatar) {
        setAvatar(data.url);
      } else {
        setLogo(data.url);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading image to Cloudinary');
    } finally {
      if (isAvatar) setUploadingAvatar(false);
      else setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          quote,
          avatar: avatar || null,
          logo: logo || null,
          rating: Number(rating) || 5,
          featured,
          order: Number(order) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update testimonial');

      router.push('/admin/testimonials');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error updating testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this testimonial?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/testimonials');
        router.refresh();
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting testimonial');
    } finally {
      setDeleting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#78B249] animate-spin" />
        <span className="text-sm text-gray-500">Loading testimonial details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Testimonials</span>
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting ? 'Deleting...' : 'Delete Testimonial'}</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Edit Testimonial</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update client details, review quote, or logos.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Client Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Role &amp; Company *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Review / Testimonial Quote *
          </label>
          <textarea
            required
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] leading-relaxed resize-none"
          />
        </div>

        {/* 1 - 5 Star Rating Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Star Rating (Click to Select 1 - 5) *
          </label>
          <StarRatingSelector value={rating} onChange={setRating} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Client Avatar Photo
            </label>
            {avatar ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <label className="cursor-pointer text-xs font-bold text-[#467923] hover:underline">
                  Change Photo
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
            ) : (
              <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/20">
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
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], true)
                  }
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Company Logo (Optional)
            </label>
            {logo ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt="Logo preview"
                  className="h-10 max-w-[120px] object-contain"
                />
                <label className="cursor-pointer text-xs font-bold text-[#467923] hover:underline">
                  Change Logo
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
            ) : (
              <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/20">
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
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], false)
                  }
                />
              </label>
            )}
          </div>
        </div>

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
                onClick={() => setFeatured(!featured)}
                className={`relative rounded-full transition-colors cursor-pointer shrink-0 ${
                  featured ? 'bg-[#78B249]' : 'bg-gray-200'
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
                    transform: featured ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700">Display on Homepage</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingAvatar || uploadingLogo}
          className="mt-4 w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Testimonial...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save &amp; Update Live</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
