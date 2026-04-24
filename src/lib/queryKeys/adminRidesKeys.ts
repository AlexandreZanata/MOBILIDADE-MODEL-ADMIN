import type { AdminRidesListParams } from "@/types/rides";

export const adminRidesKeys = {
  all: ["adminRides"] as const,
  list: (params?: AdminRidesListParams) =>
    [...adminRidesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...adminRidesKeys.all, "detail", id] as const,
};
