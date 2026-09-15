'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  Tag,
  AlertCircle,
  Check,
  X,
  Pencil,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  order: number;
}

const TABS: { key: 'portfolio' | 'blog'; label: string }[] = [
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'blog', label: 'Blog' },
];

export default function AdminCategoriesPage() {
  const [type, setType] = useState<'portfolio' | 'blog'>('portfolio');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async (activeType: 'portfolio' | 'blog') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?type=${activeType}`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error('Error loading categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(type);
    setEditingId(null);
    setError('');
  }, [type]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');
      setCategories((prev) => [...prev, data.category]);
      setNewName('');
    } catch (err: any) {
      setError(err.message || 'Error adding category');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rename category');
      setCategories((prev) => prev.map((c) => (c.id === id ? data.category : c)));
      cancelEdit();
    } catch (err: any) {
      setError(err.message || 'Error renaming category');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    setDeletingId(cat.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err: any) {
      setError(err.message || 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setCategories(reordered);

    try {
      await Promise.all(
        reordered.map((cat, i) =>
          fetch(`/api/admin/categories/${cat.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: i }),
          })
        )
      );
    } catch (e) {
      console.error('Error saving new order:', e);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">
          {type === 'blog'
            ? 'Manage the categories used on blog posts and the public journal filter.'
            : 'Manage the categories used on projects and the public portfolio filter.'}
        </p>
      </div>

      {/* Type Tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setType(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              type === tab.key ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Add new category */}
      <form onSubmit={handleAdd} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(87.41deg, #78B249 2.16%, #598323 100.81%)' }}
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Add</span>
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#78B249] animate-spin" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <Tag className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500 font-medium">No categories yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {categories.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === categories.length - 1}
                  className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(cat.id)}
                    disabled={savingId === cat.id}
                    className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    {savingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-semibold text-[#111827]">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    title="Rename"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    disabled={deletingId === cat.id}
                    title="Delete"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
