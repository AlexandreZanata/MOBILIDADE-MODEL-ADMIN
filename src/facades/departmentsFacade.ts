import { resolveApiBase } from "@/lib/apiBase";
import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { authFacade } from "@/facades/authFacade";
import type { Department } from "@/models/Department";
import type { CreateDepartmentInput } from "@/types/departments";

export const departmentsFacade = {
  async list(): Promise<Department[]> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/departments`
    );
    return handleEnvelopedResponse<Department[]>(res);
  },

  async create(input: CreateDepartmentInput): Promise<Department> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/departments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    return handleEnvelopedResponse<Department>(res);
  },
};
