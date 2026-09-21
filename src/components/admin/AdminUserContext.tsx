'use client';

import React, { createContext, useContext } from 'react';
import type { SectionKey } from '@/lib/permissions';

export interface AdminMe {
  id: string;
  email: string;
  name: string;
  role: 'super' | 'editor';
  permissions: SectionKey[];
}

interface AdminUserState {
  admin: AdminMe | null;
}

const AdminUserContext = createContext<AdminUserState>({ admin: null });

export const AdminUserProvider: React.FC<{ admin: AdminMe | null; children: React.ReactNode }> = ({
  admin,
  children,
}) => <AdminUserContext.Provider value={{ admin }}>{children}</AdminUserContext.Provider>;

/** The signed-in admin, loaded (and kept fresh) by the admin layout. */
export function useAdminUser(): AdminMe | null {
  return useContext(AdminUserContext).admin;
}
