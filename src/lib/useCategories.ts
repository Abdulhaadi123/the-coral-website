'use client';

import { useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  order: number;
}

/**
 * Categories for admin screens. The categories API only answers signed-in
 * admins; public pages get the same list from the server (lib/publicData).
 */
export function useCategories(type: 'portfolio' | 'blog' = 'portfolio') {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`/api/admin/categories?type=${type}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(() => {});
  }, [type]);

  return categories;
}
