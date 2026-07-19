import { BRAND_COLORS } from "@/lib/brand";

/**
 * The tool's own icon, per the brand doc's construction kit (§2):
 * rounded square canvas at --radius-lg curvature, one flat geometric glyph,
 * white on the tool's accent. Same artwork as app/icon.svg — keep in sync.
 */
export function Mark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="64" height="64" rx="20" fill={BRAND_COLORS.accent} />
      <g stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <circle cx="32" cy="32" r="17" fill="none" />
        <line x1="32" y1="15" x2="32" y2="49" />
        <line x1="46.7" y1="23.5" x2="17.3" y2="40.5" />
        <line x1="46.7" y1="40.5" x2="17.3" y2="23.5" />
      </g>
      <circle cx="32" cy="32" r="5" fill="#fff" />
    </svg>
  );
}
