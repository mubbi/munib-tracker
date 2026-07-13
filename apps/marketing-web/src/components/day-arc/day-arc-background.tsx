"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Fixed, full-viewport backdrop. It opens on the exact sunset from the approved
 * hero mockup, then eases into deep night as the visitor scrolls down. Falls
 * back to the static sunset when the user prefers reduced motion.
 *
 * `useReducedMotion()` is `null` on the server and a real boolean on the client —
 * branching on it during the first paint causes React #418. Match SSR with the
 * animated tree, then switch to the static fallback after mount if needed.
 */
export function DayArcBackground() {
  const reducePref = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 24, restDelta: 0.001 });

  const sunsetOpacity = useTransform(p, [0, 0.5], [1, 0]);
  const nightOpacity = useTransform(p, [0.15, 0.6], [0, 1]);
  const starsOpacity = useTransform(p, [0.35, 0.8], [0, 0.85]);

  useEffect(() => {
    setReduce(!!reducePref);
  }, [reducePref]);

  if (reduce) {
    return <div aria-hidden className="day-arc-fallback fixed inset-0 -z-10" />;
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="day-arc-night absolute inset-0" />
      <div className="islamic-tiles-soft absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(90%_80%_at_0%_35%,#000_0%,rgba(0,0,0,0.35)_45%,transparent_75%)]" />
      <motion.div className="day-arc-sunset absolute inset-0" style={{ opacity: sunsetOpacity }} />
      <motion.div className="day-arc-night absolute inset-0" style={{ opacity: nightOpacity }} />
      <motion.div className="hero-stars absolute inset-0" style={{ opacity: starsOpacity }} />
    </div>
  );
}
