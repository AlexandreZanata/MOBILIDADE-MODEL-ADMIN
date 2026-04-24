"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  "data-testid"?: string;
}

/**
 * Sidebar navigation link. Detects active route via usePathname.
 */
export function NavItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
  ...props
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        isActive
          ? "bg-brand-primary/10 text-brand-primary"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      ].join(" ")}
      {...props}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
