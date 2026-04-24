"use client";

import { useContext } from "react";
import { PermissionsContext } from "@/components/auth/PermissionsProvider";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { Permission } from "@/models/Permission";

/** Returns a `can(permission)` checker based on the current user's role. */
export function usePermissions() {
  const ctx = useContext(PermissionsContext);

  const can = (permission: Permission): boolean => {
    if (!ctx?.role) return false;
    return ROLE_PERMISSIONS[ctx.role]?.includes(permission) ?? false;
  };

  return { can, role: ctx?.role ?? null };
}
