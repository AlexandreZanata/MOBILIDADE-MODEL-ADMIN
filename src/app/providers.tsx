"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { DEFAULT_QUERY_OPTIONS } from "@/lib/cache";
import "@/i18n/config";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application-level providers: TanStack Query + i18n + Sonner toaster.
 * Cache defaults are sourced from src/lib/cache.ts — never hardcoded here.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: DEFAULT_QUERY_OPTIONS })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
