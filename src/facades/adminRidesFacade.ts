import { resolveApiBase } from "@/lib/apiBase";
import { buildQueryString, throwApiError } from "@/lib/http";
import { authFacade } from "@/facades/authFacade";
import type { AdminRide, CancelRideResult } from "@/models/Ride";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminRidesListParams,
  UpdateRideStatusInput,
  CancelRideInput,
} from "@/types/rides";

export const adminRidesFacade = {
  /** GET /v1/admin/rides */
  async list(
    params: AdminRidesListParams = {}
  ): Promise<PaginatedResponse<AdminRide>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/rides${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<AdminRide>>;
  },

  /** PATCH /v1/admin/rides/{rideId}/status */
  async updateStatus(
    rideId: string,
    input: UpdateRideStatusInput
  ): Promise<AdminRide> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/rides/${rideId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<AdminRide>;
  },

  /** POST /v1/admin/rides/{rideId}/cancel */
  async cancelRide(
    rideId: string,
    input: CancelRideInput = {}
  ): Promise<CancelRideResult> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/rides/${rideId}/cancel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<CancelRideResult>;
  },
};
