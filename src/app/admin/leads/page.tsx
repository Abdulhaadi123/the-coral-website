'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Download,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Inbox,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove lead for "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert('Failed to delete lead');
      }
    } catch (e) {
      alert('Error deleting lead');
    } finally {
      setDeletingId(null);
    }
  };

  // 1-Click Instant CSV / Excel Export
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    setDownloading(true);
    try {
      const headers = ['ID', 'Full Name', 'Email Address', 'Phone Number', 'Source', 'Date Created', 'Time Created'];
      const rows = leads.map((l) => {
        const d = new Date(l.createdAt);
        const dateStr = d.toISOString().split('T')[0]; // e.g. 2026-08-30
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // e.g. 05:23 PM
        const safePhone = (l.phone || '').replace(/"/g, '""');
        return [
          `"${l.id}"`,
          `"${(l.name || '').replace(/"/g, '""')}"`,
          `"${(l.email || '').replace(/"/g, '""')}"`,
          `"=""${safePhone}"""`, // Forces Excel to display phone as exact text string
          `"${l.source || 'portfolio_gate'}"`,
          `"=""${dateStr}"""`,
          `"=""${timeStr}"""`,
        ].join(',');
      });

      // \uFEFF is UTF-8 BOM so Excel opens with proper encoding & alignment
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `the_coral_room_leads_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to generate CSV export');
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Portfolio Leads &amp; Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            {leads.length} visitor{leads.length !== 1 ? 's' : ''} unlocked portfolio access
          </p>
        </div>

        {/* Action: Export to CSV */}
        <button
          onClick={exportToCSV}
          disabled={downloading || leads.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0 disabled:opacity-50"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloading ? 'Exporting...' : 'Export to CSV / Excel'}</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads by name, email, or phone number..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#78B249] placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading access leads...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Inbox className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No leads captured yet.</p>
          <p className="text-xs text-gray-400">
            When visitors unlock the portfolio page, their details will appear here in real-time.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Stack */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((l) => {
              const date = new Date(l.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const time = new Date(l.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={l.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#111827] text-base">{l.name}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>
                          {date} at {time}
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(l.id, l.name)}
                      disabled={deletingId === l.id}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deletingId === l.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100 text-xs">
                    <a
                      href={`mailto:${l.email}`}
                      className="inline-flex items-center gap-2 text-gray-700 hover:text-[#467923] font-medium"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{l.email}</span>
                    </a>
                    <a
                      href={`tel:${l.phone}`}
                      className="inline-flex items-center gap-2 text-gray-700 hover:text-[#467923] font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{l.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm table-fixed">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-[220px]">Visitor Name</th>
                  <th className="py-4 px-6 w-[260px]">Email Address</th>
                  <th className="py-4 px-6 w-[190px]">Phone Number</th>
                  <th className="py-4 px-6">Unlocked At</th>
                  <th className="py-4 px-6 text-right w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l) => {
                  const date = new Date(l.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const time = new Date(l.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={l.id} className="hover:bg-gray-50/70 transition-colors group">
                      {/* Name */}
                      <td className="py-3.5 px-6 align-middle">
                        <div className="font-bold text-[#111827] text-sm truncate">{l.name}</div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-6 align-middle">
                        <a
                          href={`mailto:${l.email}`}
                          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#467923] font-medium text-xs hover:underline truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{l.email}</span>
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-6 align-middle">
                        <a
                          href={`tel:${l.phone}`}
                          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#467923] font-medium text-xs hover:underline whitespace-nowrap"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{l.phone}</span>
                        </a>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-6 align-middle">
                        <div className="text-xs text-gray-600 font-medium whitespace-nowrap">
                          {date} <span className="text-gray-400">· {time}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-6 align-middle text-right">
                        <button
                          onClick={() => handleDelete(l.id, l.name)}
                          disabled={deletingId === l.id}
                          title="Delete lead"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          {deletingId === l.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
              Showing {filtered.length} of {leads.length} total leads captured
            </div>
          </div>
        </>
      )}
    </div>
  );
}
