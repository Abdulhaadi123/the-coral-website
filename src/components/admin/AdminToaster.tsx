'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ADMIN_TOAST_EVENT, AdminToastDetail } from '@/lib/adminToast';

interface Toast extends AdminToastDetail {
  id: number;
}

let nextId = 0;

/** Messages that stay pinned to the top-right of the screen, so an upload failure is
 * seen even when the form's own error box is scrolled out of view. */
export const AdminToaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<AdminToastDetail>).detail;
      if (!detail?.message) return;
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-3), { id, ...detail }]);
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), detail.type === 'error' ? 10000 : 5000);
    };
    window.addEventListener(ADMIN_TOAST_EVENT, onToast);
    return () => window.removeEventListener(ADMIN_TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,400px)]" aria-live="assertive">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start gap-3 rounded-2xl border p-4 shadow-lg text-sm ${
            t.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
          )}
          <p className="flex-1 leading-relaxed">{t.message}</p>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            aria-label="Dismiss"
            className="shrink-0 p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminToaster;
