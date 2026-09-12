'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, ExternalLink, Search, AlertCircle, Newspaper, FileText } from 'lucide-react';

interface SeoPage {
  id: string;
  path: string;
  label: string;
  title: string;
  description: string;
}

interface BlogSeoPost {
  id: string;
  slug: string;
  title: string;
  description: string;
}

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

function CounterHint({ length, min, max }: { length: number; min: number; max: number }) {
  const good = length >= min && length <= max;
  const color = length === 0 ? 'text-gray-400' : good ? 'text-green-600' : 'text-amber-600';
  return (
    <span className={`text-[11px] font-semibold ${color}`}>
      {length} / {max} chars {length > 0 && !good && (length < min ? '(a bit short)' : '(too long)')}
    </span>
  );
}

function SeoRow({ page, onSaved }: { page: SeoPage; onSaved: (updated: SeoPage) => void }) {
  const [title, setTitle] = useState(page.title);
  const [description, setDescription] = useState(page.description);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const dirty = title !== page.title || description !== page.description;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/seo/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      onSaved(data.page);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err: any) {
      setError(err.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-7 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#111827]">{page.label}</h3>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{page.path}</p>
        </div>
        <Link
          href={page.path}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors shrink-0"
        >
          <span>View live</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Page Title
          </label>
          <CounterHint length={title.length} min={TITLE_MIN} max={TITLE_MAX} />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Meta Description
          </label>
          <CounterHint length={description.length} min={DESC_MIN} max={DESC_MAX} />
        </div>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-xs text-white shadow hover:opacity-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {saving ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-3.5 h-3.5" /> Saved</>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}

function BlogSeoRow({ post, onSaved }: { post: BlogSeoPost; onSaved: (updated: BlogSeoPost) => void }) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const dirty = title !== post.title || description !== post.description;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      onSaved({ id: data.post.id, slug: data.post.slug, title: data.post.title, description: data.post.description });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err: any) {
      setError(err.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-7 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#111827]">{post.title}</h3>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">/journal/{post.slug}</p>
        </div>
        <Link
          href={`/journal/${post.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors shrink-0"
        >
          <span>View live</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Post Title
          </label>
          <CounterHint length={title.length} min={TITLE_MIN} max={TITLE_MAX} />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
        />
        <p className="text-[11px] text-gray-400 mt-1.5">This is also the post's headline on the page — it's used as the page title with &quot; | The Coral Room Journal&quot; added automatically.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Excerpt / Meta Description
          </label>
          <CounterHint length={description.length} min={DESC_MIN} max={DESC_MAX} />
        </div>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] resize-none"
        />
        <p className="text-[11px] text-gray-400 mt-1.5">Also shown as the card excerpt on the Journal listing page.</p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-xs text-white shadow hover:opacity-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {saving ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-3.5 h-3.5" /> Saved</>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [posts, setPosts] = useState<BlogSeoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [pagesRes, blogRes] = await Promise.all([
          fetch('/api/admin/seo'),
          fetch('/api/admin/blog'),
        ]);
        const pagesData = await pagesRes.json();
        const blogData = await blogRes.json();
        if (pagesData.success) setPages(pagesData.pages);
        if (blogData.success) {
          setPosts(blogData.posts.map((p: any) => ({ id: p.id, slug: p.slug, title: p.title, description: p.description })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPages = pages.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.label.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
  });

  const filteredPosts = posts.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">SEO Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Set a unique page title and meta description for every page on the site — this is what shows up in Google search results.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages or blog posts..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          {filteredPages.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mt-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</h2>
              </div>
              {filteredPages.map((page) => (
                <SeoRow
                  key={page.id}
                  page={page}
                  onSaved={(updated) => setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
                />
              ))}
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mt-4">
                <Newspaper className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blog Posts</h2>
              </div>
              {filteredPosts.map((post) => (
                <BlogSeoRow
                  key={post.id}
                  post={post}
                  onSaved={(updated) => setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
                />
              ))}
            </div>
          )}

          {filteredPages.length === 0 && filteredPosts.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-gray-300" />
              <p className="text-sm text-gray-500">No matches found</p>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-gray-400 text-center">
        Portfolio projects use their own title automatically — edit those from Portfolio Projects in the sidebar.
      </p>
    </div>
  );
}
