import type { AdminPassengersListParams } from "@/types/passengers";

export const adminPassengersKeys = {
  all: ["adminPassengers"] as const,
  list: (params?: AdminPassengersListParams) =>
    [...adminPassengersKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...adminPassengersKeys.all, "detail", id] as const,
};
