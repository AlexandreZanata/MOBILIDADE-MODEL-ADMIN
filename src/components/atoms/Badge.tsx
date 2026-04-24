import type { ReactNode } from "react";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<Variant, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
  neutral: "bg-neutral-200 text-neutral-700",
};

export interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  "data-testid"?: string;
}

/**
 * Inline semantic chip. Receives text as children — does not use i18n internally.
 */
export function Badge({ variant = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
