"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Car } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/models/User";

/** Human-readable role labels — resolved via i18n key. */
const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "auth:roles.admin",
  [UserRole.SUPERVISOR]: "auth:roles.supervisor",
  [UserRole.DISPATCHER]: "auth:roles.dispatcher",
  [UserRole.AGENT]: "auth:roles.agent",
};

/**
 * Login page organism.
 * Features: branded header, show/hide password toggle, role info panel,
 * field-level error display, and redirect to the originally requested URL.
 */
export function LoginPageClient() {
  const { t } = useTranslation(["auth", "nav"]);
  const router = useRouter();
  const redirectUrl = useAuthStore((s) => s.redirectUrl);
  const setRedirectUrl = useAuthStore((s) => s.setRedirectUrl);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);

    login(
      { email, password },
      {
        onSuccess: () => {
          const dest = redirectUrl ?? "/dashboard";
          setRedirectUrl(null);
          router.replace(dest);
        },
        onError: () => {
          setFieldError(t("auth:errors.invalidCredentials"));
        },
      }
    );
  }

  return (
    <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
      {/* Left panel — branding */}
      <div className="hidden flex-col justify-between bg-brand-primary p-10 lg:flex lg:w-2/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Car className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold text-white">{t("nav:appName")}</span>
        </div>

        {/* Tagline */}
        <div>
          <h2 className="text-2xl font-bold leading-snug text-white">
            {t("auth:login.brandHeadline")}
          </h2>
          <p className="mt-3 text-sm text-white/70">
            {t("auth:login.brandSubtitle")}
          </p>
        </div>

        {/* Role info */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {t("auth:login.rolesTitle")}
          </p>
          {Object.entries(ROLE_LABEL_KEYS).map(([, key]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
              <span className="text-sm text-white/80">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Car className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          <span className="text-base font-bold text-neutral-900">{t("nav:appName")}</span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900">{t("auth:login.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("auth:login.subtitle")}</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5"
          noValidate
          data-testid="login-form"
        >
          <Input
            label={t("auth:login.emailLabel")}
            type="email"
            autoComplete="email"
            placeholder={t("auth:login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="input-email"
          />

          {/* Password with show/hide toggle */}
          <div className="relative flex flex-col gap-1">
            <Input
              label={t("auth:login.passwordLabel")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth:login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={fieldError ?? undefined}
              data-testid="input-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? t("auth:login.hidePassword")
                  : t("auth:login.showPassword")
              }
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="mt-1 w-full"
            data-testid="btn-login"
          >
            {isPending ? t("auth:login.loading") : t("auth:login.submitButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}
