"use client";

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

/** Ease-out (expo-like), matching the site's other motion. */
function easeOut(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

/**
 * Counts up from 0 to `value` the first time it scrolls into view. The server
 * renders the final value so crawlers and no-JS readers see the real number;
 * the client resets to 0 after hydration and animates when visible. Uses the
 * browser's IntersectionObserver + requestAnimationFrame (no animation library).
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
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    setDisplay(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          setDisplay(value * easeOut(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

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
