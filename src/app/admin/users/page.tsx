'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  Pencil,
  ShieldCheck,
  UserCog,
  Eye,
  EyeOff,
  Wand2,
  Lock,
} from 'lucide-react';
import { SECTIONS, SectionKey } from '@/lib/permissions';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/adminUsers';

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: 'super' | 'editor';
  permissions: SectionKey[];
  active: boolean;
  createdAt: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: 'super' | 'editor';
  permissions: SectionKey[];
  active: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'editor',
  permissions: [],
  active: true,
};

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249] bg-white disabled:bg-gray-50 disabled:text-gray-500';

const sectionLabel = (key: string) => SECTIONS.find((s) => s.key === key)?.label ?? key;

// Readable, unambiguous characters only (no 0/O, 1/l/I) so it survives being read out or typed from a chat message.
function generatePassword(length = 14): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editing = editingId ? users.find((u) => u.id === editingId) ?? null : null;
  const editingSelf = !!editingId && editingId === currentUserId;

  const load = async () => {
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users);
      setCurrentUserId(data.currentUserId);
    } catch (err: any) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (user: AdminUserRow) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions,
      active: user.active,
    });
    setShowPassword(false);
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
  };

  const togglePermission = (key: SectionKey) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key) ? f.permissions.filter((p) => p !== key) : [...f.permissions, key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) return setFormError('Enter a name.');
    if (!form.email.trim()) return setFormError('Enter an email address.');
    if (!editingId && !form.password) return setFormError('Set a password for this user.');
    if (form.password && (form.password.length < MIN_PASSWORD_LENGTH || form.password.length > MAX_PASSWORD_LENGTH)) {
      return setFormError(`Password must be ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters.`);
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        role: form.role,
        permissions: form.role === 'super' ? [] : form.permissions,
        active: form.active,
      };
      if (form.password) payload.password = form.password;

      const res = await fetch(editingId ? `/api/admin/users/${editingId}` : '/api/admin/users', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save user');

      setUsers((prev) =>
        editingId ? prev.map((u) => (u.id === editingId ? data.user : u)) : [...prev, data.user]
      );
      setFormOpen(false);
      setEditingId(null);
    } catch (err: any) {
      setFormError(err.message || 'Error saving user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUserRow) => {
    if (!confirm(`Delete ${user.name} (${user.email})? They will be signed out and can no longer log in.`)) return;
    setDeletingId(user.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Users &amp; Access</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create logins for your team and choose exactly which sections each person can open. Changes take effect
            immediately — no sign-out needed.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-sm hover:opacity-95 hover:scale-[1.02] transition-all cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <UserCog className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No users yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <div key={user.id} className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      user.active ? 'bg-[#111827] text-[#9FE66F]' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#111827] truncate">{user.name}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 shrink-0">
                          YOU
                        </span>
                      )}
                      {user.role === 'super' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#78B249]/15 text-[#467923] shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 shrink-0">
                          EDITOR
                        </span>
                      )}
                      {!user.active && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 shrink-0">
                          <Lock className="w-3 h-3" />
                          DISABLED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {user.role === 'super' ? (
                        <span className="text-[11px] text-gray-500">Full access to everything, including users</span>
                      ) : user.permissions.length === 0 ? (
                        <span className="text-[11px] text-amber-600 font-medium">No sections assigned</span>
                      ) : (
                        user.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#9FE66F]/20 text-[#467923]"
                          >
                            {sectionLabel(p)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(user)}
                    title="Edit"
                    aria-label={`Edit ${user.name}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id}
                      title="Delete"
                      aria-label={`Delete ${user.name}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / edit drawer ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div onClick={closeForm} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <form
            onSubmit={handleSave}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-label={editingId ? 'Edit user' : 'Add user'}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit user' : 'Add user'}</h2>
                {editing && <p className="text-xs text-gray-500">{editing.email}</p>}
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sara Khan"
                    maxLength={80}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email (login)</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    autoComplete="off"
                    className={inputClass}
                  />
                </label>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {editingId ? 'New password' : 'Password'}
                  </span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={editingId ? 'Leave blank to keep the current password' : `At least ${MIN_PASSWORD_LENGTH} characters`}
                        autoComplete="new-password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, password: generatePassword() }));
                        setShowPassword(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shrink-0"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Generate</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {editingId
                      ? 'Only fill this in to reset their password. Share it with them securely.'
                      : 'Share this with the person securely — it is not shown again after saving.'}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Role</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'editor', title: 'Editor', desc: 'Only the sections you tick below' },
                      { value: 'super', title: 'Super Admin', desc: 'Everything, plus managing users' },
                    ] as const
                  ).map((opt) => {
                    const selected = form.role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={editingSelf}
                        onClick={() => setForm({ ...form, role: opt.value })}
                        aria-pressed={selected}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all disabled:cursor-not-allowed cursor-pointer ${
                          selected ? 'border-[#78B249] bg-[#78B249]/5' : 'border-gray-200 hover:border-gray-300'
                        } ${editingSelf && !selected ? 'opacity-50' : ''}`}
                      >
                        <span className="flex items-center gap-1.5 text-sm font-bold text-[#111827]">
                          {opt.title}
                          {selected && <Check className="w-4 h-4 text-[#467923]" />}
                        </span>
                        <span className="text-xs text-gray-500">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {editingSelf && (
                  <p className="text-[11px] text-gray-500">You can&apos;t change your own role or disable your own account.</p>
                )}
              </div>

              {/* Sections */}
              {form.role === 'editor' ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Sections they can use{' '}
                      <span className="text-gray-400 normal-case font-medium">({form.permissions.length} selected)</span>
                    </span>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, permissions: SECTIONS.map((s) => s.key) })}
                        className="text-[#467923] hover:underline cursor-pointer"
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, permissions: [] })}
                        className="text-gray-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {SECTIONS.map((s) => {
                      const checked = form.permissions.includes(s.key);
                      return (
                        <label
                          key={s.key}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            checked ? 'border-[#78B249] bg-[#78B249]/5' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(s.key)}
                            className="mt-0.5 w-4 h-4 accent-[#78B249] cursor-pointer"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-[#111827]">{s.label}</span>
                            <span className="block text-xs text-gray-500">{s.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {form.permissions.length === 0 && (
                    <p className="text-[11px] text-amber-600 font-medium">
                      With no sections ticked this person can sign in but won&apos;t be able to open anything.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#78B249]/5 border border-[#78B249]/30 text-xs text-[#467923] font-medium">
                  Super Admins can open every section and create, edit and remove other users. Only give this to people
                  you fully trust.
                </div>
              )}

              {/* Enabled */}
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Account enabled</p>
                  <p className="text-xs text-gray-500">Turn off to block this person from signing in without deleting them.</p>
                </div>
                <button
                  type="button"
                  disabled={editingSelf}
                  onClick={() => setForm({ ...form, active: !form.active })}
                  role="switch"
                  aria-checked={form.active}
                  aria-label="Account enabled"
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    form.active ? 'bg-[#78B249]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#111827] hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{editingId ? 'Save changes' : 'Create user'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
