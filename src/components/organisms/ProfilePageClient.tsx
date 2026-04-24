"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LogOut, User, Mail, Shield, Activity, Hash } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/auth/useLogout";
import { UserRole } from "@/models/User";
import type { BadgeProps } from "@/components/atoms/Badge";
import { useState } from "react";

const roleBadgeVariant: Record<UserRole, BadgeProps["variant"]> = {
  [UserRole.ADMIN]: "danger",
  [UserRole.SUPERVISOR]: "warning",
  [UserRole.DISPATCHER]: "info",
  [UserRole.AGENT]: "neutral",
};

/**
 * Profile page organism.
 * Displays the authenticated user's information from the auth store
 * (populated at login — no additional API call needed).
 */
export function ProfilePageClient() {
  const { t } = useTranslation("profile");
  const { t: tc } = useTranslation("common");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  if (!user) return null;

  const fields = [
    { icon: User, label: t("fields.name"), value: user.name },
    { icon: Mail, label: t("fields.email"), value: user.email },
    { icon: Hash, label: t("fields.id"), value: user.id },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6" data-testid="profile-page">
      {/* Header card */}
      <div className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-neutral-900">{user.name}</h1>
          <p className="mt-0.5 truncate text-sm text-neutral-500">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={roleBadgeVariant[user.role]}>
              {t(`roles.${user.role}`)}
            </Badge>
            <Badge variant={user.active ? "success" : "neutral"}>
              {user.active ? t("status.active") : t("status.inactive")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">{t("page.subtitle")}</h2>
        </div>
        <ul className="divide-y divide-neutral-100">
          {fields.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                <Icon className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="truncate text-sm font-medium text-neutral-900">{value}</p>
              </div>
            </li>
          ))}
          <li className="flex items-center gap-4 px-6 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              <Shield className="h-4 w-4 text-brand-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500">{t("fields.role")}</p>
              <Badge variant={roleBadgeVariant[user.role]}>
                {t(`roles.${user.role}`)}
              </Badge>
            </div>
          </li>
          <li className="flex items-center gap-4 px-6 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              <Activity className="h-4 w-4 text-brand-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500">{t("fields.status")}</p>
              <Badge variant={user.active ? "success" : "neutral"}>
                {user.active ? t("status.active") : t("status.inactive")}
              </Badge>
            </div>
          </li>
        </ul>
      </div>

      {/* Session section */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">{t("session.title")}</h2>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-neutral-900">{t("session.logout")}</p>
            <p className="text-xs text-neutral-500">{t("session.logoutDescription")}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setLogoutConfirm(true)}
            isLoading={isLoggingOut}
            data-testid="btn-logout"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t("session.logout")}
          </Button>
        </div>
      </div>

      {/* Logout confirm */}
      <ConfirmDialog
        open={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onConfirm={() => {
          logout(undefined, { onSettled: () => router.replace("/login") });
          setLogoutConfirm(false);
        }}
        title={t("session.logout")}
        description={t("session.logoutDescription")}
        confirmLabel={t("session.logout")}
        cancelLabel={tc("actions.cancel")}
        data-testid="logout-confirm-dialog"
      />
    </div>
  );
}
