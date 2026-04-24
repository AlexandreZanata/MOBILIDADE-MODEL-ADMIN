import { resolveApiBase } from "@/lib/apiBase";
import { buildQueryString, throwApiError } from "@/lib/http";
import { authFacade } from "@/facades/authFacade";
import type { AdminVehicle, VehicleBrand, VehicleModel } from "@/models/Vehicle";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminVehiclesListParams,
  VehicleBrandsListParams,
  VehicleModelsListParams,
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
} from "@/types/vehicles";

export const adminVehiclesFacade = {
  /** GET /v1/admin/vehicles */
  async list(
    params: AdminVehiclesListParams = {}
  ): Promise<PaginatedResponse<AdminVehicle>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicles${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<AdminVehicle>>;
  },

  /** GET /v1/admin/vehicle-reference/brands */
  async listBrands(
    params: VehicleBrandsListParams = {}
  ): Promise<PaginatedResponse<VehicleBrand>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<VehicleBrand>>;
  },

  /** POST /v1/admin/vehicle-reference/brands */
  async createBrand(input: CreateVehicleBrandInput): Promise<VehicleBrand> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<VehicleBrand>;
  },

  /** PATCH /v1/admin/vehicle-reference/brands/{id} */
  async updateBrand(
    id: string,
    input: UpdateVehicleBrandInput
  ): Promise<VehicleBrand> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<VehicleBrand>;
  },

  /** DELETE /v1/admin/vehicle-reference/brands/{id} */
  async deleteBrand(id: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) return throwApiError(res);
  },

  /** GET /v1/admin/vehicle-reference/models */
  async listModels(
    params: VehicleModelsListParams = {}
  ): Promise<PaginatedResponse<VehicleModel>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/models${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<VehicleModel>>;
  },
};
