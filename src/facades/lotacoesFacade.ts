import { resolveApiBase } from "@/lib/apiBase";
import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { authFacade } from "@/facades/authFacade";
import type { Lotacao } from "@/models/Lotacao";
import type { CreateLotacaoInput, UpdateLotacaoInput } from "@/types/lotacoes";

export const lotacoesFacade = {
  async list(): Promise<Lotacao[]> {
    const res = await authFacade.fetchWithAuth(`${resolveApiBase()}/v1/lotacoes`);
    return handleEnvelopedResponse<Lotacao[]>(res);
  },

  async create(input: CreateLotacaoInput): Promise<Lotacao> {
    const res = await authFacade.fetchWithAuth(`${resolveApiBase()}/v1/lotacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<Lotacao>(res);
  },

  async update(id: string, input: UpdateLotacaoInput): Promise<Lotacao> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/lotacoes/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    return handleEnvelopedResponse<Lotacao>(res);
  },

  async deactivate(id: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/lotacoes/${id}`,
      { method: "DELETE" }
    );
    return handleEnvelopedResponse<void>(res);
  },

  async reactivate(id: string): Promise<Lotacao> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/lotacoes/${id}/reactivate`,
      { method: "POST" }
    );
    return handleEnvelopedResponse<Lotacao>(res);
  },
};
