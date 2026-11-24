"use client";

import { motion, stagger, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/ui/motion";

/**
 * Entrance animation for the home hero. Only the motion wrappers are client
 * code; the copy, links and artwork inside them render on the server.
 */

const container: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.09, { startDelay: 0.05 }) } },
};

const item: Variants = {
  // Opacity + translate only — filter blur forces expensive paint on load
  // and can leave the GPU layer thrashing under the sticky header.
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Staggers its `<HeroItem>` children in on mount. */
export function HeroStagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

const ITEM_TAGS = { div: motion.div, p: motion.p, ul: motion.ul } as const;

/** One staggered step inside `<HeroStagger>`. */
export function HeroItem({
  as = "div",
  children,
  className,
}: {
  as?: keyof typeof ITEM_TAGS;
  children: ReactNode;
  className?: string;
}) {
  const Tag = ITEM_TAGS[as];
  return (
    <Tag variants={item} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Subtle rise for the hero phone. Transform only, never opacity: the phone is
 * the hero's main image and must be visible in the server HTML from first paint.
 */
export function HeroDevice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ y: 16, scale: 0.98 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
