'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Send, Loader2, ArrowRight } from 'lucide-react';

export default function AdminEmailHubPage() {
  const [listCount, setListCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [campaignCounts, setCampaignCounts] = useState<{ draft: number; scheduled: number; sent: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [listsRes, campaignsRes] = await Promise.all([
          fetch('/api/admin/email/lists', { cache: 'no-store' }),
          fetch('/api/admin/email/campaigns', { cache: 'no-store' }),
        ]);
        const listsData = await listsRes.json();
        const campaignsData = await campaignsRes.json();

        if (listsData.success) {
          setListCount(listsData.lists.length);
          setContactCount(listsData.lists.reduce((sum: number, l: any) => sum + l.contactCount, 0));
        }
        if (campaignsData.success) {
          const counts = { draft: 0, scheduled: 0, sent: 0 };
          for (const c of campaignsData.campaigns) {
            if (c.status === 'draft') counts.draft++;
            else if (c.status === 'scheduled') counts.scheduled++;
            else if (c.status === 'sent' || c.status === 'sending') counts.sent++;
          }
          setCampaignCounts(counts);
        }
      } catch {
        // Leave counts null — the cards below still link through fine.
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Email Marketing</h1>
        <p className="text-sm text-gray-500 mt-1">Upload contact lists and create, schedule or send email campaigns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/admin/email/lists"
          className="group bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#78B249]/15 flex items-center justify-center">
            <Users className="w-6 h-6 text-[#467923]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              Contact Lists
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-[#467923] transition-all" />
            </h2>
            <p className="text-sm text-gray-500 mt-1">Upload a CSV or Excel file of email addresses.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            {listCount === null ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
            ) : (
              <>
                <span>{listCount} list{listCount === 1 ? '' : 's'}</span>
                <span>·</span>
                <span>{contactCount} contact{contactCount === 1 ? '' : 's'}</span>
              </>
            )}
          </div>
        </Link>

        <Link
          href="/admin/email/campaigns"
          className="group bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#78B249]/15 flex items-center justify-center">
            <Send className="w-6 h-6 text-[#467923]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              Campaigns
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-[#467923] transition-all" />
            </h2>
            <p className="text-sm text-gray-500 mt-1">Write, schedule, and send campaigns to a list.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            {campaignCounts === null ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
            ) : (
              <>
                <span>{campaignCounts.draft} draft</span>
                <span>·</span>
                <span>{campaignCounts.scheduled} scheduled</span>
                <span>·</span>
                <span>{campaignCounts.sent} sent</span>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
