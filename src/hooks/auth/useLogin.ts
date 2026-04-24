import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authFacade } from "@/facades/authFacade";
import { useAuthStore } from "@/stores/authStore";
import type { LoginInput } from "@/models/Auth";

/** Mutation hook for POST /v1/auth/login */
export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: (input: LoginInput) => authFacade.login(input),
    onSuccess: ({ user }) => {
      setUser(user);
    },
    onError: () => {
      toast.error(t("errors.invalidCredentials"));
    },
  });
}
