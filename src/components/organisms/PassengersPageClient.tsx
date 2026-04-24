"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Trash2, RotateCcw } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import {
  useAdminPassengers,
  useDeleteAdminPassenger,
  useReactivateAdminPassenger,
} from "@/hooks/passengers/useAdminPassengers";
import { Permission } from "@/models/Permission";
import type { AdminPassenger } from "@/models/Passenger";

/**
 * Passengers list page organism.
 * Supports search, soft-delete, and reactivation.
 */
export function PassengersPageClient() {
  const { t, i18n } = useTranslation("passengers");
  const { t: tc } = useTranslation("common");

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminPassenger | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<AdminPassenger | null>(null);

  const { data, isLoading, isError, refetch } = useAdminPassengers({
    q: search || undefined,
  });
  const { mutate: deletePassenger, isPending: isDeleting } = useDeleteAdminPassenger();
  const { mutate: reactivate, isPending: isReactivating } = useReactivateAdminPassenger();

  const passengers = data?.items ?? [];

  return (
    <Can
      perform={Permission.PASSENGER_ADMIN_VIEW}
      fallback={
        <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
      }
    >
      <div className="space-y-4" data-testid="passengers-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">{t("page.title")}</h1>
        </div>

        {/* Search toolbar */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder={tc("actions.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
              data-testid="passengers-search"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="space-y-2" data-testid="passengers-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState onRetry={() => void refetch()} data-testid="passengers-error" />
        )}

        {!isLoading && !isError && passengers.length === 0 && (
          <EmptyState
            namespace="passengers"
            titleKey="empty.title"
            messageKey="empty.message"
          />
        )}

        {!isLoading && !isError && passengers.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="passengers-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.name")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.email")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.phone")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.createdAt")}</th>
                  <th className="px-4 py-3 text-left">{tc("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {passengers.map((p) => (
                  <tr key={p.userId} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.email}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.phone}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Intl.DateTimeFormat(i18n.language, {
                        dateStyle: "short",
                      }).format(new Date(p.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Can perform={Permission.PASSENGER_ADMIN_REACTIVATE}>
                          <button
                            onClick={() => setReactivateTarget(p)}
                            aria-label={t("actions.reactivate")}
                            className="rounded-md p-1.5 hover:bg-success/10 hover:text-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            data-testid={`btn-reactivate-${p.userId}`}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </Can>
                        <Can perform={Permission.PASSENGER_ADMIN_DELETE}>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            aria-label={t("actions.delete")}
                            className="rounded-md p-1.5 hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            data-testid={`btn-delete-${p.userId}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deletePassenger(deleteTarget.userId, { onSettled: () => setDeleteTarget(null) });
        }}
        title={t("delete.title")}
        description={t("delete.description")}
        confirmLabel={t("delete.confirmLabel")}
        cancelLabel={t("delete.cancelLabel")}
        confirmLoading={isDeleting}
        data-testid="delete-passenger-dialog"
      />

      {/* Reactivate confirm */}
      <ConfirmDialog
        open={!!reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={() => {
          if (!reactivateTarget) return;
          reactivate(reactivateTarget.userId, {
            onSettled: () => setReactivateTarget(null),
          });
        }}
        title={t("reactivate.title")}
        description={t("reactivate.description")}
        confirmLabel={t("reactivate.confirmLabel")}
        cancelLabel={t("reactivate.cancelLabel")}
        confirmLoading={isReactivating}
        data-testid="reactivate-passenger-dialog"
      />
    </Can>
  );
}
