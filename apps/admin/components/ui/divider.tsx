import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DividerProps = {
  /** Optional centered label, e.g. a section break. */
  label?: ReactNode;
  className?: string;
};

/** Catalyst-style divider — a hairline rule, optionally with a centered label. */
export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-t border-line", className)} />;
  }
  return (
    <div className={cn("relative flex items-center", className)}>
      <span className="flex-1 border-t border-line" aria-hidden="true" />
      <span className="px-3 text-xs font-medium uppercase tracking-wide text-fg-faint">
        {label}
      </span>
      <span className="flex-1 border-t border-line" aria-hidden="true" />
    </div>
  );
}
