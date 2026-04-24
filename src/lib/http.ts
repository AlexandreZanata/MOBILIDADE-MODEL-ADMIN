import { ApiError } from "@/types/api";

/**
 * Builds a URL query string from a params object.
 * Skips undefined and null values. Returns an empty string if no params.
 *
 * @example
 * buildQueryString({ q: "test", limit: 10, cursor: undefined })
 * // → "?q=test&limit=10"
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      q.set(key, String(value));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

/**
 * Parses an error response body and throws a typed ApiError.
 * Always throws — return type is `never`.
 *
 * @example
 * if (!res.ok) return throwApiError(res);
 */
export async function throwApiError(res: Response): Promise<never> {
  let code = "UNKNOWN_ERROR";
  let message = res.statusText || "Unknown error";

  try {
    const body = (await res.json()) as {
      error?: { code?: string; message?: string };
    };
    code = body.error?.code ?? code;
    message = body.error?.message ?? message;
  } catch {
    // Ignore JSON parse errors — use defaults
  }

  throw new ApiError(res.status, code, message);
}
