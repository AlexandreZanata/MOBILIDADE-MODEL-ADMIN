import { useTranslation } from "react-i18next";

export interface EmptyStateProps {
  titleKey?: string;
  messageKey?: string;
  namespace?: string;
  "data-testid"?: string;
}

/**
 * Standardized empty state for list views.
 */
export function EmptyState({
  titleKey = "empty.title",
  messageKey = "empty.message",
  namespace = "common",
  ...props
}: EmptyStateProps) {
  const { t } = useTranslation(namespace);

  return (
    <section
      className="rounded-md border border-neutral-200 bg-neutral-50 p-6"
      {...props}
    >
      <h2 className="text-base font-semibold text-neutral-900">{t(titleKey)}</h2>
      <p className="mt-1 text-sm text-neutral-700">{t(messageKey)}</p>
    </section>
  );
}
