import { resolveApiBase } from "@/lib/apiBase";
import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { authFacade } from "@/facades/authFacade";
import type { Servidor } from "@/models/Servidor";
import type { CreateServidorInput, UpdateServidorInput } from "@/types/servidores";

export const servidoresFacade = {
  async list(): Promise<Servidor[]> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/servidores`
    );
    return handleEnvelopedResponse<Servidor[]>(res);
  },

  async create(input: CreateServidorInput): Promise<Servidor> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/servidores`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    return handleEnvelopedResponse<Servidor>(res);
  },

  async update(id: string, input: UpdateServidorInput): Promise<Servidor> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/servidores/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
    return handleEnvelopedResponse<Servidor>(res);
  },

  async deactivate(id: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${resolveApiBase()}/v1/servidores/${id}`,
      { method: "DELETE" }
    );
    return handleEnvelopedResponse<void>(res);
  },
};
