"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  /** Optional extra content (e.g. reason input) rendered between description and buttons */
  children?: ReactNode;
  "data-testid"?: string;
}

/**
 * Confirmation dialog for destructive or irreversible actions.
 * Returns focus to the trigger element on close.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmDisabled = false,
  confirmLoading = false,
  children,
  ...props
}: ConfirmDialogProps) {
  const { t } = useTranslation("common");
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      {...props}
    >
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-neutral-600">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel ?? t("confirm.cancelLabel")}
          </Button>
          <Button
            ref={confirmRef}
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={confirmDisabled}
            isLoading={confirmLoading}
          >
            {confirmLabel ?? t("confirm.confirmLabel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
