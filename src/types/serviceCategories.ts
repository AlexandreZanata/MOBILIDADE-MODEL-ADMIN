import type { ListParams } from "@/types/pagination";

export interface ServiceCategoriesListParams extends ListParams {
  "name[contains]"?: string;
  "baseFare[gte]"?: number;
  "perKmRate[lte]"?: number;
}

export interface CreateServiceCategoryInput {
  name: string;
  slug: string;
  baseFare: number;
  perKmRate: number;
  minFare: number;
}

export interface UpdateServiceCategoryInput {
  name?: string;
  slug?: string;
  baseFare?: number;
  perKmRate?: number;
  minFare?: number;
}
