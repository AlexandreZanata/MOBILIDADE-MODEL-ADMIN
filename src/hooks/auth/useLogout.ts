import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFacade } from "@/facades/authFacade";
import { useAuthStore } from "@/stores/authStore";

/** Mutation hook for POST /v1/auth/logout */
export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authFacade.logout(),
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
