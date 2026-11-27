"use client";
// Slide decoration layer: backgrounds, text tone, highlight variants, the
// magnifier lens and feature chips. See lib/design.ts for the model and where
// each idea comes from. Everything is sized from the canvas (cW/cH) or in
// container units, so previews, thumbnails and exports match.

import * as React from "react";
import { alpha, bestForeground, contrast, ensureContrast, isDark, shade } from "@/lib/color";
import {
  type BackgroundStyle,
  type HighlightStyle,
  isLightBackground,
  type LensSpec,
  type SlideDesign,
} from "@/lib/design";
import type { Theme } from "@/lib/types";

// ---------- Brand constants (apps/app Brand + marketing globals.css) ----------

export const BRAND = {
  gold: "#E4CE9E", // Brand.heroAccent
  goldInk: "#8A6A2E", // gold that reads on cream
  ink: "#152921", // app light foreground
  inkMuted: "#4A6157", // app light mutedForeground
  cream: "#F2EFE6", // Brand.heroText
  creamMuted: "#A9C6BB", // Brand.heroSubtext
  glow: "#1F9C78", // marketing --color-hero-glow
  forest: "#1F7A63", // Brand.heroGlow
  sky: "#4C8FD9", // CategoryHues.sky
} as const;

const NIGHT_SKY = "linear-gradient(180deg,#0a1830 0%,#0b2226 42%,#0c231d 72%,#02121a 100%)";
const DUSK_SKY =
  "linear-gradient(180deg,#202e4d 0%,#2e3857 10%,#5f5b66 20%,#8a715e 30%,#a37848 40%,#b0743c 50%,#985237 60%,#5e393a 70%,#253537 80%,#101f1a 92%,#02121a 100%)";
const PARCHMENT = "linear-gradient(180deg,#FBF8F1 0%,#F5F0E6 48%,#EAE3D4 100%)";

// ---------- Tone: the copy palette for a slide's background ----------

export type Tone = {
  light: boolean;
  base: string;
  fg: string;
  muted: string;
  accent: string;
  gold: string;
  textShadow: string;
  /** CSS custom properties consumed by the `.hl-em` variants (studio-canvas.css). */
  vars: React.CSSProperties;
  highlight: HighlightStyle;
};

function firstReadable(candidates: string[], base: string, min: number, fallback: string) {
  return candidates.find((c) => c && contrast(c, base) >= min) ?? fallback;
}

export function toneFor(theme: Theme, inverted: boolean, design?: SlideDesign): Tone {
  const bg: BackgroundStyle = design?.background ?? "aurora";
  const themeBase = inverted ? theme.bgAlt : theme.bg;
  const base =
    bg === "night"
      ? "#0b2226"
      : bg === "dusk"
        ? "#2e3857" // the copy sits in the upper, still-blue part of the sunset
        : isLightBackground(bg)
          ? "#F5F0E6"
          : themeBase;
  const light = !isDark(base);
  const ownFg = inverted ? theme.fgAlt : theme.fg;
  const otherFg = inverted ? theme.fg : theme.fgAlt;
  const fg = firstReadable([ownFg, otherFg], base, 4.5, light ? BRAND.ink : BRAND.cream);
  const muted = firstReadable([theme.muted], base, 4.5, light ? BRAND.inkMuted : BRAND.creamMuted);
  const accent =
    contrast(theme.accent, base) >= 3 ? theme.accent : ensureContrast(theme.accent, base, 4.5);
  const gold = light ? BRAND.goldInk : BRAND.gold;
  const highlight = design?.highlight ?? "gradient";

  const gradient = light
    ? `linear-gradient(100deg,${shade(accent, -8)} 0%,${accent} 55%,${BRAND.goldInk} 115%)`
    : `linear-gradient(100deg,${shade(theme.accent, 30)} 0%,${shade(theme.accent, 12)} 50%,${BRAND.gold} 110%)`;
  const boxFill = light ? ensureContrast(theme.accent, base, 3) : theme.accent;

  return {
    light,
    base,
    fg,
    muted,
    accent,
    gold,
    highlight,
    textShadow: light
      ? "none"
      : bg === "dusk" || bg === "night"
        ? "0 2px 20px rgba(8,14,30,0.55), 0 1px 3px rgba(0,0,0,0.35)"
        : "0 2px 28px rgba(0,0,0,0.22)",
    vars: {
      "--hl-gradient": gradient,
      "--hl-color": gold,
      "--hl-box": boxFill,
      "--hl-box-fg": bestForeground(boxFill),
      "--hl-box-shadow": `0 0.18em 0.5em ${alpha(boxFill, light ? 0.28 : 0.4)}`,
      "--hl-marker": alpha(light ? BRAND.gold : BRAND.gold, light ? 0.75 : 0.42),
    } as React.CSSProperties,
  };
}

