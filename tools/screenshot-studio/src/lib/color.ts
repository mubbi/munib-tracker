// Small colour helpers for the canvas (hex in, hex/rgba out). No deps.

function parse(hex: string): [number, number, number] {
  const c = hex.replace("#", "").trim();
  const full =
    c.length === 3
      ? c
          .split("")
          .map((x) => x + x)
          .join("")
      : c.slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function toHex([r, g, b]: [number, number, number]) {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${((clamp(r) << 16) | (clamp(g) << 8) | clamp(b)).toString(16).padStart(6, "0")}`;
}

/** Lighten (+) or darken (−) by `percent` of full range — same maths as the old `shade`. */
export function shade(hex: string, percent: number) {
  const amt = (255 * percent) / 100;
  const [r, g, b] = parse(hex);
  return toHex([r + amt, g + amt, b + amt]);
}

/** Mix `a` toward `b` by `t` (0–1). */
export function mix(a: string, b: string, t: number) {
  const A = parse(a);
  const B = parse(b);
  return toHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}

export function alpha(hex: string, a: number) {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** WCAG relative luminance. */
export function luminance(hex: string) {
  const ch = parse(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function isDark(hex: string) {
  return luminance(hex) < 0.22;
}

/** Darken/lighten `fg` until it reaches `target` contrast on `bg` (keeps hue). */
export function ensureContrast(fg: string, bg: string, target = 4.5) {
  const step = isDark(bg) ? 4 : -4;
  let out = fg;
  for (let i = 0; i < 25 && contrast(out, bg) < target; i++) out = shade(out, step);
  return out;
}

/** Ink or white, whichever reads better on `bg`. */
export function bestForeground(bg: string, ink = "#152921", light = "#FFFFFF") {
  return contrast(ink, bg) >= contrast(light, bg) ? ink : light;
}
