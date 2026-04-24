"use client";

import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SidebarNav } from "@/components/organisms/SidebarNav";

interface AdminShellProps {
  children: ReactNode;
}

/**
 * Root layout shell for the admin panel.
 * Manages sidebar collapse state and renders the main content area.
 */
export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation("nav");

  return (
    <div className="flex h-screen bg-neutral-50" data-testid="admin-shell">
      <SidebarNav
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center border-b border-neutral-200 bg-white px-6">
          <h1 className="text-sm font-semibold text-neutral-900">
            {t("appName")}
          </h1>
        </header>

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
