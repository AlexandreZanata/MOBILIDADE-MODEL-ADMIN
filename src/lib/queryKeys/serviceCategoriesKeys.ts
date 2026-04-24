import type { ServiceCategoriesListParams } from "@/types/serviceCategories";

export const serviceCategoriesKeys = {
  all: ["serviceCategories"] as const,
  list: (params?: ServiceCategoriesListParams) =>
    [...serviceCategoriesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) =>
    [...serviceCategoriesKeys.all, "detail", id] as const,
};
