import { resolveApiBase } from "@/lib/apiBase";
import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { authFacade } from "@/facades/authFacade";
import type { Cargo } from "@/models/Cargo";
import type { CreateCargoInput, UpdateCargoInput } from "@/types/cargos";

export const cargosFacade = {
  async list(): Promise<Cargo[]> {
    const res = await authFacade.fetchWithAuth(`${resolveApiBase()}/v1/cargos`);
    return handleEnvelopedResponse<Cargo[]>(res);
  },

  async create(input: CreateCargoInput): Promise<Cargo> {
    const res = await authFacade.fetchWithAuth(`${resolveApiBase()}/v1/cargos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<Cargo>(res);
  },

  async update(id: string, input: UpdateCargoInput): Promise<Cargo> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/cargos/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    return handleEnvelopedResponse<Cargo>(res);
  },

  async deactivate(id: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/cargos/${id}`,
      { method: "DELETE" }
    );
    return handleEnvelopedResponse<void>(res);
  },
};
