import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { adminVehiclesFacade } from "@/facades/adminVehiclesFacade";
import {
  adminVehiclesKeys,
  vehicleBrandsKeys,
  vehicleModelsKeys,
  vehicleCategoryRequirementsKeys,
} from "@/lib/queryKeys/adminVehiclesKeys";
import type {
  AdminVehiclesListParams,
  VehicleBrandsListParams,
  VehicleModelsListParams,
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
  UpsertVehicleCategoryRequirementInput,
} from "@/types/vehicles";

// ─── Vehicles ────────────────────────────────────────────────────────────────

/** Query hook for GET /v1/admin/vehicles */
export function useAdminVehicles(params: AdminVehiclesListParams = {}) {
  return useQuery({
    queryKey: adminVehiclesKeys.list(params),
    queryFn: () => adminVehiclesFacade.list(params),
  });
}

// ─── Vehicle Reference — Brands ──────────────────────────────────────────────

/** Query hook for GET /v1/admin/vehicle-reference/brands */
export function useAdminVehicleBrands(params: VehicleBrandsListParams = {}) {
  return useQuery({
    queryKey: vehicleBrandsKeys.list(params),
    queryFn: () => adminVehiclesFacade.listBrands(params),
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

// ─── Vehicle Reference — Models ───────────────────────────────────────────────

/** Query hook for GET /v1/admin/vehicle-reference/models */
export function useAdminVehicleModels(params: VehicleModelsListParams = {}) {
  return useQuery({
    queryKey: vehicleModelsKeys.list(params),
    queryFn: () => adminVehiclesFacade.listModels(params),
  });
}

// ─── Vehicle Category Requirements ───────────────────────────────────────────

/**
 * Query hook for GET /v1/admin/vehicle-category-requirements
 * Returns all requirements as a flat array.
 */
export function useAdminVehicleCategoryRequirements() {
  return useQuery({
    queryKey: vehicleCategoryRequirementsKeys.all,
    queryFn: () => adminVehiclesFacade.listCategoryRequirements(),
  });
}

/**
 * Query hook for GET /v1/admin/vehicle-category-requirements/category/{categoryId}
 * Returns the requirement for a specific service category.
 * Query is disabled when categoryId is empty.
 */
export function useAdminVehicleCategoryRequirement(categoryId: string) {
  return useQuery({
    queryKey: vehicleCategoryRequirementsKeys.byCategory(categoryId),
    queryFn: () => adminVehiclesFacade.getCategoryRequirement(categoryId),
    enabled: !!categoryId,
  });
}

/**
 * Mutation hook for POST /v1/admin/vehicle-category-requirements (upsert).
 * Invalidates both the full list and the specific category key on success.
 */
export function useUpsertVehicleCategoryRequirement() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("vehicles");

  return useMutation({
    mutationFn: (input: UpsertVehicleCategoryRequirementInput) =>
      adminVehiclesFacade.upsertCategoryRequirement(input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleCategoryRequirementsKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: vehicleCategoryRequirementsKeys.byCategory(
          variables.serviceCategoryId
        ),
      });
      toast.success(t("toast.requirementSaved"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/**
 * Mutation hook for DELETE /v1/admin/vehicle-category-requirements/category/{categoryId}.
 * Always show a ConfirmDialog before calling — deletion reverts to global min year.
 */
export function useDeleteVehicleCategoryRequirement() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("vehicles");

  return useMutation({
    mutationFn: (categoryId: string) =>
      adminVehiclesFacade.deleteCategoryRequirement(categoryId),
    onSuccess: (_data, categoryId) => {
      void queryClient.invalidateQueries({
        queryKey: vehicleCategoryRequirementsKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: vehicleCategoryRequirementsKeys.byCategory(categoryId),
      });
      toast.success(t("toast.requirementDeleted"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
