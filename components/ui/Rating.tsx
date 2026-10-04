import { cn } from "@/lib/utils/cn";

type RatingProps = {
  /** 0–5, one decimal. */
  value: number;
  className?: string;
  /** Hides the numeric value when the surrounding copy already states it. */
  showValue?: boolean;
};

/**
 * Star rating. The numeric value is always available as text (or via the
 * accessible label), so the rating is never communicated by shape alone.
 */
export function Rating({ value, className, showValue = true }: RatingProps) {
  const rounded = Math.round(value * 10) / 10;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, rounded - index));
          return (
            <span key={index} className="relative block size-3">
              <Star className="absolute inset-0 text-fg/20" />
              {fill > 0 ? (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className="absolute inset-y-0 left-0 w-3 text-accent" />
                </span>
              ) : null}
            </span>
          );
        })}
      </span>
      <span className={cn("text-meta font-medium text-fg/80", !showValue && "sr-only")}>
        {rounded.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </span>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden>
      <path d="M6 0.75l1.62 3.3 3.63.53-2.63 2.57.62 3.62L6 9.06 2.76 10.77l.62-3.62L0.75 4.58l3.63-.53L6 0.75z" />
    </svg>
  );
}
