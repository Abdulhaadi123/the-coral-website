'use client';

import { useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  order: number;
}

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