// ---------- Deterministic randomness (identical previews and exports) ----------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function useUid(prefix: string) {
  return `${prefix}${React.useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
}

// ---------- Backdrop ----------

export type FocusRect = { x: number; y: number; width: number; height: number };

export function Backdrop({
  design,
  theme,
  inverted,
  cW,
  cH,
  seed,
  focus,
}: {
  design?: SlideDesign;
  theme: Theme;
  inverted: boolean;
  cW: number;
  cH: number;
  seed: string;
  /** Main device rect — centres the dusk bloom and the device glow. */
  focus?: FocusRect;
}) {
  const style = design?.background ?? "aurora";
  const tone = toneFor(theme, inverted, design);
  const unit = Math.min(cW, cH);
  const fx = focus ? focus.x + focus.width / 2 : cW / 2;
  const fy = focus ? focus.y + focus.height * 0.45 : cH * 0.6;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        color: tone.fg,
      }}
    >
      {style === "aurora" && <Aurora theme={theme} inverted={inverted} cW={cW} />}
      {style === "solid" && <Fill background={inverted ? theme.bgAlt : theme.bg} />}
      {style === "night" && (
        <>
          <Fill background={NIGHT_SKY} />
          <Fill
            background={`radial-gradient(${cW * 0.9}px ${cH * 0.32}px at 50% 100%, ${alpha(BRAND.glow, 0.32)} 0%, transparent 70%)`}
          />
          <Stars cW={cW} cH={cH} seed={seed} count={150} band={0.62} />
          {/* Corner moon, kept above/outside the headline band. */}
          <Crescent cx={cW * 0.9} cy={Math.max(unit * 0.05, cH * 0.028)} r={unit * 0.03} />
          <MosqueHorizon cW={cW} cH={cH} />
        </>
      )}
      {style === "dusk" && (
        <>
          <Fill background={DUSK_SKY} />
          <Fill
            background={`radial-gradient(${cW * 0.62}px ${cH * 0.3}px at ${fx}px ${fy}px, rgba(248,212,132,0.55) 0%, rgba(230,150,64,0.26) 44%, transparent 72%)`}
          />
          <Fill
            background={`radial-gradient(${cW * 0.8}px ${cH * 0.18}px at 42% 100%, rgba(232,150,74,0.5) 0%, rgba(180,110,60,0.18) 45%, transparent 72%)`}
          />
          <Stars cW={cW} cH={cH} seed={seed} count={60} band={0.22} warm />
          <Sparkles cW={cW} cH={cH} seed={seed} />
          <MosqueHorizon cW={cW} cH={cH} />
        </>
      )}
      {style === "girih" && (
        <>
          <Aurora theme={theme} inverted={inverted} cW={cW} blobs={false} />
          <PatternLayer
            cW={cW}
            cH={cH}
            tile={unit * 0.22}
            kind="girih"
            color="#e2c08a"
            opacity={0.32}
            fadeAt={{ x: cW / 2, y: cH * 0.16, r: Math.max(cW, cH) * 0.55 }}
          />
        </>
      )}
      {style === "mesh" && (
        <>
          <Fill background={inverted ? theme.bgAlt : theme.bg} />
          <Orb cW={cW} color={theme.accent} x={-22} y={-12} size={78} opacity={0.42} />
          <Orb cW={cW} color={BRAND.gold} x={62} y={-6} size={48} opacity={0.2} />
          <Orb cW={cW} color={BRAND.forest} x={40} y={52} size={80} opacity={0.38} />
          <Orb cW={cW} color={BRAND.sky} x={-28} y={70} size={56} opacity={0.16} />
          <Vignette strength={0.3} />
        </>
      )}
      {style === "grid" && (
        <>
          <Fill
            background={`linear-gradient(160deg, ${shade(inverted ? theme.bgAlt : theme.bg, 3)} 0%, ${shade(inverted ? theme.bgAlt : theme.bg, -6)} 100%)`}
          />
          <Fill
            background={`radial-gradient(${cW * 0.7}px ${cH * 0.4}px at 50% 45%, ${alpha(theme.accent, 0.18)} 0%, transparent 70%)`}
          />
          <PatternLayer
            cW={cW}
            cH={cH}
            tile={unit * 0.075}
            kind="grid"
            color={tone.fg}
            opacity={0.09}
            fadeAt={{ x: cW / 2, y: cH * 0.45, r: Math.max(cW, cH) * 0.6 }}
            invertFade
          />
          <Vignette strength={0.4} />
        </>
      )}
      {style === "parchment" && (
        <>
          <Fill background={PARCHMENT} />
          <Orb cW={cW} color={BRAND.gold} x={-20} y={-14} size={70} opacity={0.4} />
          <Orb cW={cW} color={BRAND.forest} x={60} y={70} size={60} opacity={0.1} />
          <PatternLayer
            cW={cW}
            cH={cH}
            tile={unit * 0.12}
            kind="khatam"
            color="#10b981"
            opacity={0.16}
            fadeAt={{ x: cW / 2, y: cH * 0.2, r: Math.max(cW, cH) * 0.5 }}
          />
        </>
      )}

      {design?.glow && focus && (
        <Fill
          background={`radial-gradient(${focus.width * 0.95}px ${focus.height * 0.6}px at ${fx}px ${fy}px, ${alpha(theme.accent, tone.light ? 0.22 : 0.42)} 0%, transparent 70%)`}
        />
      )}
      {design?.grain && <Grain />}
    </div>
  );
}

function Fill({ background }: { background: string }) {
  return <div style={{ position: "absolute", inset: 0, background }} />;
}

function Vignette({ strength }: { strength: number }) {
  return (
    <Fill
      background={`radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(0,0,0,${strength}) 100%)`}
    />
  );
}

/** The original studio background: theme gradient, soft accent blobs and a vignette. */
function Aurora({
  theme,
  inverted,
  cW,
  blobs = true,
}: {
  theme: Theme;
  inverted: boolean;
  cW: number;
  blobs?: boolean;
}) {
  const background = inverted
    ? `radial-gradient(120% 80% at 15% 0%, ${shade(theme.accent, 18)}33 0%, transparent 55%),
      radial-gradient(90% 70% at 90% 100%, ${theme.accent}28 0%, transparent 50%),
      linear-gradient(165deg, ${shade(theme.bgAlt, 6)} 0%, ${theme.bgAlt} 42%, ${shade(theme.bgAlt, -10)} 100%)`
    : `radial-gradient(110% 75% at 12% -5%, ${theme.accent}40 0%, transparent 52%),
    radial-gradient(95% 70% at 95% 105%, ${shade(theme.accent, -20)}30 0%, transparent 48%),
    linear-gradient(165deg, ${shade(theme.bg, 8)} 0%, ${theme.bg} 45%, ${shade(theme.bg, -8)} 100%)`;
  return (
    <>
      <Fill background={background} />
      {blobs && (
        <>
          <Orb
            cW={cW}
            color={theme.accent}
            x={-18}
            y={-14}
            size={62}
            opacity={inverted ? 0.22 : 0.28}
            blur={0.06}
          />
          <Orb
            cW={cW}
            color={BRAND.gold}
            x={62}
            y={-8}
            size={38}
            opacity={inverted ? 0.08 : 0.1}
            blur={0.06}
          />
          <Orb
            cW={cW}
            color={theme.accent}
            x={68}
            y={72}
            size={52}
            opacity={inverted ? 0.16 : 0.22}
            blur={0.06}
          />
        </>
      )}
      <Vignette strength={0.28} />
    </>
  );
}

/** Blurred colour orb; x/y/size in % of the canvas width/height. */
function Orb({
  cW,
  color,
  x,
  y,
  size,
  opacity,
  blur = 0.09,
}: {
  cW: number;
  color: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        aspectRatio: "1 / 1",
        background: color,
        borderRadius: "50%",
        filter: `blur(${cW * blur}px)`,
        opacity,
      }}
    />
  );
}

function Stars({
  cW,
  cH,
  seed,
  count,
  band,
  warm = false,
}: {
  cW: number;
  cH: number;
  seed: string;
  count: number;
  /** Fraction of the canvas height the stars occupy (from the top). */
  band: number;
  warm?: boolean;
}) {
  const stars = React.useMemo(() => {
    const rand = rng(hash(`${seed}:${cW}x${cH}`));
    const unit = Math.min(cW, cH);
    return Array.from({ length: count }, (_, id) => {
      const y = rand() ** 1.4 * cH * band;
      return {
        id,
        x: rand() * cW,
        y,
        r: unit * (0.0012 + rand() * 0.0026),
        o: 0.2 + rand() * 0.65,
        warm: warm || rand() < 0.18,
      };
    });
  }, [cW, cH, seed, count, band, warm]);
  return (
    <svg
      width={cW}
      height={cH}
      viewBox={`0 0 ${cW} ${cH}`}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {stars.map((s) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={s.warm ? "#fff4d6" : "#ffffff"}
          opacity={s.o}
        />
      ))}
    </svg>
  );
}

/** Warm golden bokeh around the lower sky (marketing .hero-sparkles). */
function Sparkles({ cW, cH, seed }: { cW: number; cH: number; seed: string }) {
  const dots = React.useMemo(() => {
    const rand = rng(hash(`${seed}:sparkles`));
    const unit = Math.min(cW, cH);
    return Array.from({ length: 18 }, (_, id) => ({
      id,
      x: rand() * cW,
      y: cH * (0.45 + rand() * 0.4),
      r: unit * (0.002 + rand() * 0.004),
      o: 0.35 + rand() * 0.5,
    }));
  }, [cW, cH, seed]);
  return (
    <svg
      width={cW}
      height={cH}
      viewBox={`0 0 ${cW} ${cH}`}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {dots.map((d) => (
        <circle key={d.id} cx={d.x} cy={d.y} r={d.r} fill="#ffd696" opacity={d.o} />
      ))}
    </svg>
  );
}

function Crescent({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const uid = useUid("cr");
  const size = r * 8;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${cx - size / 2} ${cy - size / 2} ${size} ${size}`}
      style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2 }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}-g`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={BRAND.gold} stopOpacity="0.28" />
          <stop offset="1" stopColor={BRAND.gold} stopOpacity="0" />
        </radialGradient>
        <mask id={`${uid}-m`}>
          <circle cx={cx} cy={cy} r={r} fill="#fff" />
          <circle cx={cx + r * 0.42} cy={cy - r * 0.18} r={r * 0.86} fill="#000" />
        </mask>
      </defs>
      <circle cx={cx} cy={cy} r={size / 2} fill={`url(#${uid}-g)`} />
      <rect
        x={cx - r}
        y={cy - r}
        width={r * 2}
        height={r * 2}
        fill={BRAND.gold}
        mask={`url(#${uid}-m)`}
      />
    </svg>
  );
}

