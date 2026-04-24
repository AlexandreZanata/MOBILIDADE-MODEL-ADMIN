import { resolveApiBase } from "@/lib/apiBase";
import { buildQueryString, throwApiError } from "@/lib/http";
import { authFacade } from "@/facades/authFacade";
import type { ServiceCategory } from "@/models/ServiceCategory";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  ServiceCategoriesListParams,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from "@/types/serviceCategories";

export const serviceCategoriesFacade = {
  /** GET /v1/admin/service-categories */
  async list(
    params: ServiceCategoriesListParams = {}
  ): Promise<PaginatedResponse<ServiceCategory>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/service-categories${buildQueryString(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<PaginatedResponse<ServiceCategory>>;
  },

  /** POST /v1/admin/service-categories */
  async create(input: CreateServiceCategoryInput): Promise<ServiceCategory> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/service-categories`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);

    const raw = (await res.json()) as ServiceCategory & {
      baseFare: string | number;
      perKmRate: string | number;
      minFare: string | number;
    };

    // Normalize decimal strings returned by 201 response
    return {
      ...raw,
      baseFare: parseFloat(String(raw.baseFare)),
      perKmRate: parseFloat(String(raw.perKmRate)),
      minFare: parseFloat(String(raw.minFare)),
    };
  },

  /** PATCH /v1/admin/service-categories/{id} */
  async update(
    id: string,
    input: UpdateServiceCategoryInput
  ): Promise<ServiceCategory> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/service-categories/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<ServiceCategory>;
  },
};
