import { resolveApiBase } from "@/lib/apiBase";
import { buildQueryString, throwApiError } from "@/lib/http";
import { authFacade } from "@/facades/authFacade";
import type { AdminPassenger } from "@/models/Passenger";
import type { PaginatedResponse } from "@/types/pagination";
import type { AdminPassengersListParams } from "@/types/passengers";

export const adminPassengersFacade = {
  /** GET /v1/admin/passengers */
  async list(
    params: AdminPassengersListParams = {}
  ): Promise<PaginatedResponse<AdminPassenger>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<AdminPassenger>>;
  },

  /** DELETE /v1/admin/passengers/{passengerId} */
  async delete(passengerId: string): Promise<{ message: string }> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers/${passengerId}`,
      { method: "DELETE" }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<{ message: string }>;
  },

  /** POST /v1/admin/passengers/{passengerId}/reactivate */
  async reactivate(passengerId: string): Promise<{ message: string }> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/passengers/${passengerId}/reactivate`,
      { method: "POST" }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<{ message: string }>;
  },
};
