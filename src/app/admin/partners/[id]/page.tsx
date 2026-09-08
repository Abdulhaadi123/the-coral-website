'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import PartnerForm, { PartnerFormValues } from '../PartnerForm';

export default function EditPartnerPage({ params }: { params: { id: string } }) {
  const [initial, setInitial] = useState<PartnerFormValues | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/partners/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || 'Partner not found');
        const p = data.partner;
        setInitial({
          name: p.name,
          logo: p.logo,
          width: p.width,
          height: p.height,
          active: p.active,
          order: p.order,
        });
      })
      .catch((e) => setError(e.message || 'Failed to load partner'));
  }, [params.id]);

  if (error) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Link
          href="/admin/partners"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partners</span>
        </Link>
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-24 flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto">
        <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
        <p className="text-sm text-gray-500">Loading partner...</p>
      </div>
    );
  }

  return <PartnerForm id={params.id} initial={initial} />;
}
