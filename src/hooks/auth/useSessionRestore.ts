import { useEffect, useRef } from "react";
import { authFacade } from "@/facades/authFacade";
import { useAuthStore } from "@/stores/authStore";

/**
 * Restores the user session on app boot by attempting a token refresh.
 *
 * - If a valid refresh token exists in sessionStorage, exchanges it for a
 *   new access token and hydrates the auth store with the decoded user.
 * - If no token exists or the refresh fails, marks the store as hydrated
 *   with no user, which causes AuthGuard to redirect to /login.
 *
 * Must be called once at the top of the component tree (AuthGuard).
 * Uses a ref guard to prevent double-invocation in React Strict Mode.
 */
export function useSessionRestore() {
  const setUser = useAuthStore((s) => s.setUser);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const ran = useRef(false);

  useEffect(() => {
    // Already hydrated (e.g. just logged in) — nothing to do
    if (isHydrated) return;
    // Strict Mode double-invoke guard
    if (ran.current) return;
    ran.current = true;

    authFacade.restoreSession().then((user) => {
      // setUser(null) still sets isHydrated: true via the store action
      setUser(user);
    });
  }, [isHydrated, setUser]);
}
