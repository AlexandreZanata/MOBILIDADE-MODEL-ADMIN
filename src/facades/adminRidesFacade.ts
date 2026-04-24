import { resolveApiBase } from "@/lib/apiBase";
import { authFacade } from "@/facades/authFacade";
import { ApiError } from "@/types/api";
import type { AdminRide, CancelRideResult } from "@/models/Ride";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminRidesListParams,
  UpdateRideStatusInput,
  CancelRideInput,
} from "@/types/rides";

function buildQuery(params: AdminRidesListParams): string {
  const q = new URLSearchParams();
  if (params.cursor) q.set("cursor", params.cursor);
  if (params.limit) q.set("limit", String(params.limit));
  if (params.sort) q.set("sort", params.sort);
  if (params.q) q.set("q", params.q);
  if (params.status) q.set("status", params.status);
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

export const adminRidesFacade = {
  /** GET /v1/admin/rides */
  async list(
    params: AdminRidesListParams = {}
  ): Promise<PaginatedResponse<AdminRide>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/rides${buildQuery(params)}`
    );
    if (!res.ok) return parseError(res);
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
    if (!res.ok) return parseError(res);
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
    if (!res.ok) return parseError(res);
    return res.json() as Promise<CancelRideResult>;
  },
};
