"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useSessionRestore } from "@/hooks/auth/useSessionRestore";
import { PermissionsProvider } from "@/components/auth/PermissionsProvider";
import { ErrorState } from "@/components/molecules/ErrorState";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Session verification wrapper for all admin routes.
 *
 * On mount, attempts to restore the session from sessionStorage via
 * useSessionRestore. Once hydrated:
 * - Authenticated → renders children inside PermissionsProvider
 * - Unauthenticated → redirects to /login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated, setRedirectUrl } = useAuthStore();

  // Attempt session restore on first render
  useSessionRestore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      setRedirectUrl(pathname);
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, pathname, router, setRedirectUrl]);

  // Waiting for session restore to complete
  if (!isHydrated) {
    return (
      <div className="flex h-screen flex-col gap-4 p-8" data-testid="auth-guard-skeleton">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-full animate-pulse rounded-md bg-neutral-200" />
        ))}
      </div>
    );
  }

  // Not authenticated — redirect in progress
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <PermissionsProvider role={user.role}>
      {children}
    </PermissionsProvider>
  );
}

export { ErrorState };
