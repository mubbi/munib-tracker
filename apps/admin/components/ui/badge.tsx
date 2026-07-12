import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "warning" | "danger" | "muted" | "info";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Show a coloured dot before the label — Application UI badge pattern. */
  dot?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-fg-muted ring-line/60",
  brand: "bg-success-bg text-success ring-success-line/50",
  warning: "bg-warning-bg text-warning ring-warning-line/50",
  danger: "bg-danger-bg text-danger ring-danger-line/50",
  muted: "bg-surface-muted/80 text-fg-subtle ring-transparent",
  info: "bg-info-bg text-info ring-info-line/50",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-fg-faint",
  brand: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-fg-faint",
  info: "bg-info",
};

export function Badge({ children, variant = "default", dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_CLASSES[variant])}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
