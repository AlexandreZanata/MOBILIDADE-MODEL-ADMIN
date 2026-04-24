import type { ListParams } from "@/types/pagination";

export interface AdminVehiclesListParams extends ListParams {
  status?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VehicleBrandsListParams extends ListParams {}

export interface VehicleModelsListParams extends ListParams {
  "brandId[eq]"?: string;
  "name[contains]"?: string;
}

export interface CreateVehicleBrandInput {
  name: string;
  slug: string;
}

export interface UpdateVehicleBrandInput {
  name?: string;
  slug?: string;
}

/** POST /v1/admin/vehicle-category-requirements — upsert payload */
export interface UpsertVehicleCategoryRequirementInput {
  serviceCategoryId: string;
  /** Minimum vehicle manufacture year. Range: 1900–2100. */
  minYear: number;
}
