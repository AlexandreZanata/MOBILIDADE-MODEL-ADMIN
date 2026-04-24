import type { ReactNode } from "react";

/** Minimal layout for auth routes — no sidebar. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      {children}
    </div>
  );
}
