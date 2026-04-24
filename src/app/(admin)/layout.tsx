import type { ReactNode } from "react";
import { AuthGuard } from "@/components/organisms/AuthGuard";
import { AdminShell } from "@/components/organisms/AdminShell";

/** Admin layout — wraps all authenticated routes with AuthGuard + AdminShell. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
