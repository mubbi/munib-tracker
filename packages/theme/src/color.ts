/**
 * Canonical colour maths for the design system. Kept dependency-free so both the
 * shared theme resolver and the app can rely on one source of truth for contrast.
 */

/** Parses a #RGB or #RRGGBB hex string into 0-255 channels, or null if invalid. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace(/^#/, "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

/** Serialises 0-255 channels to a #RRGGBB string, clamping out-of-range values. */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function isValidHex(hex: string): boolean {
  return hexToRgb(hex) !== null;
}

/** Normalises to a #RRGGBB string, or null if invalid. */
export function normalizeHex(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** Contrast ratio between two colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Brand near-black used as the dark foreground everywhere on light fills. */
const INK = "#152921";
const PAPER = "#FFFFFF";

/**
 * Picks the brand near-black or near-white that reads best on `background`.
 * Unlike a naive luminance threshold this compares actual contrast, so it stays
 * correct for mid-tone accents (gold/amber) where a 0.5 cutoff guesses wrong.
 */
export function bestForeground(background: string): string {
  return contrastRatio(background, INK) >= contrastRatio(background, PAPER) ? INK : PAPER;
}

/**
 * Returns `color` if it already meets `target` contrast on `surface`; otherwise
 * nudges it toward black (on light surfaces) or white (on dark surfaces) until it
 * does. Used to derive an AA-passing "accent as text" tone from a fill colour.
 */
export function accentOnSurface(color: string, surface: string, target = 4.5): string {
  if (contrastRatio(color, surface) >= target) return color;
  const rgb = hexToRgb(color);
  if (!rgb) return bestForeground(surface);
  const toward = relativeLuminance(surface) > 0.5 ? 0 : 255;
  let { r, g, b } = rgb;
  for (let i = 0; i < 24; i += 1) {
    r += (toward - r) * 0.1;
    g += (toward - g) * 0.1;
    b += (toward - b) * 0.1;
    const hex = rgbToHex(r, g, b);
    if (contrastRatio(hex, surface) >= target) return hex;
  }
  return bestForeground(surface);
}

/**
 * Nudges `accent` toward the surface's opposite luminance until it clears
 * `minRatio` contrast against `background`, shifting every channel equally so
 * the hue is largely preserved. Unlike {@link accentOnSurface} (which targets
 * AA text contrast and desaturates toward black/white), this keeps mid-tone
 * accents vibrant and only rescues near-white accents on light surfaces or
 * near-black accents on dark ones — the same adaptation preset accents get from
 * their hand-tuned light/dark pair. Returns a neutral slate fallback if the
 * colour can't be rescued within the step budget.
 */
export function ensureContrastAgainst(accent: string, background: string, minRatio = 3): string {
  const normalized = normalizeHex(accent);
  if (!normalized) return accent;
  if (contrastRatio(normalized, background) >= minRatio) return normalized;

  const direction = relativeLuminance(background) > 0.5 ? -1 : 1;
  let current = normalized;
  for (let step = 0; step < 12; step += 1) {
    const rgb = hexToRgb(current);
    if (!rgb) break;
    current = rgbToHex(rgb.r + direction * 20, rgb.g + direction * 20, rgb.b + direction * 20);
    if (contrastRatio(current, background) >= minRatio) return current;
  }

  return relativeLuminance(background) > 0.5 ? "#475569" : "#CBD5E1";
}

/**
 * Composites `foreground` at `alpha` over an opaque `background` (straight
 * alpha, sRGB) and returns the resulting opaque hex. Use it to measure the real
 * contrast of text placed on a translucent tint (`withAlpha(accent, 0.14)` on a
 * card), which `contrastRatio` alone cannot do.
 */
export function compositeOver(foreground: string, alpha: number, background: string): string {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return background;
  const a = Math.min(1, Math.max(0, alpha));
  return rgbToHex(fg.r * a + bg.r * (1 - a), fg.g * a + bg.g * (1 - a), fg.b * a + bg.b * (1 - a));
}

export interface ContrastPair {
  /** Human-readable label used in test failure messages. */
  label: string;
  foreground: string;
  background: string;
  /** Minimum ratio (4.5 text, 3 large text / non-text / focus). */
  min: number;
}

export interface ContrastFailure extends ContrastPair {
  ratio: number;
}

/** Returns every pair below its minimum — an empty array means the matrix passes. */
export function contrastMatrix(pairs: readonly ContrastPair[]): ContrastFailure[] {
  const failures: ContrastFailure[] = [];
  for (const pair of pairs) {
    const ratio = contrastRatio(pair.foreground, pair.background);
    if (ratio < pair.min) failures.push({ ...pair, ratio: Math.round(ratio * 100) / 100 });
  }
  return failures;
}

/** #RRGGBB → HSL (h 0–360, s / l 0–1), or null if invalid. */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return { h, s, l };
}

/** HSL (h 0–360, s / l 0–1) → #rrggbb. */
export function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/**
 * Readability guard for a user-chosen accent: when `accent` falls below
 * `minRatio` contrast on any of `surfaces` (e.g. the page and card of the
 * current scheme), returns the closest colour of the **same hue and saturation**
 * that clears it, moving only HSL lightness (lighter on dark surfaces, darker on
 * light ones). Unlike {@link ensureContrastAgainst}, whose equal-channel steps
 * grey a deep colour out (a forest `#0C390F` on the dark page became a muddy,
 * disabled-looking sage), this keeps the colour recognisably the user's. The
 * stored hex is never changed — callers apply this only for UI use.
 */
export function ensureReadableAccent(
  accent: string,
  surfaces: readonly string[],
  minRatio = 3,
): string {
  const normalized = normalizeHex(accent);
  if (!normalized || surfaces.length === 0) return accent;
  const passes = (hex: string) => surfaces.every((s) => contrastRatio(hex, s) >= minRatio);
  if (passes(normalized)) return normalized;
  const hsl = hexToHsl(normalized);
  if (!hsl) return normalized;
  const lightSurfaces =
    surfaces.reduce((sum, s) => sum + relativeLuminance(s), 0) / surfaces.length > 0.5;
  // Search the lightness range between the colour and black / white for the
  // smallest move that passes; `pass` always holds a passing lightness.
  let fail = hsl.l;
  let pass = lightSurfaces ? 0 : 1;
  if (!passes(hslToHex(hsl.h, hsl.s, pass))) {
    return ensureContrastAgainst(
      normalized,
      surfaces[0] ?? (lightSurfaces ? "#ffffff" : "#000000"),
    );
  }
  for (let i = 0; i < 20; i += 1) {
    const mid = (fail + pass) / 2;
    if (passes(hslToHex(hsl.h, hsl.s, mid))) pass = mid;
    else fail = mid;
  }
  return hslToHex(hsl.h, hsl.s, pass);
}
