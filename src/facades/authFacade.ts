import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";
import type { AuthUser, LoginInput, TokenPair } from "@/models/Auth";
import type { LoginApiResponse, RefreshApiResponse } from "@/types/auth";
import { UserRole } from "@/models/User";

// --- In-memory access token (never persisted to localStorage) ---
let _accessToken: string | null = null;

const REFRESH_KEY = "mobiliade.refreshToken";

// Mutex: prevents duplicate concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

export const authFacade = {
  // --- Token helpers ---
  getAccessToken(): string | null {
    return _accessToken;
  },

  storeTokens(pair: TokenPair): void {
    _accessToken = pair.accessToken;
    sessionStorage.setItem(REFRESH_KEY, pair.refreshToken);
  },

  clearTokens(): void {
    _accessToken = null;
    sessionStorage.removeItem(REFRESH_KEY);
  },

  // --- POST /v1/auth/login ---
  async login(input: LoginInput): Promise<{ user: AuthUser; tokens: TokenPair }> {
    const res = await fetch(`${resolveApiBase()}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new ApiError(res.status, "AUTH_FAILED", "Invalid credentials");
    }

    const data = (await res.json()) as LoginApiResponse;
    const tokens: TokenPair = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    authFacade.storeTokens(tokens);

    const rawRole = data.roles?.[0]?.toUpperCase();
    const role = Object.values(UserRole).includes(rawRole as UserRole)
      ? (rawRole as UserRole)
      : UserRole.AGENT;

    const user: AuthUser = {
      id: data.id,
      name: data.email.split("@")[0],
      email: data.email,
      role,
      active: true,
    };

    return { user, tokens };
  },

  // --- POST /v1/auth/logout ---
  async logout(): Promise<void> {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    const accessToken = _accessToken;

    if (accessToken && refreshToken) {
      try {
        await fetch(`${resolveApiBase()}/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refreshToken,
          },
        });
      } catch {
        // best-effort — always clear local state
      }
    }

    authFacade.clearTokens();
  },

  // --- POST /v1/auth/refresh (with mutex) ---
  async refreshAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      const refreshToken = sessionStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        throw new ApiError(401, "NO_REFRESH_TOKEN", "No refresh token available");
      }

      const res = await fetch(`${resolveApiBase()}/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        authFacade.clearTokens();
        throw new ApiError(401, "REFRESH_FAILED", "Session expired");
      }

      const data = (await res.json()) as RefreshApiResponse;
      _accessToken = data.accessToken;

      // Rotate refresh token if server returns a new one
      if (data.refreshToken) {
        sessionStorage.setItem(REFRESH_KEY, data.refreshToken);
      }

      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  },

  // --- Authenticated fetch helper (auto-refresh on 401) ---
  async fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
    const token = _accessToken;
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(url, { ...init, headers });

    if (res.status === 401) {
      try {
        const newToken = await authFacade.refreshAccessToken();
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetch(url, { ...init, headers });
      } catch {
        throw new ApiError(401, "SESSION_EXPIRED", "Session expired");
      }
    }

    return res;
  },
};
