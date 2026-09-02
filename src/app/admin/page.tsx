'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  MessageSquareQuote,
  Plus,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';

export default function AdminDashboardPage() {
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [testimonialsCount, setTestimonialsCount] = useState<number | null>(null);
  const [leadsCount, setLeadsCount] = useState<number | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projRes, testRes, leadRes] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/testimonials'),
          fetch('/api/admin/leads'),
        ]);

        const projData = await projRes.json();
        const testData = await testRes.json();
        const leadData = await leadRes.json();

        if (projData.success) {
          setProjectsCount(projData.projects.length);
          setRecentProjects(projData.projects.slice(0, 4));
        }
        if (testData.success) {
          setTestimonialsCount(testData.testimonials.length);
        }
        if (leadData.success) {
          setLeadsCount(leadData.leads.length);
        }
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-8">
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
            Manage portfolio case studies, full-detail images, client testimonials, and access leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] transition-all"
            style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-[#111827] bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Link>
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Portfolio Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9FE66F]/20 flex items-center justify-center text-[#467923]">
              <FolderKanban className="w-6 h-6" />
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-gray-600 hover:text-[#111827] flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              {loading ? '...' : projectsCount ?? 0}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Portfolio Items
            </p>
          </div>
        </div>

        {/* Testimonials Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00C0E8]/20 flex items-center justify-center text-[#0096B4]">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <Link
              href="/admin/testimonials"
              className="text-xs font-semibold text-gray-600 hover:text-[#111827] flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              {loading ? '...' : testimonialsCount ?? 0}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Client Reviews
            </p>
          </div>
        </div>

        {/* Leads Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-gray-600 hover:text-[#111827] flex items-center gap-1"
            >
              <span>View leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              {loading ? '...' : leadsCount ?? 0}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Portfolio Leads
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Projects Overview ── */}
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
    </div>
  );
}
