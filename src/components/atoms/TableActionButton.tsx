"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

type ActionVariant = "default" | "danger" | "success" | "warning";

const variantClasses: Record<ActionVariant, string> = {
  default:
    "text-neutral-500 hover:bg-brand-primary/10 hover:text-brand-primary focus-visible:ring-brand-primary",
  danger:
    "text-neutral-500 hover:bg-danger/10 hover:text-danger focus-visible:ring-danger",
  success:
    "text-neutral-500 hover:bg-success/10 hover:text-success focus-visible:ring-success",
  warning:
    "text-neutral-500 hover:bg-warning/10 hover:text-warning focus-visible:ring-warning",
};

export interface TableActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon to render inside the button. */
  icon: LucideIcon;
  /** Accessible label — required for icon-only buttons. */
  label: string;
  /** Visual intent of the action. Defaults to "default". */
  variant?: ActionVariant;
  "data-testid"?: string;
}

/**
 * Standardized icon-only action button for table rows.
 *
 * All table action buttons across the admin panel must use this atom
 * to ensure visual consistency and accessible labeling.
 *
 * @example
 * <TableActionButton
 *   icon={Pencil}
 *   label={t("actions.edit")}
 *   variant="default"
 *   onClick={() => openEdit(row)}
 * />
 */
export const TableActionButton = forwardRef<
  HTMLButtonElement,
  TableActionButtonProps
>(({ icon: Icon, label, variant = "default", className = "", ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    title={label}
    className={[
      "inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
      "disabled:cursor-not-allowed disabled:opacity-40",
      variantClasses[variant],
      className,
    ].join(" ")}
    {...props}
  >
    <Icon className="h-4 w-4" aria-hidden="true" />
  </button>
));

TableActionButton.displayName = "TableActionButton";
