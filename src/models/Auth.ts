import type { UserRole } from "@/models/User";

/** Authenticated user returned by /auth/me */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

/** Login request payload */
export interface LoginInput {
  email: string;
  password: string;
}

/** Registration request payload */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** JWT token pair */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
