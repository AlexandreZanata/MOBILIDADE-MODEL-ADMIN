"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { PermissionsProvider } from "@/components/auth/PermissionsProvider";
import { ErrorState } from "@/components/molecules/ErrorState";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Session verification wrapper for all admin routes.
 * Redirects to /login when unauthenticated.
 * Renders PermissionsProvider after successful verification.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated, setRedirectUrl } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      setRedirectUrl(pathname);
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, pathname, router, setRedirectUrl]);

  // Not yet hydrated — show skeleton
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
