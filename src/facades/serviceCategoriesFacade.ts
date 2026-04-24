import { resolveApiBase } from "@/lib/apiBase";
import { authFacade } from "@/facades/authFacade";
import { ApiError } from "@/types/api";
import type { ServiceCategory } from "@/models/ServiceCategory";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  ServiceCategoriesListParams,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from "@/types/serviceCategories";

function buildQuery(params: Record<string, string | number | undefined | null>): string {
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

export const serviceCategoriesFacade = {
  /** GET /v1/admin/service-categories */
  async list(
    params: ServiceCategoriesListParams = {}
  ): Promise<PaginatedResponse<ServiceCategory>> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/admin/service-categories${buildQuery(params as Record<string, string | number | undefined | null>)}`
    );
    if (!res.ok) return parseError(res);
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
    if (!res.ok) return parseError(res);
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
    if (!res.ok) return parseError(res);
    return res.json() as Promise<ServiceCategory>;
  },
};
