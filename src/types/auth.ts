import type { AuthUser, LoginInput, RegisterInput, TokenPair } from "@/models/Auth";

export type { AuthUser, LoginInput, RegisterInput, TokenPair };

/** Raw login response from the API (before normalization) */
export interface LoginApiResponse {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles?: string[];
  emailVerified?: boolean;
  createdAt?: string;
}

/** Refresh token response */
export interface RefreshApiResponse {
  accessToken: string;
  refreshToken?: string;
}
