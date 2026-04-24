/**
 * TypeScript references to CSS design tokens.
 * Use these for dynamic inline styles only.
 * Prefer Tailwind utility classes for static styles.
 */
export const tokens = {
  colors: {
    brand: {
      primary: "hsl(var(--color-brand-primary))",
      secondary: "hsl(var(--color-brand-secondary))",
    },
    semantic: {
      success: "hsl(var(--color-success))",
      warning: "hsl(var(--color-warning))",
      danger: "hsl(var(--color-danger))",
      info: "hsl(var(--color-info))",
    },
    neutral: {
      50: "hsl(var(--color-neutral-50))",
      100: "hsl(var(--color-neutral-100))",
      200: "hsl(var(--color-neutral-200))",
      300: "hsl(var(--color-neutral-300))",
      400: "hsl(var(--color-neutral-400))",
      500: "hsl(var(--color-neutral-500))",
      600: "hsl(var(--color-neutral-600))",
      700: "hsl(var(--color-neutral-700))",
      800: "hsl(var(--color-neutral-800))",
      900: "hsl(var(--color-neutral-900))",
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
