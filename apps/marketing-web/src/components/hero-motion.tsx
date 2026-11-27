import { Children, type CSSProperties, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance animation for the home hero, in CSS only (`.hero-rise`,
 * `.hero-device-in` in `globals.css`). Each step rises a little on first paint,
 * staggered by `--hero-i`; nothing is ever hidden (transform only), so the hero
 * copy counts for FCP/LCP immediately and no animation library ships.
 */

/** Numbers its `<HeroItem>` children for the stagger (`--hero-i`). */
export function HeroStagger({ children, className }: { children: ReactNode; className?: string }) {
  let index = 0;
  const numbered = Children.map(children, (child) => {
    if (!isValidElement<HeroItemProps>(child) || child.type !== HeroItem) return child;
    const i = index++;
    return <HeroItem {...child.props} index={i} />;
  });
  return <div className={className}>{numbered}</div>;
}

type HeroItemProps = {
  as?: "div" | "p" | "ul";
  children: ReactNode;
  className?: string;
  /** Position in the stagger (set by `<HeroStagger>`). */
  index?: number;
};

/** One staggered step inside `<HeroStagger>`. */
export function HeroItem({ as: Tag = "div", children, className, index = 0 }: HeroItemProps) {
  return (
    <Tag className={cn("hero-rise", className)} style={{ "--hero-i": index } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Subtle rise for the hero's device line-up (the iPhone is the preloaded image). */
export function HeroDevice({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("hero-device-in", className)}>{children}</div>;
}
