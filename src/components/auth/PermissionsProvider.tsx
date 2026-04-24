"use client";

import { createContext, type ReactNode } from "react";
import type { UserRole } from "@/models/User";

interface PermissionsContextValue {
  role: UserRole;
}

export const PermissionsContext = createContext<PermissionsContextValue | null>(null);

interface PermissionsProviderProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Injects the authenticated user's role into the permissions context.
 * Rendered by AuthGuard after successful session verification.
 */
export function PermissionsProvider({ role, children }: PermissionsProviderProps) {
  return (
    <PermissionsContext.Provider value={{ role }}>
      {children}
    </PermissionsContext.Provider>
  );
}
