'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Loader2, AlertCircle, Send, ArrowLeft, Trash2, XCircle } from 'lucide-react';

interface CampaignRow {
  id: string;
  subject: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  list: { id: string; name: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-50 text-blue-700',
  sending: 'bg-amber-50 text-amber-700',
  sent: 'bg-[#78B249]/15 text-[#467923]',
  failed: 'bg-red-50 text-red-700',
};

export default function AdminEmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/email/campaigns', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load campaigns');
      setCampaigns(data.campaigns);
    } catch (err: any) {
      setError(err.message || 'Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Sending progress is updated server-side, and a scheduled campaign flips to
    // sending/sent on its own when its time comes — poll while either is on screen
    // so the statuses and counts stay live without a manual refresh.
    const interval = setInterval(() => {
      setCampaigns((prev) => {
        if (prev.some((c) => c.status === 'sending' || c.status === 'scheduled')) load();
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (c: CampaignRow) => {
    if (!confirm(`Cancel the scheduled send for "${c.subject}"? It will go back to a draft.`)) return;
    setBusyId(c.id);
    try {
      const res = await fetch(`/api/admin/email/campaigns/${c.id}/send`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      await load();
    } catch (err: any) {
      setError(err.message || 'Error cancelling campaign');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (c: CampaignRow) => {
    if (!confirm(`Delete the campaign "${c.subject}"? This cannot be undone.`)) return;
    setBusyId(c.id);
    try {
      const res = await fetch(`/api/admin/email/campaigns/${c.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setCampaigns((prev) => prev.filter((row) => row.id !== c.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting campaign');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <Link href="/admin/email" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Email Marketing</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">{campaigns.length} campaign{campaigns.length === 1 ? '' : 's'}</p>
        </div>
        <Link
          href="/admin/email/campaigns/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3">
          <Send className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No campaigns yet</p>
          <Link href="/admin/email/campaigns/new" className="text-xs font-bold text-[#467923] hover:underline">
            + Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#111827] truncate">{c.subject || '(no subject)'}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.list ? c.list.name : 'No list chosen'}
                  {c.status === 'scheduled' && c.scheduledAt && ` · scheduled for ${new Date(c.scheduledAt).toLocaleString()}`}
                  {(c.status === 'sending' || c.status === 'sent' || c.status === 'failed') && ` · ${c.sentCount}/${c.totalRecipients} sent${c.failedCount ? `, ${c.failedCount} failed` : ''}`}
                  {c.status === 'failed' && c.sentCount > 0 && ' · partly delivered, so it cannot be re-sent'}
                  {c.status === 'failed' && c.sentCount === 0 && ' · nothing was delivered — fix the cause and send it again'}
                  {c.status === 'sent' && c.sentAt && ` · ${new Date(c.sentAt).toLocaleString()}`}
                </p>
              </div>

              {(c.status === 'draft' || c.status === 'scheduled' || (c.status === 'failed' && c.sentCount === 0)) && (
                <Link
                  href={`/admin/email/campaigns/${c.id}`}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
                >
                  {c.status === 'failed' ? 'Edit & retry' : 'Edit'}
                </Link>
              )}
              {c.status === 'scheduled' && (
                <button
                  type="button"
                  onClick={() => handleCancel(c)}
                  disabled={busyId === c.id}
                  className="p-2 text-gray-400 hover:text-amber-600 cursor-pointer disabled:opacity-50 shrink-0"
                  title="Cancel schedule"
                >
                  {busyId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                </button>
              )}
              {c.status !== 'sending' && (
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  disabled={busyId === c.id}
                  className="p-2 text-gray-400 hover:text-red-600 cursor-pointer disabled:opacity-50 shrink-0"
                  aria-label="Delete campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
