import type { ListParams } from "@/types/pagination";

export interface AdminPassengersListParams extends ListParams {
  "birthDate[gte]"?: string;
  "birthDate[lte]"?: string;
}
