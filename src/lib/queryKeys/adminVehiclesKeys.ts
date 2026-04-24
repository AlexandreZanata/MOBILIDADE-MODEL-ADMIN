import type { AdminVehiclesListParams, VehicleBrandsListParams, VehicleModelsListParams } from "@/types/vehicles";

export const adminVehiclesKeys = {
  all: ["adminVehicles"] as const,
  list: (params?: AdminVehiclesListParams) =>
    [...adminVehiclesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...adminVehiclesKeys.all, "detail", id] as const,
};

export const vehicleBrandsKeys = {
  all: ["vehicleBrands"] as const,
  list: (params?: VehicleBrandsListParams) =>
    [...vehicleBrandsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...vehicleBrandsKeys.all, "detail", id] as const,
};

export const vehicleModelsKeys = {
  all: ["vehicleModels"] as const,
  list: (params?: VehicleModelsListParams) =>
    [...vehicleModelsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...vehicleModelsKeys.all, "detail", id] as const,
};
