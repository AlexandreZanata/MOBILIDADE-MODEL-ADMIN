import { create } from "zustand";
import type { AuthUser } from "@/models/Auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Distinguishes "loading" from "not authenticated" */
  isHydrated: boolean;
  /** URL to redirect to after successful login */
  redirectUrl: string | null;
  setUser: (user: AuthUser | null) => void;
  setRedirectUrl: (url: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  redirectUrl: null,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isHydrated: true }),

  setRedirectUrl: (url) => set({ redirectUrl: url }),

  clear: () =>
    set({ user: null, isAuthenticated: false, redirectUrl: null }),
}));
