"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/atoms/Button";
import { RideStatusPill } from "@/components/atoms/RideStatusPill";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Input } from "@/components/atoms/Input";
import { useAdminRides, useAdminCancelRide } from "@/hooks/rides/useAdminRides";
import { Permission } from "@/models/Permission";
import type { AdminRide } from "@/models/Ride";

/**
 * Rides list page organism.
 * Displays all rides with search, status filter, and cancel action.
 */
export function RidesPageClient() {
  const { t, i18n } = useTranslation("rides");
  const { t: tc } = useTranslation("common");

  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState<AdminRide | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, isError, refetch } = useAdminRides({ q: search || undefined });
  const { mutate: cancelRide, isPending: isCancelling } = useAdminCancelRide();

  const rides = data?.items ?? [];

  function handleConfirmCancel() {
    if (!cancelTarget) return;
    cancelRide(
      { rideId: cancelTarget.id, input: { reason: cancelReason || undefined } },
      {
        onSettled: () => {
          setCancelTarget(null);
          setCancelReason("");
        },
      }
    );
  }

  return (
    <Can perform={Permission.RIDE_ADMIN_VIEW} fallback={
      <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
    }>
      <div className="space-y-4" data-testid="rides-page">
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
              data-testid="rides-search"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="space-y-2" data-testid="rides-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState onRetry={() => void refetch()} data-testid="rides-error" />
        )}

        {!isLoading && !isError && rides.length === 0 && (
          <EmptyState namespace="rides" titleKey="empty.title" messageKey="empty.message" />
        )}

        {!isLoading && !isError && rides.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="rides-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.passenger")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.driver")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.status")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.estimatedPrice")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.requestedAt")}</th>
                  <th className="px-4 py-3 text-left">{tc("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rides.map((ride: AdminRide) => (
                  <tr key={ride.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-800">
                      {ride.passenger?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">
                      {ride.driver?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <RideStatusPill status={ride.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-800">
                      {new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "BRL",
                      }).format(ride.estimatedPrice)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Intl.DateTimeFormat(i18n.language, {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(ride.requestedAt))}
                    </td>
                    <td className="px-4 py-3">
                      <Can perform={Permission.RIDE_ADMIN_CANCEL}>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setCancelTarget(ride)}
                          data-testid={`btn-cancel-ride-${ride.id}`}
                        >
                          {t("actions.cancel")}
                        </Button>
                      </Can>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel confirm dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => { setCancelTarget(null); setCancelReason(""); }}
        onConfirm={handleConfirmCancel}
        title={t("cancel.title")}
        description={t("cancel.description")}
        confirmLabel={t("cancel.confirmLabel")}
        cancelLabel={t("cancel.cancelLabel")}
        confirmLoading={isCancelling}
        data-testid="cancel-ride-dialog"
      >
        <Input
          label={t("cancel.reasonLabel")}
          placeholder={t("cancel.reasonPlaceholder")}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          data-testid="input-cancel-reason"
        />
      </ConfirmDialog>
    </Can>
  );
}
