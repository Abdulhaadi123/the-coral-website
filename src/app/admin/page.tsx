'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  MessageSquareQuote,
  Handshake,
  Newspaper,
  Plus,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Lock,
  X,
  Tag,
  Search,
  Share2,
  Map as MapIcon,
  Users,
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { useAdminUser } from '@/components/admin/AdminUserContext';
import { SECTIONS, SectionKey, hasPermission, isSuper } from '@/lib/permissions';

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  projects: FolderKanban,
  categories: Tag,
  blog: Newspaper,
  testimonials: MessageSquareQuote,
  partners: Handshake,
  social: Share2,
  leads: Users,
  seo: Search,
  sitemap: MapIcon,
};

export default function AdminDashboardPage() {
  const me = useAdminUser();
  const can = (key: SectionKey) => hasPermission(me, key);

  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [testimonialsCount, setTestimonialsCount] = useState<number | null>(null);
  const [leadsCount, setLeadsCount] = useState<number | null>(null);
  const [partnersCount, setPartnersCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  // Sent here by the guard after trying to open a section they don't have.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('denied')) {
      setDenied(true);
      window.history.replaceState(null, '', '/admin');
    }
  }, []);

  // Refetch only when their access actually changes, not on every session refresh.
  const accessKey = me ? `${me.role}:${me.permissions.join(',')}` : '';

  useEffect(() => {
    if (!me) return;

    // Each count is loaded only for sections this user can open; one failing never blanks the others.
    async function load(url: string, apply: (data: any) => void) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) apply(data);
      } catch (e) {
        console.error(`Error loading ${url}:`, e);
      }
    }

    async function loadStats() {
      await Promise.all([
        can('projects') &&
          load('/api/admin/projects', (d) => {
            setProjectsCount(d.projects.length);
            setRecentProjects(d.projects.slice(0, 4));
          }),
        can('testimonials') && load('/api/admin/testimonials', (d) => setTestimonialsCount(d.testimonials.length)),
        can('leads') && load('/api/admin/leads', (d) => setLeadsCount(d.leads.length)),
        can('partners') && load('/api/admin/partners', (d) => setPartnersCount(d.partners.length)),
        can('blog') && load('/api/admin/blog', (d) => setBlogCount(d.posts.length)),
      ]);
      setLoading(false);
    }

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessKey]);

  const stats = [
    {
      key: 'projects' as const,
      href: '/admin/projects',
      link: 'Manage all',
      label: 'Portfolio Items',
      value: projectsCount,
      Icon: FolderKanban,
      tile: 'bg-[#9FE66F]/20 text-[#467923]',
    },
    {
      key: 'testimonials' as const,
      href: '/admin/testimonials',
      link: 'Manage all',
      label: 'Client Reviews',
      value: testimonialsCount,
      Icon: MessageSquareQuote,
      tile: 'bg-[#00C0E8]/20 text-[#0096B4]',
    },
    {
      key: 'leads' as const,
      href: '/admin/leads',
      link: 'View leads',
      label: 'Portfolio Leads',
      value: leadsCount,
      Icon: Sparkles,
      tile: 'bg-purple-100 text-purple-600',
    },
    {
      key: 'partners' as const,
      href: '/admin/partners',
      link: 'Manage all',
      label: 'Partner Logos',
      value: partnersCount,
      Icon: Handshake,
      tile: 'bg-[#2ECE9E]/20 text-[#1B8F6B]',
    },
    {
      key: 'blog' as const,
      href: '/admin/blog',
      link: 'Manage all',
      label: 'Blog Posts',
      value: blogCount,
      Icon: Newspaper,
      tile: 'bg-[#78B249]/20 text-[#467923]',
    },
  ].filter((s) => can(s.key));

  const mySections = SECTIONS.filter((s) => can(s.key));
  const restricted = !isSuper(me);

  return (
    <div className="flex flex-col gap-8">
      {denied && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-5 py-4">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium flex-1">
            You don&apos;t have access to that section. If you need it, ask a Super Admin to enable it for your account.
          </p>
          <button
            onClick={() => setDenied(false)}
            aria-label="Dismiss"
            className="p-1 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Welcome Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
            Welcome to Coral Admin
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {restricted
              ? `Hi ${me?.name || 'there'} — you have access to ${
                  mySections.length === 0
                    ? 'no sections yet'
                    : `${mySections.length} section${mySections.length === 1 ? '' : 's'} of the admin panel`
                }.`
              : 'Manage portfolio case studies, full-detail images, client testimonials, and access leads.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {can('projects') && (
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] transition-all"
              style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Link>
          )}
          {can('testimonials') && (
            <Link
              href="/admin/testimonials/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-[#111827] bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </Link>
          )}
          {can('blog') && (
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-[#111827] bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Write Post</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Nothing assigned yet ── */}
      {restricted && mySections.length === 0 && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">No sections assigned yet</h2>
          <p className="text-sm text-gray-600 max-w-md">
            Your account is active but hasn&apos;t been given access to any part of the admin panel. Ask a Super
            Admin to enable the sections you need.
          </p>
        </div>
      )}

      {/* ── Quick Stats Grid ── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ key, href, link, label, value, Icon, tile }) => (
            <div
              key={key}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tile}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <Link
                  href={href}
                  className="text-xs font-semibold text-gray-600 hover:text-[#111827] flex items-center gap-1"
                >
                  <span>{link}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
                  {loading ? '...' : value ?? 0}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Your sections (restricted users only) ── */}
      {restricted && mySections.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-[#111827] mb-1">Your sections</h2>
          <p className="text-sm text-gray-600 mb-6">Everything your account can open and edit.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySections.map((s) => {
              const Icon = SECTION_ICONS[s.key];
              return (
                <Link
                  key={s.key}
                  href={s.href}
                  className="group flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#9FE66F]/20 text-[#467923] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1">
                      {s.label}
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#111827] transition-colors" />
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Recent Projects Overview ── */}
      {can('projects') && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#111827]">Recent Portfolio Projects</h2>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-[#467923] hover:underline"
            >
              View all projects →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading recent projects...</div>
          ) : recentProjects.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No projects in database yet. Run the seed script or add your first project!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}`}
                  className="group p-3 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={assetUrl(p.image)}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
                      {p.topBadge || p.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] line-clamp-1">{p.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(p.tags || []).slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
