import { resolveApiBase } from "@/lib/apiBase";
import { authFacade } from "@/facades/authFacade";
import { ApiError } from "@/types/api";
import type { AdminVehicle, VehicleBrand, VehicleModel } from "@/models/Vehicle";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminVehiclesListParams,
  VehicleBrandsListParams,
  VehicleModelsListParams,
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
} from "@/types/vehicles";

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) q.set(k, String(v));
  });
  const str = q.toString();
  return str ? `?${str}` : "";
}

async function parseError(res: Response): Promise<never> {
  let code = "UNKNOWN_ERROR";
  let message = res.statusText;
  try {
    const body = (await res.json()) as { error?: { code?: string; message?: string } };
    code = body.error?.code ?? code;
    message = body.error?.message ?? message;
  } catch {
    // ignore
  }
  throw new ApiError(res.status, code, message);
}

export const adminVehiclesFacade = {
  /** GET /v1/admin/vehicles */
  async list(
    params: AdminVehiclesListParams = {}
  ): Promise<PaginatedResponse<AdminVehicle>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicles${buildQuery(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<PaginatedResponse<AdminVehicle>>;
  },

  /** GET /v1/admin/vehicle-reference/brands */
  async listBrands(
    params: VehicleBrandsListParams = {}
  ): Promise<PaginatedResponse<VehicleBrand>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands${buildQuery(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return parseError(res);
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
    if (!res.ok) return parseError(res);
    return res.json() as Promise<VehicleBrand>;
  },

  /** PATCH /v1/admin/vehicle-reference/brands/{id} */
  async updateBrand(id: string, input: UpdateVehicleBrandInput): Promise<VehicleBrand> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<VehicleBrand>;
  },

  /** DELETE /v1/admin/vehicle-reference/brands/{id} */
  async deleteBrand(id: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/brands/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) return parseError(res);
  },

  /** GET /v1/admin/vehicle-reference/models */
  async listModels(
    params: VehicleModelsListParams = {}
  ): Promise<PaginatedResponse<VehicleModel>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/vehicle-reference/models${buildQuery(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<PaginatedResponse<VehicleModel>>;
  },
};
