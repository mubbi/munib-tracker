"use client";

import { usePathname } from "next/navigation";
import { DayArcBackground } from "@/components/day-arc/day-arc-background";

/**
 * Global site backdrop. The home page rides the scroll-driven day→night
 * journey; every other page rests on a still, starlit night sky in the same
 * Day Arc language (girih lattice, twinkling stars, warm horizon vignette).
 */
export function SiteBackground() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <DayArcBackground />;
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="day-arc-night absolute inset-0" />
      {/* Subtle top veil so sticky chrome and body share one continuous sky */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#07141f]/55 to-transparent" />
      <div className="islamic-tiles-soft absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(85%_70%_at_8%_28%,#000_0%,rgba(0,0,0,0.35)_40%,transparent_72%)]" />
      <div className="hero-stars absolute inset-0 opacity-75 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_70%)]" />
      <div className="hero-stars-2 absolute inset-0 opacity-65 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_80%)]" />
      {/* Warm glow rising from the horizon, echoing the hero's sunset */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(70%_130%_at_50%_130%,rgba(196,124,58,0.16),transparent_70%)]" />
    </div>
  );
}