/** Tiled pattern faded by a radial mask (transparent near `fadeAt`, unless inverted). */
function PatternLayer({
  cW,
  cH,
  tile,
  kind,
  color,
  opacity,
  fadeAt,
  invertFade = false,
}: {
  cW: number;
  cH: number;
  tile: number;
  kind: "girih" | "khatam" | "grid";
  color: string;
  opacity: number;
  fadeAt: { x: number; y: number; r: number };
  invertFade?: boolean;
}) {
  const uid = useUid("pt");
  const sw = tile * (kind === "grid" ? 0.012 : 0.006);
  const s = tile / 200; // marketing tiles are drawn in a 200-unit box
  return (
    <svg
      width={cW}
      height={cH}
      viewBox={`0 0 ${cW} ${cH}`}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <defs>
        <pattern
          id={`${uid}-p`}
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
          x={cW / 2 - tile / 2}
          y={0}
        >
          {kind === "grid" && (
            <path
              d={`M ${tile} 0 L 0 0 0 ${tile}`}
              fill="none"
              stroke={color}
              strokeWidth={sw * 2}
            />
          )}
          {kind === "girih" && (
            // marketing .islamic-tiles-soft strapwork (star-and-cross lattice)
            <g fill="none" stroke={color} strokeWidth={sw / s} transform={`scale(${s})`}>
              <path d="M55 55h90v90H55z" />
              <path d="M100 36l64 64-64 64-64-64z" />
              <path d="M-45 -45h90v90h-90z" />
              <path d="M0 -64l64 64L0 64l-64-64z" />
              <path d="M155 -45h90v90h-90z" />
              <path d="M200 -64l64 64-64 64-64-64z" />
              <path d="M-45 155h90v90h-90z" />
              <path d="M0 136l64 64-64 64-64-64z" />
              <path d="M155 155h90v90h-90z" />
              <path d="M200 136l64 64-64 64-64-64z" />
              <path d="M100 0v36M100 164v36M0 100h36M164 100h36" />
            </g>
          )}
          {kind === "khatam" && (
            // marketing .islamic-tiles: 8-point star in a circle (80-unit box)
            <g
              fill="none"
              stroke={color}
              strokeWidth={(sw * 2) / (tile / 80)}
              transform={`scale(${tile / 80})`}
            >
              <path d="M40 8l9 23 23 9-23 9-9 23-9-23-23-9 23-9z" />
              <circle cx="40" cy="40" r="30" />
            </g>
          )}
        </pattern>
        <radialGradient
          id={`${uid}-f`}
          gradientUnits="userSpaceOnUse"
          cx={fadeAt.x}
          cy={fadeAt.y}
          r={fadeAt.r}
        >
          {invertFade ? (
            <>
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#000" />
              <stop offset="0.35" stopColor="#000" />
              <stop offset="1" stopColor="#fff" />
            </>
          )}
        </radialGradient>
        <mask id={`${uid}-m`}>
          <rect width={cW} height={cH} fill={`url(#${uid}-f)`} />
        </mask>
      </defs>
      <rect
        width={cW}
        height={cH}
        fill={`url(#${uid}-p)`}
        mask={`url(#${uid}-m)`}
        opacity={opacity}
      />
    </svg>
  );
}

