"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Badge } from "@/components/atoms/Badge";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import { useAdminVehicles } from "@/hooks/vehicles/useAdminVehicles";
import { Permission } from "@/models/Permission";
import { VehicleStatus } from "@/models/Vehicle";
import type { BadgeProps } from "@/components/atoms/Badge";

const statusVariant: Record<VehicleStatus, BadgeProps["variant"]> = {
  [VehicleStatus.APPROVED]: "success",
  [VehicleStatus.PENDING_REVIEW]: "warning",
  [VehicleStatus.PENDING_DOCS]: "info",
  [VehicleStatus.REJECTED]: "danger",
};

/**
 * Admin vehicles list page organism.
 */
export function VehiclesPageClient() {
  const { t } = useTranslation("vehicles");
  const { t: tc } = useTranslation("common");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useAdminVehicles({
    q: search || undefined,
  });

  const vehicles = data?.items ?? [];

  return (
    <Can
      perform={Permission.VEHICLE_ADMIN_VIEW}
      fallback={
        <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
      }
    >
      <div className="space-y-4" data-testid="vehicles-page">
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
              data-testid="vehicles-search"
            />
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2" data-testid="vehicles-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState onRetry={() => void refetch()} data-testid="vehicles-error" />
        )}

        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            namespace="vehicles"
            titleKey="empty.title"
            messageKey="empty.message"
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="vehicles-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.licensePlate")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.brand")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.model")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.year")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.color")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-sm text-neutral-900">
                      {v.licensePlate}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">{v.brand}</td>
                    <td className="px-4 py-3 text-neutral-800">{v.model}</td>
                    <td className="px-4 py-3 text-neutral-600">{v.year}</td>
                    <td className="px-4 py-3 text-neutral-600">{v.color}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[v.status]}>
                        {t(`status.${v.status}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Can>
  );
}
