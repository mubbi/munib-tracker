import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small pill used for section eyebrows and status chips. */
export function Badge({
  children,
  className,
  icon,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  tone?: "default" | "hero";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm",
        tone === "hero"
          ? "border border-white/15 bg-white/5 text-hero-gold"
          : "border border-border/70 bg-card/70 text-muted",
        className,
      )}
    >
      {icon ?? (
        <span
          aria-hidden
          className="size-1.5 animate-pulse rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"
        />
      )}
      {children}
    </span>
  );
}
