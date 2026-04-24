"use client";

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavItem } from "@/components/molecules/NavItem";
import { UserMenu } from "@/components/molecules/UserMenu";
import { Can } from "@/components/auth/Can";
import { NAV_ITEMS } from "@/config/navigation";

interface SidebarNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Animated sidebar navigation with collapse support.
 * Each nav item is gated by its required permission via <Can>.
 */
export function SidebarNav({ collapsed, onToggle }: SidebarNavProps) {
  const { t } = useTranslation(["nav", "common"]);

  return (
    <aside
      className={[
        "flex h-screen flex-col border-r border-neutral-200 bg-white",
        "transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-neutral-100 px-4">
        {!collapsed && (
          <span className="truncate text-sm font-bold text-neutral-900">
            {t("nav:appName")}
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Can perform={item.permission}>
                <NavItem
                  href={item.href}
                  label={t(item.labelKey)}
                  icon={item.icon}
                  collapsed={collapsed}
                  data-testid={`nav-${item.key}`}
                />
              </Can>
            </li>
          ))}
        </ul>
      </nav>

      {/* User menu */}
      <div className="border-t border-neutral-100">
        <UserMenu collapsed={collapsed} />
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-neutral-100 px-2 py-2">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
}
