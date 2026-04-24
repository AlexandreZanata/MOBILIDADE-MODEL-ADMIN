import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { serviceCategoriesFacade } from "@/facades/serviceCategoriesFacade";
import { serviceCategoriesKeys } from "@/lib/queryKeys/serviceCategoriesKeys";
import type {
  ServiceCategoriesListParams,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from "@/types/serviceCategories";

/** Query hook for GET /v1/admin/service-categories */
export function useServiceCategories(params: ServiceCategoriesListParams = {}) {
  return useQuery({
    queryKey: serviceCategoriesKeys.list(params),
    queryFn: () => serviceCategoriesFacade.list(params),
  });
}

/** Mutation hook for POST /v1/admin/service-categories */
export function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("serviceCategories");

  return useMutation({
    mutationFn: (input: CreateServiceCategoryInput) =>
      serviceCategoriesFacade.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: serviceCategoriesKeys.all });
      toast.success(t("toast.created"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}

/** Mutation hook for PATCH /v1/admin/service-categories/{id} */
export function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("serviceCategories");

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateServiceCategoryInput }) =>
      serviceCategoriesFacade.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: serviceCategoriesKeys.all });
      toast.success(t("toast.updated"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
