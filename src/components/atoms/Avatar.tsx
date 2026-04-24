function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export interface AvatarProps {
  name: string;
  src?: string;
  size?: Size;
  "data-testid"?: string;
}

/**
 * Circular avatar with image or initials fallback.
 */
export function Avatar({ name, src, size = "md", ...props }: AvatarProps) {
  return (
    <div
      role="img"
      aria-label={name}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-brand-secondary font-semibold text-white overflow-hidden",
        sizeClasses[size],
      ].join(" ")}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
