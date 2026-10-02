'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Send,
  CalendarClock,
  Paperclip,
  X,
  FileText,
} from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { uploadAdminFile } from '@/lib/uploadClient';

interface ListOption {
  id: string;
  name: string;
  contactCount: number;
  validCount: number;
}

interface Attachment {
  filename: string;
  url: string;
}

export interface CampaignFormValues {
  subject: string;
  contentHtml: string;
  listId: string;
  attachments: Attachment[];
}

interface Props {
  /** Existing campaign id — omit to create. */
  id?: string;
  initial?: Partial<CampaignFormValues>;
  /** 'scheduled' campaigns stay editable; 'sending'/'sent' render read-only below. */
  initialStatus?: string;
  /** A 'failed' campaign that reached nobody may be fixed and sent again. */
  retryable?: boolean;
}

export default function CampaignForm({ id, initial, initialStatus, retryable = false }: Props) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const locked = initialStatus === 'sending' || initialStatus === 'sent' || (initialStatus === 'failed' && !retryable);

  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? '');
  const [listId, setListId] = useState(initial?.listId ?? '');
  const [attachments, setAttachments] = useState<Attachment[]>(initial?.attachments ?? []);

  const [lists, setLists] = useState<ListOption[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scheduleAt, setScheduleAt] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/email/lists', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setLists(data.lists);
      } catch {
        // The subject/content fields still work without the list dropdown loaded.
      } finally {
        setListsLoading(false);
      }
    })();
  }, []);

  const selectedList = lists.find((l) => l.id === listId);

  const saveDraft = async (): Promise<string | null> => {
    if (!subject.trim()) {
      setError('Add a subject line.');
      return null;
    }
    setSaving(true);
    setError('');
    try {
      const body = { subject: subject.trim(), contentHtml, listId: listId || null, attachments };
      const res = await fetch(isEdit ? `/api/admin/email/campaigns/${id}` : '/api/admin/email/campaigns', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      return data.campaign.id as string;
    } catch (err: any) {
      setError(err.message || 'Error saving campaign');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    const savedId = await saveDraft();
    if (savedId) {
      setSuccess('Draft saved.');
      setTimeout(() => setSuccess(''), 2500);
      if (!isEdit) router.replace(`/admin/email/campaigns/${savedId}`);
    }
  };

  const handleSendNow = async () => {
    if (!listId) {
      setError('Choose a recipient list first.');
      return;
    }
    if (!confirm(`Send "${subject}" to the ${selectedList?.validCount} valid address${selectedList?.validCount === 1 ? '' : 'es'} in "${selectedList?.name}" right now?${selectedList && selectedList.validCount < selectedList.contactCount ? `

(${selectedList.contactCount - selectedList.validCount} invalid address${selectedList.contactCount - selectedList.validCount === 1 ? ' is' : 'es are'} skipped.)` : ''}`)) {
      return;
    }
    setSending(true);
    setError('');
    const savedId = await saveDraft();
    if (!savedId) {
      setSending(false);
      return;
    }
    try {
      const res = await fetch(`/api/admin/email/campaigns/${savedId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      router.push('/admin/email/campaigns');
    } catch (err: any) {
      setError(err.message || 'Error sending campaign');
    } finally {
      setSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!listId) {
      setError('Choose a recipient list first.');
      return;
    }
    if (!scheduleAt) {
      setError('Pick a date and time to schedule for.');
      return;
    }
    setSending(true);
    setError('');
    const savedId = await saveDraft();
    if (!savedId) {
      setSending(false);
      return;
    }
    try {
      const res = await fetch(`/api/admin/email/campaigns/${savedId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: new Date(scheduleAt).toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule');
      router.push('/admin/email/campaigns');
    } catch (err: any) {
      setError(err.message || 'Error scheduling campaign');
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentUpload = async (file: File) => {
    setUploadingAttachment(true);
    setError('');
    try {
      const uploaded = await uploadAdminFile(file, 'coral-room/email-attachments');
      setAttachments((prev) => [...prev, { filename: file.name, url: uploaded.url }]);
    } catch (err: any) {
      setError(err.message || 'Error attaching file');
    } finally {
      setUploadingAttachment(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
      <Link href="/admin/email/campaigns" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{isEdit ? 'Edit Campaign' : 'New Campaign'}</h1>
        {locked && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mt-3">
            This campaign is {initialStatus} and can no longer be edited — shown read-only below.
          </p>
        )}
        {initialStatus === 'failed' && retryable && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mt-3">
            This campaign failed before reaching anyone (for example the mail server was unreachable or the list had no valid
            addresses). Fix the cause if needed, then send or schedule it again.
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-green-500" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject *</label>
          <input
            type="text"
            required
            disabled={locked}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. October updates from The Coral Room"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Recipient List *</label>
          {listsLoading ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading lists...</span>
            </div>
          ) : lists.length === 0 ? (
            <p className="text-xs text-gray-500">
              No lists yet —{' '}
              <Link href="/admin/email/lists/new" className="text-[#467923] font-bold hover:underline">
                upload one first
              </Link>
              .
            </p>
          ) : (
            <select
              value={listId}
              disabled={locked}
              onChange={(e) => setListId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Choose a list...</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.validCount === l.contactCount ? `${l.contactCount} contacts` : `${l.validCount} valid of ${l.contactCount}`})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Content *</label>
          {locked ? (
            <div className="journal-prose p-4 rounded-xl border border-gray-200 bg-gray-50" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            <RichTextEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Write the email content here…"
              allowImages
              imageFolder="coral-room/email"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Attachments</label>
          <div className="flex flex-col gap-2">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">{a.filename}</span>
                {!locked && (
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-gray-400 hover:text-red-600 cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {!locked && (
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors w-fit">
                {uploadingAttachment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                <span>{uploadingAttachment ? 'Uploading...' : 'Attach a file'}</span>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  className="hidden"
                  disabled={uploadingAttachment}
                  onChange={(e) => e.target.files?.[0] && handleAttachmentUpload(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {!locked && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#111827]">Send</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving || sending}
              className="flex-1 py-3.5 px-6 rounded-full font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              disabled={saving || sending}
              className="flex-1 py-3.5 px-6 rounded-full font-bold text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            <button
              type="button"
              onClick={handleSendNow}
              disabled={saving || sending}
              className="flex-1 py-3.5 px-6 rounded-full font-bold text-sm text-white shadow-md transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Now</span>
            </button>
          </div>

          {showSchedule && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <input
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
              />
              <button
                type="button"
                onClick={handleSchedule}
                disabled={sending}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shrink-0 disabled:opacity-50 cursor-pointer"
                style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
              >
                Confirm Schedule
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
