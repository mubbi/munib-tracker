import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Seamless CSS marquee. Renders children twice; pauses on hover. */
export function Marquee({
  children,
  reverse = false,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  const track = cn(
    "flex shrink-0 items-stretch gap-5 pr-5",
    reverse ? "animate-marquee-reverse" : "animate-marquee",
    "group-hover:[animation-play-state:paused]",
  );
  return (
    <div className={cn("group mask-fade-x flex w-full overflow-hidden", className)}>
      <div className={track}>{children}</div>
      <div className={track} aria-hidden>
        {children}
      </div>
    </div>
  );
}
