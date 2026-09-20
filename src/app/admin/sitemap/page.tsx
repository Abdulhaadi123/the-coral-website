'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Copy, Check, ExternalLink, FileText, Newspaper, Zap } from 'lucide-react';

interface Entry {
  url: string;
  label: string;
  kind: 'page' | 'post';
  lastModified?: string;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

export default function AdminSitemapPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [robotsUrl, setRobotsUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/sitemap')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEntries(data.entries);
          setSitemapUrl(data.sitemapUrl);
          setRobotsUrl(data.robotsUrl);
        }
      })
      .catch((e) => console.error('Error loading sitemap:', e))
      .finally(() => setLoading(false));
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sitemapUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const pages = entries.filter((e) => e.kind === 'page');
  const posts = entries.filter((e) => e.kind === 'post');

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Sitemap</h1>
        <p className="text-sm text-gray-500 mt-1">
          Built automatically from your live content — nothing to write, upload, or update by hand.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#78B249]/15 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#467923]" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every time a journal post is <strong className="text-[#111827]">published, unpublished, or deleted</strong>,
            the sitemap changes with it. Google re-reads it on its own after you submit it once.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#78B249]" /> Loading...
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Sitemap URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 truncate">
                  {sitemapUrl}
                </code>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#111827] hover:opacity-90 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-[#9FE66F]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open sitemap.xml"
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-[#111827] hover:bg-gray-50 shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-[#467923] inline-flex items-center gap-1 w-fit"
              >
                robots.txt: {robotsUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600 leading-relaxed">
              <p className="font-bold text-[#111827] mb-1">One-time setup in Google Search Console</p>
              Sitemaps → add <code className="text-[#111827]">sitemap.xml</code> → Submit. After that you never need to
              resubmit. To speed up a brand-new post, paste its URL into the Search Console search bar and choose
              “Request indexing”.
            </div>
          </>
        )}
      </div>

      {/* Included URLs */}
      {!loading && (
        <>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-[#111827]">Pages ({pages.length})</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {pages.map((e) => (
                <li key={e.url} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[#111827] shrink-0">{e.label}</span>
                  <span className="text-xs text-gray-400 font-mono truncate">{e.url}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-[#111827]">Journal posts ({posts.length})</h2>
            </div>
            {posts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">
                No published posts yet. Publish one and it will appear here and in the sitemap straight away.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {posts.map((e) => (
                  <li key={e.url} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{e.label}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{e.url}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                      {formatDate(e.lastModified)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
