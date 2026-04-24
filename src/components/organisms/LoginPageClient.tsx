"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/stores/authStore";

/**
 * Login page organism.
 * Handles form state locally; delegates auth to useLogin mutation.
 */
export function LoginPageClient() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const redirectUrl = useAuthStore((s) => s.redirectUrl);
  const setRedirectUrl = useAuthStore((s) => s.setRedirectUrl);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);

    login(
      { email, password },
      {
        onSuccess: () => {
          const dest = redirectUrl ?? "/rides";
          setRedirectUrl(null);
          router.replace(dest);
        },
        onError: () => {
          setFieldError(t("errors.invalidCredentials"));
        },
      }
    );
  }

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      data-testid="login-form-container"
    >
      <h1 className="text-xl font-bold text-neutral-900">{t("login.title")}</h1>
      <p className="mt-1 text-sm text-neutral-500">{t("login.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <Input
          label={t("login.emailLabel")}
          type="email"
          autoComplete="email"
          placeholder={t("login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="input-email"
        />

        <Input
          label={t("login.passwordLabel")}
          type="password"
          autoComplete="current-password"
          placeholder={t("login.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={fieldError ?? undefined}
          data-testid="input-password"
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          className="mt-2 w-full"
          data-testid="btn-login"
        >
          {isPending ? t("login.loading") : t("login.submitButton")}
        </Button>
      </form>
    </div>
  );
}
