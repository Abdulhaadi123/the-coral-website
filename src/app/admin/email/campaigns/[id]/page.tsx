'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import CampaignForm, { CampaignFormValues } from '../CampaignForm';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [initial, setInitial] = useState<Partial<CampaignFormValues> | null>(null);
  const [status, setStatus] = useState<string>('draft');
  const [retryable, setRetryable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/email/campaigns/${id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load campaign');
        const c = data.campaign;
        setInitial({
          subject: c.subject,
          contentHtml: c.contentHtml,
          listId: c.listId || '',
          attachments: Array.isArray(c.attachments) ? c.attachments : [],
        });
        setStatus(c.status);
        setRetryable(c.status === 'failed' && c.sentCount === 0);
      } catch (err: any) {
        setError(err.message || 'Error loading campaign');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
        <span>{error || 'Campaign not found'}</span>
      </div>
    );
  }

  return <CampaignForm id={id} initial={initial} initialStatus={status} retryable={retryable} />;
}
