import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { adminPassengersFacade } from "@/facades/adminPassengersFacade";
import { adminPassengersKeys } from "@/lib/queryKeys/adminPassengersKeys";
import type { AdminPassengersListParams } from "@/types/passengers";

/** Query hook for GET /v1/admin/passengers */
export function useAdminPassengers(params: AdminPassengersListParams = {}) {
  return useQuery({
    queryKey: adminPassengersKeys.list(params),
    queryFn: () => adminPassengersFacade.list(params),
  });
}

/** Mutation hook for DELETE /v1/admin/passengers/{passengerId} */
export function useDeleteAdminPassenger() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("passengers");

  return useMutation({
    mutationFn: (passengerId: string) => adminPassengersFacade.delete(passengerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPassengersKeys.all });
      toast.success(t("toast.deleted"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for POST /v1/admin/passengers/{passengerId}/reactivate */
export function useReactivateAdminPassenger() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("passengers");

  return useMutation({
    mutationFn: (passengerId: string) => adminPassengersFacade.reactivate(passengerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPassengersKeys.all });
      toast.success(t("toast.reactivated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
