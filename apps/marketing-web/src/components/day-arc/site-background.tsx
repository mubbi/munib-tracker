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
      <div className="day-arc-night absolute inset-0" />
      <div className="islamic-tiles-soft absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(90%_80%_at_0%_35%,#000_0%,rgba(0,0,0,0.4)_45%,transparent_75%)]" />
      <div className="hero-stars absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_70%)]" />
      <div className="hero-stars-2 absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_80%)]" />
      {/* Warm glow rising from the horizon, echoing the hero's sunset */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(70%_130%_at_50%_130%,rgba(196,124,58,0.16),transparent_70%)]" />
    </div>
  );
}
