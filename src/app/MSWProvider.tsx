"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MSWProviderProps {
  children: ReactNode;
}

/**
 * Initializes MSW in development when NEXT_PUBLIC_MOCK_MODE=true.
 * Waits for the worker to be ready before rendering children to avoid race conditions.
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [ready, setReady] = useState(
    process.env.NEXT_PUBLIC_MOCK_MODE !== "true"
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_MODE !== "true") return;

    import("@/msw/browser").then(({ worker }) => {
      void worker
        .start({ onUnhandledRequest: "bypass" })
        .then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
