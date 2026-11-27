import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals, in CSS only (`.scroll-reveal` in `globals.css`): a fade +
 * rise driven by the element's own scroll position (`animation-timeline:
 * view()`). Browsers without scroll-driven animations simply show the content.
 *
 * Server components: no JavaScript ships for them, and content is never hidden
 * waiting for hydration (which used to delay LCP and hid sections when JS
 * failed). Reduced motion turns the animation off (global rule in `globals.css`).
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/** Fade + rise as the element scrolls into view. */
export function Reveal({ children, className }: RevealProps) {
  return <div className={cn("scroll-reveal", className)}>{children}</div>;
}

/**
 * A group whose `<StaggerItem>` children reveal as they scroll into view.
 * Items in the same row enter together; rows below follow as they arrive.
 */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("scroll-reveal", className)}>{children}</div>;
}
