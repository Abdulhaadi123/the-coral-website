// Tiny event bridge so any admin code (e.g. the upload helper) can show a message that
// is visible wherever the admin is scrolled to — rendered by <AdminToaster /> in the
// admin layout.

export type AdminToastType = 'error' | 'success';

export const ADMIN_TOAST_EVENT = 'admin:toast';

export interface AdminToastDetail {
  message: string;
  type: AdminToastType;
}

export function showAdminToast(message: string, type: AdminToastType = 'error') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AdminToastDetail>(ADMIN_TOAST_EVENT, { detail: { message, type } }));
}
