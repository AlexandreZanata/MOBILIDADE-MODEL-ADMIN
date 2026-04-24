import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { adminRidesFacade } from "@/facades/adminRidesFacade";
import { adminRidesKeys } from "@/lib/queryKeys/adminRidesKeys";
import type { AdminRidesListParams, UpdateRideStatusInput, CancelRideInput } from "@/types/rides";

/** Query hook for GET /v1/admin/rides */
export function useAdminRides(params: AdminRidesListParams = {}) {
  return useQuery({
    queryKey: adminRidesKeys.list(params),
    queryFn: () => adminRidesFacade.list(params),
  });
}

/** Mutation hook for PATCH /v1/admin/rides/{rideId}/status */
export function useAdminUpdateRideStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("rides");

  return useMutation({
    mutationFn: ({ rideId, input }: { rideId: string; input: UpdateRideStatusInput }) =>
      adminRidesFacade.updateStatus(rideId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRidesKeys.all });
      toast.success(t("toast.statusUpdated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for POST /v1/admin/rides/{rideId}/cancel */
export function useAdminCancelRide() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("rides");

  return useMutation({
    mutationFn: ({ rideId, input }: { rideId: string; input?: CancelRideInput }) =>
      adminRidesFacade.cancelRide(rideId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRidesKeys.all });
      toast.success(t("toast.cancelled"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
