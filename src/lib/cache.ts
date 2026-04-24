/**
 * Centralized TanStack Query cache configuration.
 *
 * All stale/gc times are defined here to ensure consistent caching behavior
 * across the entire application. Never hardcode these values in individual hooks.
 *
 * Strategy:
 * - REALTIME  — 0s stale, 2min gc  — live data (active rides, queue)
 * - SHORT     — 1min stale, 5min gc — frequently changing data
 * - STANDARD  — 5min stale, 10min gc — default for most domain lists
 * - LONG      — 15min stale, 30min gc — reference data (brands, categories)
 * - PERMANENT — Infinity stale, 60min gc — static config / enums
 */

export const CacheTTL = {
  REALTIME: {
    staleTime: 0,
    gcTime: 2 * 60_000,
  },
  SHORT: {
    staleTime: 1 * 60_000,
    gcTime: 5 * 60_000,
  },
  STANDARD: {
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  },
  LONG: {
    staleTime: 15 * 60_000,
    gcTime: 30 * 60_000,
  },
  PERMANENT: {
    staleTime: Infinity,
    gcTime: 60 * 60_000,
  },
} as const;

/** Default QueryClient options — applied globally unless overridden per-query. */
export const DEFAULT_QUERY_OPTIONS = {
  queries: {
    ...CacheTTL.STANDARD,
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const;