/** Fine film grain (marketing .noise). */
function Grain() {
  const uid = useUid("gr");
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}
      aria-hidden
    >
      <filter id={`${uid}-n`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${uid}-n)`} />
    </svg>
  );
}

// ---------- Mosque horizon (port of marketing day-arc/mosque-skyline.tsx) ----------

/** Ogee "onion" dome outline. */
function dome(cx: number, w: number, wb: number, by: number, ay: number) {
  const h = by - ay;
  return [
    `M ${cx - wb} ${by}`,
    `C ${cx - wb} ${by - 0.12 * h}, ${cx - w} ${by - 0.3 * h}, ${cx - w} ${by - 0.47 * h}`,
    `C ${cx - w} ${by - 0.72 * h}, ${cx - 0.34 * w} ${by - 0.86 * h}, ${cx} ${ay}`,
    `C ${cx + 0.34 * w} ${by - 0.86 * h}, ${cx + w} ${by - 0.72 * h}, ${cx + w} ${by - 0.47 * h}`,
    `C ${cx + w} ${by - 0.3 * h}, ${cx + wb} ${by - 0.12 * h}, ${cx + wb} ${by}`,
    "Z",
  ].join(" ");
}

function finial(x: number, y: number, s: number) {
  return [
    `M ${x - 0.7 * s} ${y} h ${1.4 * s} v ${-11 * s} h ${-1.4 * s} Z`,
    `M ${x} ${y - 11 * s} m ${-1.9 * s} ${-2 * s} a ${1.9 * s} ${1.9 * s} 0 1 0 ${3.8 * s} 0 a ${1.9 * s} ${1.9 * s} 0 1 0 ${-3.8 * s} 0`,
    `M ${x} ${y - 22 * s} a ${3.8 * s} ${3.8 * s} 0 1 0 ${2.4 * s} ${6.4 * s} a ${2.7 * s} ${2.7 * s} 0 1 1 ${-2.4 * s} ${-6.4 * s} Z`,
  ].join(" ");
}

function minaret(cx: number, top: number, ground: number) {
  const w = 8;
  return [
    `M ${cx - w / 2 - 2} ${ground} L ${cx - w / 2} ${top + 20} L ${cx + w / 2} ${top + 20} L ${cx + w / 2 + 2} ${ground} Z`,
    `M ${cx - w} ${top + 56} h ${2 * w} v 5 h ${-2 * w} Z`,
    `M ${cx - w * 0.85} ${top + 92} h ${1.7 * w} v 4 h ${-1.7 * w} Z`,
    `M ${cx - w * 0.75} ${top + 13} h ${1.5 * w} v 8 h ${-1.5 * w} Z`,
    dome(cx, w * 0.85, w * 0.6, top + 13, top),
    finial(cx, top, 0.6),
  ].join(" ");
}

const WATER = 196;
// The marketing mosque is drawn around x≈334 in a 1440-wide box; shift it to the centre.
const MOSQUE_DX = 720 - 349;
const MOSQUE_PATH = [
  `M 150 162 h 380 v ${WATER - 162} h -380 Z`,
  ...[186, 240, 428, 482].flatMap((cx) => [dome(cx, 18, 13, 162, 142), finial(cx, 142, 0.38)]),
  dome(288, 27, 20, 158, 122),
  dome(380, 27, 20, 158, 122),
  finial(288, 122, 0.45),
  finial(380, 122, 0.45),
  "M 296 148 h 76 v 14 h -76 Z",
  dome(334, 56, 40, 148, 72),
  finial(334, 72, 0.8),
  minaret(122, 104, WATER),
  minaret(210, 88, WATER),
  minaret(458, 88, WATER),
  minaret(548, 104, WATER),
].join(" ");
const WINDOW_XS = [214, 254, 294, 334, 374, 414, 454];

export function MosqueHorizon({
  cW,
  cH,
  heightFrac,
}: {
  cW: number;
  cH: number;
  heightFrac?: number;
}) {
  const uid = useUid("mh");
  const id = (n: string) => `${uid}-${n}`;
  const h = Math.max(cW / 6, cH * (heightFrac ?? (cW > cH ? 0.2 : 0.11)));
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      width={cW}
      height={h}
      style={{ position: "absolute", left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id={id("mosque")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#132534" />
          <stop offset="0.55" stopColor="#0a1826" />
          <stop offset="1" stopColor="#050e18" />
        </linearGradient>
        <linearGradient id={id("far")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a4d" />
          <stop offset="1" stopColor="#14222f" />
        </linearGradient>
        <linearGradient id={id("near")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2c3d" />
          <stop offset="1" stopColor="#0d1a26" />
        </linearGradient>
        <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#453527" />
          <stop offset="0.35" stopColor="#1d2432" />
          <stop offset="1" stopColor="#070f1a" />
        </linearGradient>
        <linearGradient id={id("line")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffcf96" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffd9a8" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffcf96" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("streak")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 176 L90 158 L200 170 L330 152 L470 168 L610 154 L760 170 L900 156 L1050 168 L1200 152 L1330 164 L1440 156 L1440 196 L0 196 Z"
        fill={`url(#${id("far")})`}
        opacity="0.55"
      />
      <path
        d="M0 184 L120 168 L260 180 L420 164 L600 180 L780 166 L960 180 L1130 164 L1300 178 L1440 168 L1440 196 L0 196 Z"
        fill={`url(#${id("near")})`}
        opacity="0.9"
      />
      <g transform={`translate(${MOSQUE_DX} 0)`}>
        <path d={MOSQUE_PATH} fill={`url(#${id("mosque")})`} />
        {WINDOW_XS.map((x) => (
          <g key={x}>
            <rect x={x - 3} y="175.5" width="6" height="9" rx="2.5" fill="#ffd9a0" opacity="0.35" />
            <rect x={x - 1.4} y="177" width="2.8" height="6" rx="1.4" fill="#ffe9c4" />
          </g>
        ))}
        {[312, 326, 340, 354].map((x) => (
          <circle key={x} cx={x} cy={155} r="1.6" fill="#ffd9a0" opacity="0.85" />
        ))}
      </g>
      <rect x="0" y={WATER} width="1440" height={240 - WATER} fill={`url(#${id("water")})`} />
      <rect x="0" y={WATER - 1} width="1440" height="2" fill={`url(#${id("line")})`} />
      <g transform={`translate(${MOSQUE_DX} ${2 * WATER}) scale(1 -1)`} opacity="0.18">
        <path d={MOSQUE_PATH} fill={`url(#${id("mosque")})`} />
      </g>
      <g transform={`translate(${MOSQUE_DX} 0)`}>
        {WINDOW_XS.map((x) => (
          <rect
            key={x}
            x={x - 1.4}
            y={WATER + 2}
            width="2.8"
            height="32"
            fill={`url(#${id("streak")})`}
            opacity="0.8"
          />
        ))}
      </g>
    </svg>
  );
}

