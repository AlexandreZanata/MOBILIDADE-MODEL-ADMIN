import type { AdminVehiclesListParams } from "@/types/vehicles";

export const adminVehiclesKeys = {
  all: ["adminVehicles"] as const,
  list: (params?: AdminVehiclesListParams) =>
    [...adminVehiclesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...adminVehiclesKeys.all, "detail", id] as const,
};

export const vehicleBrandsKeys = {
  all: ["vehicleBrands"] as const,
  list: (params?: Record<string, string | undefined>) =>
    [...vehicleBrandsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...vehicleBrandsKeys.all, "detail", id] as const,
};

export const vehicleModelsKeys = {
  all: ["vehicleModels"] as const,
  list: (params?: Record<string, string | undefined>) =>
    [...vehicleModelsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...vehicleModelsKeys.all, "detail", id] as const,
};
