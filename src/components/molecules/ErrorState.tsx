"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";

export interface ErrorStateProps {
  onRetry?: () => void;
  "data-testid"?: string;
}

/**
 * Standardized error state with optional retry button.
 * Uses aria-live="polite" for screen reader announcements.
 */
export function ErrorState({ onRetry, ...props }: ErrorStateProps) {
  const { t } = useTranslation("common");

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-md border border-danger/30 bg-danger/10 p-4"
      {...props}
    >
      <p className="text-sm font-medium text-danger">{t("error.generic")}</p>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="mt-2 text-danger hover:bg-danger/10"
        >
          {t("actions.retry")}
        </Button>
      )}
    </div>
  );
}
