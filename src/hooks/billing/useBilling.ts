import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { billingFacade } from "@/facades/billingFacade";
import { billingKeys } from "@/lib/queryKeys/billingKeys";
import { CacheTTL } from "@/lib/cache";
import type { UpdateBillingConfigInput, CreateTestDebtInput } from "@/types/billing";

// ─── Config ──────────────────────────────────────────────────────────────────

/** Query hook for GET /api/v1/admin/billing/config */
export function useBillingConfig() {
  return useQuery({
    queryKey: billingKeys.config(),
    queryFn: () => billingFacade.getConfig(),
    ...CacheTTL.LONG,
  });
}

/** Mutation hook for PUT /api/v1/admin/billing/config */
export function useUpdateBillingConfig() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: (input: UpdateBillingConfigInput) =>
      billingFacade.updateConfig(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: billingKeys.config() });
      toast.success(t("toast.configUpdated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

// ─── Cycles ──────────────────────────────────────────────────────────────────

/** Query hook for GET /api/v1/admin/billing/cycles/{cycleId} */
export function useCycleDetail(cycleId: string) {
  return useQuery({
    queryKey: billingKeys.cycleDetail(cycleId),
    queryFn: () => billingFacade.getCycleDetail(cycleId),
    enabled: !!cycleId,
    ...CacheTTL.SHORT,
  });
}

/** Mutation hook for POST /api/v1/admin/billing/cycles/{cycleId}/pix */
export function useGeneratePix(driverId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: (cycleId: string) => billingFacade.generatePix(cycleId),
    onSuccess: (_data, cycleId) => {
      void queryClient.invalidateQueries({
        queryKey: billingKeys.cycleDetail(cycleId),
      });
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverStatus(driverId),
      });
      toast.success(t("toast.pixGenerated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

// ─── Drivers ─────────────────────────────────────────────────────────────────

/** Query hook for GET /api/v1/admin/billing/drivers/{driverId}/status */
export function useDriverBillingStatus(driverId: string) {
  return useQuery({
    queryKey: billingKeys.driverStatus(driverId),
    queryFn: () => billingFacade.getDriverStatus(driverId),
    enabled: !!driverId,
    ...CacheTTL.SHORT,
  });
}

/** Query hook for GET /api/v1/admin/billing/drivers/{driverId}/cycles */
export function useDriverCycles(driverId: string) {
  return useQuery({
    queryKey: billingKeys.driverCycles(driverId),
    queryFn: () => billingFacade.getDriverCycles(driverId),
    enabled: !!driverId,
    ...CacheTTL.SHORT,
  });
}

/** Mutation hook for POST /api/v1/admin/billing/drivers/{driverId}/unblock */
export function useUnblockDriver() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: (driverId: string) => billingFacade.unblockDriver(driverId),
    onSuccess: (_data, driverId) => {
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverStatus(driverId),
      });
      toast.success(t("toast.driverUnblocked"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

/** Query hook for GET /api/v1/admin/billing/jobs/history */
export function useJobHistory() {
  return useQuery({
    queryKey: billingKeys.jobHistory(),
    queryFn: () => billingFacade.getJobHistory(),
    ...CacheTTL.SHORT,
  });
}

/** Mutation hook for POST /api/v1/admin/billing/jobs/billing-cycle/run */
export function useRunBillingCycleJob() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: () => billingFacade.runBillingCycleJob(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: billingKeys.jobHistory() });
      if (result.status === "RUNNING") {
        toast.warning(t("toast.jobAlreadyRunning"));
      } else {
        toast.success(
          t("toast.jobCompleted", {
            cycles: result.cyclesGenerated,
            blocked: result.driversBlocked,
          })
        );
      }
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for POST /api/v1/admin/billing/jobs/expiration-check/run */
export function useRunExpirationCheck() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: () => billingFacade.runExpirationCheck(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: billingKeys.jobHistory() });
      toast.success(
        t("toast.expirationCheckCompleted", {
          expired: result.cyclesExpired,
          blocked: result.driversBlocked,
        })
      );
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

// ─── Test helpers (dev/staging only) ─────────────────────────────────────────

/** Mutation hook for POST /api/v1/admin/billing/test/create-debt */
export function useCreateTestDebt() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: (input: CreateTestDebtInput) =>
      billingFacade.createTestDebt(input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverStatus(variables.driverId),
      });
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverCycles(variables.driverId),
      });
      toast.success(t("toast.testDebtCreated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for DELETE /api/v1/admin/billing/test/debt/{cycleId} */
export function useDeleteTestDebt(driverId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("billing");

  return useMutation({
    mutationFn: (cycleId: string) => billingFacade.deleteTestDebt(cycleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverCycles(driverId),
      });
      void queryClient.invalidateQueries({
        queryKey: billingKeys.driverStatus(driverId),
      });
      toast.success(t("toast.testDebtDeleted"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
