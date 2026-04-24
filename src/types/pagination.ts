/** Cursor-based paginated response envelope used by all list endpoints */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  totalCount: number | null;
}

/** Common query params for paginated list endpoints */
export interface ListParams {
  cursor?: string;
  limit?: number;
  sort?: string;
  q?: string;
}