// ---------- Magnifier lens ----------

/**
 * Zooms into the slide's own screenshot via CSS background (no extra asset,
 * follows the locale). `zoom` = how many lens-widths the screenshot spans.
 */
export function LensView({
  src,
  lens,
  ring = "#FFFFFF",
  tint = "#000000",
  imageAspect = 0.46,
}: {
  src: string;
  lens: LensSpec;
  ring?: string;
  tint?: string;
  /** Screenshot w/h — needed to centre the focus point vertically. */
  imageAspect?: number;
}) {
  // background-position % aligns p% of the image with p% of the box; solve for
  // the p that puts the focus point at the lens centre: p = (f·R − ½) / (R − 1),
  // R = image size / lens size on that axis.
  const centre = (f: number, R: number) =>
    R <= 1 ? 50 : Math.max(0, Math.min(100, ((f * R - 0.5) / (R - 1)) * 100));
  const posX = centre(lens.x, lens.zoom);
  const posY = centre(lens.y, lens.zoom / imageAspect);
  return (
    <div style={{ width: "100%", height: "100%", containerType: "inline-size" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `3.2cqw solid ${ring}`,
          boxSizing: "border-box",
          backgroundColor: "#000",
          backgroundImage: src ? `url("${src}")` : undefined,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${lens.zoom * 100}% auto`,
          backgroundPosition: `${posX}% ${posY}%`,
          boxShadow: `0 6cqw 16cqw ${alpha(tint, 0.45)}, 0 0 0 0.6cqw rgba(0,0,0,0.08)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(90% 60% at 30% 18%, rgba(255,255,255,0.22), transparent 55%)",
          }}
        />
      </div>
    </div>
  );
}

