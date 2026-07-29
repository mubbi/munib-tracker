"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { hexToRgba } from "@/lib/hexToRgba";
import { cn } from "@/lib/utils";

const BRAND_PRIMARY = "#10b981";
const BRAND_GOLD = "#e6c065";

type WaveBackdropProps = {
  className?: string;
};

/** Flowing horizon waves + soft rings — Munib emerald / gold. */
function WaveBackdropArt({ accent, isDark }: { accent: string; isDark: boolean }) {
  const ring = hexToRgba(accent, isDark ? 0.14 : 0.11);
  const ring2 = hexToRgba(accent, isDark ? 0.07 : 0.055);
  const dust = isDark ? "rgba(232,220,200,0.06)" : "rgba(21,41,33,0.05)";

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="adminWaveBlob" cx="42%" cy="35%" rx="55%" ry="50%" fx="42%" fy="35%">
          <stop offset="0%" stopColor={accent} stopOpacity={isDark ? 0.22 : 0.14} />
          <stop offset="45%" stopColor={accent} stopOpacity={isDark ? 0.08 : 0.05} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="adminWaveBlob2" cx="78%" cy="62%" rx="50%" ry="55%" fx="78%" fy="62%">
          <stop offset="0%" stopColor={accent} stopOpacity={isDark ? 0.12 : 0.09} />
          <stop offset="55%" stopColor={BRAND_GOLD} stopOpacity={isDark ? 0.08 : 0.06} />
          <stop offset="100%" stopColor={BRAND_GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>

      <path
        d="M-120 520 C140 420 320 620 580 540 S940 460 1220 520 L1240 920 L-140 920 Z"
        fill="url(#adminWaveBlob)"
        opacity={0.95}
      />
      <path
        d="M-100 640 Q280 520 520 600 T1020 560 T1320 680 L1320 940 L-120 940 Z"
        fill="url(#adminWaveBlob2)"
        opacity={0.85}
      />
      <path
        d="M-80 180 Q400 -40 780 120 T1280 200 L1280 -40 L-80 -40 Z"
        fill={hexToRgba(accent, isDark ? 0.1 : 0.07)}
        opacity={0.9}
      />
      <circle
        cx="220"
        cy="720"
        r="280"
        stroke={ring}
        strokeWidth={1.2}
        fill="none"
        opacity={0.55}
      />
      <circle
        cx="220"
        cy="720"
        r="220"
        stroke={ring2}
        strokeWidth={0.9}
        fill="none"
        opacity={0.5}
      />
      <circle cx="1020" cy="160" r="200" stroke={ring} strokeWidth={1} fill="none" opacity={0.45} />
      <circle
        cx="1020"
        cy="160"
        r="145"
        stroke={ring2}
        strokeWidth={0.8}
        fill="none"
        opacity={0.45}
      />
      <circle cx="108" cy="120" r={2.2} fill={dust} />
      <circle cx="312" cy="86" r={1.6} fill={dust} />
      <circle cx="888" cy="420" r={2} fill={dust} />
      <circle cx="1056" cy="512" r={1.4} fill={dust} />
      <circle cx="640" cy="260" r={1.8} fill={dust} />
      <circle cx="480" cy="680" r={1.5} fill={dust} />
    </svg>
  );
}

function buildViewportGradient(primary: string, isDark: boolean): string {
  const accentMid = hexToRgba(primary, isDark ? 0.16 : 0.11);
  const accentWide = hexToRgba(primary, isDark ? 0.09 : 0.065);
  const accentFloor = hexToRgba(primary, isDark ? 0.12 : 0.075);

  if (isDark) {
    const sideGold = hexToRgba(BRAND_GOLD, 0.1);
    const teal = hexToRgba("#2dd4bf", 0.07);
    return [
      `radial-gradient(ellipse 120% 70% at 50% -12%, ${accentMid} 0%, transparent 52%)`,
      `radial-gradient(ellipse 55% 80% at -8% 42%, ${accentWide} 0%, transparent 48%)`,
      `radial-gradient(ellipse 55% 80% at 108% 58%, ${sideGold} 0%, transparent 48%)`,
      `radial-gradient(ellipse 90% 55% at 50% 108%, ${teal} 0%, transparent 42%)`,
      `radial-gradient(ellipse 80% 45% at 80% 85%, ${accentFloor} 0%, transparent 50%)`,
      `conic-gradient(from 210deg at 70% 25%, ${hexToRgba(primary, 0.07)} 0deg, transparent 80deg, ${hexToRgba(BRAND_GOLD, 0.05)} 160deg, transparent 280deg)`,
      `linear-gradient(165deg, #1c322c 0%, #152921 32%, #0a2f27 55%, #152921 100%)`,
      `repeating-linear-gradient(105deg, rgba(232,220,200,0.02) 0 1px, transparent 1px 48px)`,
    ].join(", ");
  }

  const sideGold = hexToRgba(BRAND_GOLD, 0.12);
  const sideTeal = hexToRgba("#0f766e", 0.08);
  return [
    `radial-gradient(ellipse 120% 75% at 50% -15%, ${accentMid} 0%, transparent 54%)`,
    `radial-gradient(ellipse 60% 85% at -10% 48%, ${sideTeal} 0%, transparent 52%)`,
    `radial-gradient(ellipse 60% 85% at 110% 52%, ${sideGold} 0%, transparent 52%)`,
    `radial-gradient(ellipse 100% 60% at 50% 112%, ${hexToRgba("#5c7268", 0.1)} 0%, transparent 44%)`,
    `radial-gradient(ellipse 70% 50% at 85% 20%, ${hexToRgba(primary, 0.06)} 0%, transparent 55%)`,
    `linear-gradient(152deg, ${hexToRgba(primary, 0.05)} 0%, transparent 28%)`,
    `conic-gradient(from 185deg at 28% 72%, ${hexToRgba(primary, 0.06)} 0deg, transparent 90deg, ${hexToRgba(BRAND_GOLD, 0.05)} 200deg, transparent 300deg)`,
    `linear-gradient(180deg, #fffcf7 0%, #f5f0e6 55%, #e8e2d4 100%)`,
    `repeating-linear-gradient(105deg, rgba(21,41,33,0.025) 0 1px, transparent 1px 48px)`,
  ].join(", ");
}

export function WaveBackdrop({ className }: WaveBackdropProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const backgroundImage = useMemo(() => buildViewportGradient(BRAND_PRIMARY, isDark), [isDark]);

  return (
    <div
      className={cn("pointer-events-none overflow-hidden", className)}
      aria-hidden
      style={{
        backgroundColor: isDark ? "#152921" : "#f5f0e6",
        backgroundImage,
      }}
    >
      <WaveBackdropArt accent={BRAND_PRIMARY} isDark={isDark} />
    </div>
  );
}
