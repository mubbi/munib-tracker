"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fixed, full-viewport backdrop. Opens on the hero sunset, then eases into
 * deep night as the visitor scrolls. Opacities are driven by a CSS variable
 * updated on rAF (no Framer spring) so sticky chrome stays smooth.
 *
 * Reduced-motion preference is read after mount to avoid SSR/client mismatch.
 */
export function DayArcBackground() {
  const [reduce, setReduce] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) return;

    const root = document.documentElement;
    const canvas = canvasRef.current;
    let ticking = false;
    let scrollEndTimer = 0;

    const applyProgress = () => {
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      // Write on the canvas only — avoids layout thrash on the whole document.
      canvas?.style.setProperty("--day-arc-p", p.toFixed(4));
      ticking = false;
    };

    const onScroll = () => {
      root.classList.add("is-scrolling");
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, 140);

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyProgress);
      }
    };

    applyProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(scrollEndTimer);
      root.classList.remove("is-scrolling");
      canvas?.style.removeProperty("--day-arc-p");
    };
  }, [reduce]);

  if (reduce) {
    return <div aria-hidden className="day-arc-fallback fixed inset-0 -z-10" />;
  }

  return (
    <div
      ref={canvasRef}
      aria-hidden
      className="day-arc-canvas pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="day-arc-night absolute inset-0" />
      <div className="islamic-tiles-soft absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(90%_80%_at_0%_35%,#000_0%,rgba(0,0,0,0.35)_45%,transparent_75%)]" />
      <div className="day-arc-sunset day-arc-layer-sunset absolute inset-0" />
      <div className="day-arc-night day-arc-layer-night absolute inset-0" />
      {/* Outer opacity = scroll progress; inner keeps the twinkle animation */}
      <div className="day-arc-layer-stars absolute inset-0">
        <div className="hero-stars absolute inset-0" />
      </div>
    </div>
  );
}
