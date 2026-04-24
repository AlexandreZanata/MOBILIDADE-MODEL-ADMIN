"use client";

import { useId } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  "data-testid"?: string;
}

/**
 * Accessible input field with integrated label, error, and helper text.
 * Automatically links label and error via aria attributes.
 */
export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        className={[
          "h-9 w-full rounded-lg border bg-neutral-50 px-3 text-sm text-neutral-900",
          "placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-danger focus:ring-danger"
            : "border-neutral-300 focus:ring-brand-primary",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-xs text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
