import { resolveApiBase } from "@/lib/apiBase";
import { authFacade } from "@/facades/authFacade";
import { ApiError } from "@/types/api";
import type { AdminPassenger } from "@/models/Passenger";
import type { PaginatedResponse } from "@/types/pagination";
import type { AdminPassengersListParams } from "@/types/passengers";

function buildQuery(params: AdminPassengersListParams): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) q.set(k, String(v));
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

export const adminPassengersFacade = {
  /** GET /v1/admin/passengers */
  async list(
    params: AdminPassengersListParams = {}
  ): Promise<PaginatedResponse<AdminPassenger>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers${buildQuery(params)}`
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<PaginatedResponse<AdminPassenger>>;
  },

  /** DELETE /v1/admin/passengers/{passengerId} */
  async delete(passengerId: string): Promise<{ message: string }> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers/${passengerId}`,
      { method: "DELETE" }
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<{ message: string }>;
  },

  /** POST /v1/admin/passengers/{passengerId}/reactivate */
  async reactivate(passengerId: string): Promise<{ message: string }> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers/${passengerId}/reactivate`,
      { method: "POST" }
    );
    if (!res.ok) return parseError(res);
    return res.json() as Promise<{ message: string }>;
  },
};