// ---------- Feature chips ----------

/** Glass pills with a check dot, one per line (marketing .glass-hero / open-assets badges). */
export function FeatureChips({
  items,
  tone,
  unit,
  dir,
  align = "center",
}: {
  items: string[];
  tone: Tone;
  unit: number;
  dir?: "rtl" | "ltr";
  align?: "center" | "left";
}) {
  const size = unit * 0.034;
  const dot = size * 1.25;
  const surface = tone.light ? "rgba(255,255,255,0.72)" : "rgba(10,47,39,0.55)";
  const border = tone.light ? "rgba(21,41,33,0.12)" : "rgba(255,255,255,0.14)";
  return (
    <div
      dir={dir}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: align === "left" ? "flex-start" : "center",
        gap: size * 0.55,
      }}
    >
      {keyedLines(items).map(({ key, text: item }) => (
        <div
          key={key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: size * 0.45,
            padding: `${size * 0.42}px ${size * 0.8}px ${size * 0.42}px ${size * 0.45}px`,
            borderRadius: 9999,
            background: surface,
            border: `${Math.max(1, unit * 0.0012)}px solid ${border}`,
            boxShadow: tone.light
              ? `0 ${size * 0.25}px ${size}px rgba(21,41,33,0.08)`
              : `0 ${size * 0.3}px ${size * 1.1}px rgba(0,0,0,0.28)`,
            color: tone.fg,
            fontSize: size,
            fontWeight: 650,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden
            style={{
              width: dot,
              height: dot,
              flexShrink: 0,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${shade(tone.accent, 14)}, ${tone.accent})`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={dot * 0.56} height={dot * 0.56} viewBox="0 0 24 24" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                fill="none"
                stroke={bestForeground(tone.accent)}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

/** Stable keys for copy lines that may repeat ("Tasbeeh", "Tasbeeh" → Tasbeeh#0, Tasbeeh#1). */
function keyedLines(lines: string[]) {
  const seen = new Map<string, number>();
  return lines.map((text) => {
    const n = seen.get(text) ?? 0;
    seen.set(text, n + 1);
    return { key: `${text}#${n}`, text };
  });
}
