/**
 * Resolves the API base URL.
 * In development with mock mode, MSW intercepts all fetch calls.
 * In production, requests go to NEXT_PUBLIC_API_URL.
 */
export function resolveApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}
