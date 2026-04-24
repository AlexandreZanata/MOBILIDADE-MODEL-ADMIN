"use client";

import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/auth/useLogout";
import { UserRole } from "@/models/User";
import type { BadgeProps } from "@/components/atoms/Badge";

const roleBadgeVariant: Record<UserRole, BadgeProps["variant"]> = {
  [UserRole.ADMIN]: "danger",
  [UserRole.SUPERVISOR]: "warning",
  [UserRole.DISPATCHER]: "info",
  [UserRole.AGENT]: "neutral",
};

interface UserMenuProps {
  collapsed?: boolean;
}

/**
 * User identity block at the bottom of the sidebar.
 * Shows avatar, name, role badge, and logout button.
 */
export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { t } = useTranslation("common");
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Avatar name={user.name} size="sm" />
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900">
            {user.name}
          </p>
          <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
        </div>
      )}
      {!collapsed && (
        <button
          onClick={() => logout()}
          disabled={isPending}
          aria-label={t("actions.logout")}
          className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
