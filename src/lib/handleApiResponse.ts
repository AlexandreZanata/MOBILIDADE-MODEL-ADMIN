import { ApiError } from "@/types/api";
import type { ApiEnvelope, ApiErrorPayload } from "@/types/api";

/**
 * Parses an API response that follows the standard envelope format.
 * Throws ApiError on HTTP failure or when success=false.
 */
export async function handleEnvelopedResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await res.json()) as ApiErrorPayload;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(
      res.status,
      payload?.error?.code ?? "UNKNOWN_ERROR",
      payload?.error?.message ?? res.statusText,
      payload?.error?.details
    );
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const envelope = (await res.json()) as ApiEnvelope<T>;

  if (!envelope.success) {
    const err = envelope as unknown as ApiErrorPayload;
    throw new ApiError(
      res.status,
      err.error?.code ?? "UNKNOWN_ERROR",
      err.error?.message ?? "Request failed"
    );
  }

  return envelope.data;
}
