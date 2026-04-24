/** Standard API response envelope */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/** Standard API error payload */
export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

/** Typed API error thrown by facades */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
