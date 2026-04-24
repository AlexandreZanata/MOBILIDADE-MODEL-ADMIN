import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { adminVehiclesFacade } from "@/facades/adminVehiclesFacade";
import {
  adminVehiclesKeys,
  vehicleBrandsKeys,
  vehicleModelsKeys,
} from "@/lib/queryKeys/adminVehiclesKeys";
import type {
  AdminVehiclesListParams,
  VehicleBrandsListParams,
  VehicleModelsListParams,
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
} from "@/types/vehicles";

/** Query hook for GET /v1/admin/vehicles */
export function useAdminVehicles(params: AdminVehiclesListParams = {}) {
  return useQuery({
    queryKey: adminVehiclesKeys.list(params),
    queryFn: () => adminVehiclesFacade.list(params),
  });
}

/** Query hook for GET /v1/admin/vehicle-reference/brands */
export function useAdminVehicleBrands(params: VehicleBrandsListParams = {}) {
  return useQuery({
    queryKey: vehicleBrandsKeys.list(params),
    queryFn: () => adminVehiclesFacade.listBrands(params),
  });
}

/** Query hook for GET /v1/admin/vehicle-reference/models */
export function useAdminVehicleModels(params: VehicleModelsListParams = {}) {
  return useQuery({
    queryKey: vehicleModelsKeys.list(params),
    queryFn: () => adminVehiclesFacade.listModels(params),
  });
}

/** Mutation hook for POST /v1/admin/vehicle-reference/brands */
export function useCreateVehicleBrand() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("vehicles");

  return useMutation({
    mutationFn: (input: CreateVehicleBrandInput) =>
      adminVehiclesFacade.createBrand(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehicleBrandsKeys.all });
      toast.success(t("toast.brandCreated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for PATCH /v1/admin/vehicle-reference/brands/{id} */
export function useUpdateVehicleBrand() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("vehicles");

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleBrandInput }) =>
      adminVehiclesFacade.updateBrand(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehicleBrandsKeys.all });
      toast.success(t("toast.brandUpdated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for DELETE /v1/admin/vehicle-reference/brands/{id} */
export function useDeleteVehicleBrand() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("vehicles");

  return useMutation({
    mutationFn: (id: string) => adminVehiclesFacade.deleteBrand(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehicleBrandsKeys.all });
      toast.success(t("toast.brandDeleted"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
