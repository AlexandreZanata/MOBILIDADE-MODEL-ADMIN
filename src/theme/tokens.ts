/**
 * Design token references — map to CSS custom properties defined in govmobile.css.
 * Use these in TypeScript/TSX instead of raw CSS variable strings.
 */
export const tokens = {
  colors: {
    brand: {
      primary: "var(--color-brand-primary)",
      secondary: "var(--color-brand-secondary)",
    },
    semantic: {
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      danger: "var(--color-danger)",
      info: "var(--color-info)",
    },
    neutral: {
      50: "var(--color-neutral-50)",
      100: "var(--color-neutral-100)",
      200: "var(--color-neutral-200)",
      300: "var(--color-neutral-300)",
      400: "var(--color-neutral-400)",
      500: "var(--color-neutral-500)",
      600: "var(--color-neutral-600)",
      700: "var(--color-neutral-700)",
      800: "var(--color-neutral-800)",
      900: "var(--color-neutral-900)",
    },
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    full: "var(--radius-full)",
  },
  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
} as const;
