import { cn } from "@/lib/utils/cn";

type ArrowProps = {
  className?: string;
  /** "ne" for external/outbound, "e" for in-site forward motion. */
  direction?: "ne" | "e";
};

/**
 * The single arrow glyph used site-wide. An SVG rather than the "↗" character
 * so its weight matches Matimo at every size and it can be animated.
 */
export function Arrow({ className, direction = "ne" }: ArrowProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-[0.9em] shrink-0", className)}
    >
      {direction === "ne" ? (
        <path
          d="M4.5 11.5 11.5 4.5M11.5 4.5H5.75M11.5 4.5v5.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
