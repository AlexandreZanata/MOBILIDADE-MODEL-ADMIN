import type { LucideIcon } from "lucide-react";

type StatVariant = "default" | "success" | "warning" | "danger" | "info";

const variantClasses: Record<StatVariant, { icon: string; bg: string }> = {
  default: { icon: "text-brand-primary", bg: "bg-brand-primary/10" },
  success: { icon: "text-success", bg: "bg-success/10" },
  warning: { icon: "text-warning", bg: "bg-warning/10" },
  danger: { icon: "text-danger", bg: "bg-danger/10" },
  info: { icon: "text-info", bg: "bg-info/10" },
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: StatVariant;
  isLoading?: boolean;
  "data-testid"?: string;
}

/**
 * Dashboard metric card — displays a single KPI with icon and label.
 * Shows a skeleton pulse when isLoading is true.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  isLoading = false,
  ...props
}: StatCardProps) {
  const { icon: iconClass, bg } = variantClasses[variant];

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
      {...props}
    >
      <div className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", bg].join(" ")}>
        <Icon className={["h-6 w-6", iconClass].join(" ")} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-500">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-7 w-20 animate-pulse rounded-md bg-neutral-200" />
        ) : (
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        )}
      </div>
    </div>
  );
}
