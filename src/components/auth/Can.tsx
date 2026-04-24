"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/auth/usePermissions";
import type { Permission } from "@/models/Permission";

interface CanProps {
  /** The permission required to render children. */
  perform: Permission;
  /** Rendered when the user lacks the permission. Defaults to null. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Render gate based on permission.
 * Never checks `user.role` directly — always uses the permission system.
 *
 * @example
 * <Can perform={Permission.RIDE_ADMIN_CANCEL}>
 *   <Button>Cancel Ride</Button>
 * </Can>
 */
export function Can({ perform, fallback = null, children }: CanProps) {
  const { can } = usePermissions();
  return can(perform) ? <>{children}</> : <>{fallback}</>;
}
