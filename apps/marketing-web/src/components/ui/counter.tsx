"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** BCP 47 locale for digit grouping (pass the page locale). */
  locale?: string;
};

/**
 * Counts up from 0 to `value` the first time it scrolls into view. The server
 * renders the final value so crawlers and no-JS readers see the real number;
 * the client resets to 0 after hydration and animates when visible.
 */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.8,
  className,
  locale = "en-US",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  // After hydration, hide the number until it animates (unless motion is reduced).
  useEffect(() => {
    if (reduce) return;
    setDisplay(0);
    setArmed(true);
  }, [reduce]);

  useEffect(() => {
    if (!inView || (!armed && !reduce)) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, armed, reduce, value, duration]);

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // `dir="ltr"` keeps a prefix/suffix ("350+") on the same side of the number
  // inside RTL pages.
  return (
    <span ref={ref} dir="ltr" className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
