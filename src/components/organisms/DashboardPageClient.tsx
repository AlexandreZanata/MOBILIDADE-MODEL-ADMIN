"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Car, Users, Layers, Activity, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/atoms/StatCard";
import { RideStatusPill } from "@/components/atoms/RideStatusPill";
import { ErrorState } from "@/components/molecules/ErrorState";
import { Can } from "@/components/auth/Can";
import { useAdminRides } from "@/hooks/rides/useAdminRides";
import { useAdminPassengers } from "@/hooks/passengers/useAdminPassengers";
import { useAdminVehicles } from "@/hooks/vehicles/useAdminVehicles";
import { useAuthStore } from "@/stores/authStore";
import { Permission } from "@/models/Permission";
import { RideStatus } from "@/models/Ride";
import { VehicleStatus } from "@/models/Vehicle";
import type { AdminRide } from "@/models/Ride";

/**
 * Dashboard page organism.
 *
 * Displays platform KPIs (rides, passengers, vehicles) and a recent rides
 * preview. All data comes from existing domain hooks — no new API calls.
 * Each stat card is permission-gated so users only see what they can access.
 */
export function DashboardPageClient() {
  const { t, i18n } = useTranslation("dashboard");
  const user = useAuthStore((s) => s.user);

  const {
    data: ridesData,
    isLoading: ridesLoading,
    isError: ridesError,
    refetch: refetchRides,
  } = useAdminRides({ limit: 5 });

  const {
    data: passengersData,
    isLoading: passengersLoading,
  } = useAdminPassengers({ limit: 1 });

  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
  } = useAdminVehicles({ limit: 1 });

  const rides = ridesData?.items ?? [];
  const totalRides = ridesData?.totalCount ?? 0;
  const totalPassengers = passengersData?.totalCount ?? 0;
  const totalVehicles = vehiclesData?.totalCount ?? 0;

  const activeRides = rides.filter(
    (r) =>
      r.status === RideStatus.EM_ANDAMENTO ||
      r.status === RideStatus.MOTORISTA_A_CAMINHO ||
      r.status === RideStatus.MOTORISTA_ACEITOU ||
      r.status === RideStatus.MOTORISTA_CHEGOU ||
      r.status === RideStatus.AGUARDANDO_MOTORISTA
  ).length;

  const approvedVehicles = vehiclesData?.items.filter(
    (v) => v.status === VehicleStatus.APPROVED
  ).length ?? 0;

  const pendingVehicles = vehiclesData?.items.filter(
    (v) =>
      v.status === VehicleStatus.PENDING_REVIEW ||
      v.status === VehicleStatus.PENDING_DOCS
  ).length ?? 0;

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          {t("welcome.greeting", { name: user?.name ?? "" })}
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          {t("page.subtitle")}
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Can perform={Permission.RIDE_ADMIN_VIEW}>
          <StatCard
            label={t("stats.totalRides")}
            value={totalRides}
            icon={Car}
            variant="default"
            isLoading={ridesLoading}
            data-testid="stat-total-rides"
          />
        </Can>

        <Can perform={Permission.RIDE_ADMIN_VIEW}>
          <StatCard
            label={t("stats.activeRides")}
            value={activeRides}
            icon={Activity}
            variant="info"
            isLoading={ridesLoading}
            data-testid="stat-active-rides"
          />
        </Can>

        <Can perform={Permission.PASSENGER_ADMIN_VIEW}>
          <StatCard
            label={t("stats.totalPassengers")}
            value={totalPassengers}
            icon={Users}
            variant="success"
            isLoading={passengersLoading}
            data-testid="stat-total-passengers"
          />
        </Can>

        <Can perform={Permission.VEHICLE_ADMIN_VIEW}>
          <StatCard
            label={t("stats.totalVehicles")}
            value={totalVehicles}
            icon={Layers}
            variant="default"
            isLoading={vehiclesLoading}
            data-testid="stat-total-vehicles"
          />
        </Can>

        <Can perform={Permission.VEHICLE_ADMIN_VIEW}>
          <StatCard
            label={t("stats.approvedVehicles")}
            value={approvedVehicles}
            icon={CheckCircle}
            variant="success"
            isLoading={vehiclesLoading}
            data-testid="stat-approved-vehicles"
          />
        </Can>

        <Can perform={Permission.VEHICLE_ADMIN_VIEW}>
          <StatCard
            label={t("stats.pendingVehicles")}
            value={pendingVehicles}
            icon={Clock}
            variant="warning"
            isLoading={vehiclesLoading}
            data-testid="stat-pending-vehicles"
          />
        </Can>
      </div>

      {/* Recent rides */}
      <Can perform={Permission.RIDE_ADMIN_VIEW}>
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              {t("recentRides.title")}
            </h2>
            <Link
              href="/rides"
              className="text-xs font-medium text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              {t("recentRides.viewAll")}
            </Link>
          </div>

          {ridesError && (
            <div className="p-4">
              <ErrorState onRetry={() => void refetchRides()} data-testid="dashboard-rides-error" />
            </div>
          )}

          {ridesLoading && (
            <div className="divide-y divide-neutral-100" data-testid="dashboard-rides-skeleton">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
                </div>
              ))}
            </div>
          )}

          {!ridesLoading && !ridesError && rides.length === 0 && (
            <p className="px-5 py-6 text-sm text-neutral-500">
              {t("recentRides.title")}
            </p>
          )}

          {!ridesLoading && !ridesError && rides.length > 0 && (
            <ul className="divide-y divide-neutral-100" data-testid="dashboard-rides-list">
              {rides.map((ride: AdminRide) => (
                <li
                  key={ride.id}
                  className="flex items-center gap-4 px-5 py-3 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-neutral-900">
                    {ride.passenger?.name ?? "—"}
                  </span>
                  <span className="shrink-0 text-neutral-500">
                    {new Intl.DateTimeFormat(i18n.language, {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(ride.requestedAt))}
                  </span>
                  <RideStatusPill status={ride.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Can>
    </div>
  );
}
