'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Loader2, AlertCircle, Check, FileSpreadsheet } from 'lucide-react';

export default function NewEmailListPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    imported: number;
    invalidCount: number;
    blankRowsSkipped: number;
    duplicatesSkipped: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Choose a CSV or Excel file first.');
      return;
    }
    if (!name.trim()) {
      setError('Name this list.');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name.trim());

      const res = await fetch('/api/admin/email/lists', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create list');

      setResult({
        imported: data.imported,
        invalidCount: data.invalidCount,
        blankRowsSkipped: data.blankRowsSkipped,
        duplicatesSkipped: data.duplicatesSkipped,
      });

      setTimeout(() => router.push(`/admin/email/lists/${data.list.id}`), 1600);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <Link href="/admin/email/lists" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#111827] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lists</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Upload Contact List</h1>
        <p className="text-sm text-gray-500 mt-1">
          A CSV or Excel file (up to 25,000 rows) with a header row — needs an "Email" column, and optionally a "Name" column.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 font-bold">
            <Check className="w-4 h-4 shrink-0 text-green-600" />
            <span>Imported {result.imported} contact{result.imported === 1 ? '' : 's'}</span>
          </div>
          <ul className="text-xs text-green-700 pl-6 list-disc">
            {result.invalidCount > 0 && <li>{result.invalidCount} have an invalid email format — kept, but excluded from sends.</li>}
            {result.duplicatesSkipped > 0 && <li>{result.duplicatesSkipped} duplicate row(s) skipped.</li>}
            {result.blankRowsSkipped > 0 && <li>{result.blankRowsSkipped} blank row(s) skipped.</li>}
          </ul>
          <p className="text-xs text-green-700">Taking you to the list...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">List Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Newsletter Subscribers — Sep 2026"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">File *</label>
          {file ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50">
              <FileSpreadsheet className="w-6 h-6 text-[#467923] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button type="button" onClick={() => setFile(null)} className="text-xs font-bold text-red-600 hover:underline shrink-0 cursor-pointer">
                Remove
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/30">
              <UploadCloud className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">Click to choose a .csv, .xlsx, or .xls file</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-4 px-6 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Importing...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Import List</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
