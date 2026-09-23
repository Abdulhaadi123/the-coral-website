'use client';

import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Loader2, Trash2, ArrowUp, ArrowDown, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import { uploadAdminFile } from '@/lib/uploadClient';

export interface DetailImagePart {
  url: string;
  width: number;
  height: number;
}

interface DetailImagePartsEditorProps {
  parts: DetailImagePart[];
  onChange: (parts: DetailImagePart[]) => void;
  folder: string;
}

/** Natural pixel size of a local file, read before it's ever uploaded. */
function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Couldn't read "${file.name}" as an image.`));
    };
    img.src = url;
  });
}

interface Row extends DetailImagePart {
  key: number;
  uploading: boolean;
  error?: string;
}

let nextKey = 0;

export const DetailImagePartsEditor: React.FC<DetailImagePartsEditorProps> = ({ parts, onChange, folder }) => {
  const [rows, setRows] = useState<Row[]>(() => (parts || []).map((p) => ({ ...p, key: nextKey++, uploading: false })));
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-sync local rows whenever the parent passes a new `parts` array
  // (e.g. on project load, navigating between projects, or reset).
  useEffect(() => {
    const currentUrls = rows.filter((r) => !r.uploading && !r.error).map((r) => r.url).join('|');
    const incomingUrls = (parts || []).map((p) => p.url).join('|');

    if (currentUrls !== incomingUrls) {
      setRows((parts || []).map((p) => ({ ...p, key: nextKey++, uploading: false })));
    }
  }, [parts]);

  // Keep the parent's plain url/width/height list in sync with our richer local rows.
  const commit = (next: Row[]) => {
    setRows(next);
    onChange(next.filter((r) => !r.uploading && !r.error).map(({ url, width, height }) => ({ url, width, height })));
  };

  const handleFiles = async (files: FileList) => {
    const newRows: Row[] = Array.from(files).map(() => ({
      key: nextKey++,
      url: '',
      width: 0,
      height: 0,
      uploading: true,
    }));
    let current = [...rows, ...newRows];
    setRows(current);

    await Promise.all(
      Array.from(files).map(async (file, i) => {
        const row = newRows[i];
        try {
          const [size, uploaded] = await Promise.all([readImageSize(file), uploadAdminFile(file, folder)]);
          current = current.map((r) => (r.key === row.key ? { ...r, url: uploaded.url, ...size, uploading: false } : r));
        } catch (err: any) {
          current = current.map((r) =>
            r.key === row.key ? { ...r, uploading: false, error: err?.message || 'Upload failed' } : r
          );
        }
        commit(current);
      })
    );
  };

  const removeRow = (key: number) => commit(rows.filter((r) => r.key !== key));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const readyRows = rows.filter((r) => !r.uploading && !r.error);
  const anyUploading = rows.some((r) => r.uploading);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold text-[#111827]">Full Detail View Image</h2>
        <p className="text-xs text-gray-500">
          Edge-to-edge showcase when the project is opened. Upload one image, or crop a tall design into
          several pieces (top to bottom) and upload them together — they display stitched edge-to-edge with
          no visible gap, exactly like one image, but each piece loads faster.
        </p>
      </div>

      {readyRows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                row.error ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'
              }`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                {row.uploading ? (
                  <Loader2 className="w-4 h-4 text-[#78B249] animate-spin" />
                ) : row.error ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(row.url)} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">
                  Part {index + 1}
                  {!row.uploading && !row.error && (
                    <span className="text-gray-400 font-normal"> — {row.width}×{row.height}px</span>
                  )}
                </p>
                {row.uploading && <p className="text-[11px] text-gray-400">Uploading...</p>}
                {row.error && <p className="text-[11px] text-red-600">{row.error}</p>}
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Move down"
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  aria-label="Remove"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="border-2 border-dashed border-gray-200 hover:border-[#78B249] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/50 hover:bg-green-50/30">
        {anyUploading ? (
          <Loader2 className="w-6 h-6 text-[#78B249] animate-spin" />
        ) : (
          <UploadCloud className="w-6 h-6 text-gray-400" />
        )}
        <span className="text-xs font-semibold text-gray-600">
          {readyRows.length > 0 ? 'Add another part' : 'Upload detail image (one file, or several parts)'}
        </span>
        <span className="text-[10px] text-gray-400">High-res WebP / PNG / JPG — select multiple to add several at once</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {readyRows.length > 1 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#111827] cursor-pointer"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPreview ? 'Hide' : 'Preview'} stitched result ({readyRows.length} parts)</span>
          </button>

          {showPreview && (
            <div className="mt-3 rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 max-h-[420px] overflow-y-auto">
              {/* Every part rendered edge-to-edge exactly as the public page does, so a
                  gap or a misplaced part is visible here before publishing. */}
              {readyRows.map((row) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={row.key}
                  src={assetUrl(row.url)}
                  alt=""
                  style={{ display: 'block', width: '100%', height: 'auto', margin: 0, padding: 0, border: 0 }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailImagePartsEditor;
