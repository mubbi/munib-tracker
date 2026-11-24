import type { OcrResult, OcrToken, TimetablePrayer } from "../types";

/**
 * Synthetic OCR token dumps for the NF-3.12 parser fixtures. A sheet is a list
 * of lines; each line is `[x, text]` cells. Words become separate tokens (the
 * ML Kit / Tesseract shape) unless `phrases` is set (the Vision shape).
 * Deterministic noise: y/x jitter, rotation, split time tokens, low confidence.
 */

export type Line = Array<[number, string]>;

export interface SheetOptions {
  lineGap?: number;
  charW?: number;
  h?: number;
  top?: number;
  /** Degrees; rotates every box centre around the origin. */
  rotate?: number;
  /** Max ±px jitter on each token. */
  jitter?: number;
  seed?: number;
  /** One token per cell (spaces kept) — Apple Vision returns phrases. */
  phrases?: boolean;
  /** Split time words into "H" ":" "MM" tokens (OCR break-up). */
  splitTimes?: boolean | ((text: string, index: number) => boolean);
  /** Confidence per token (default 0.95). */
  conf?: number | ((text: string, index: number) => number);
  /** Drop tokens whose (global) index makes this true — simulates misses. */
  drop?: (text: string, index: number) => boolean;
}

/** mulberry32 — tiny deterministic PRNG. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIME_WORD = /^[\d٠-٩۰-۹]{1,2}[:.٫h][\d٠-٩۰-۹]{2}$/;

export function sheet(lines: Line[], opts: SheetOptions = {}): OcrResult {
  const lineGap = opts.lineGap ?? 44;
  const charW = opts.charW ?? 14;
  const h = opts.h ?? 28;
  const top = opts.top ?? 80;
  const rand = prng(opts.seed ?? 7);
  const rad = ((opts.rotate ?? 0) * Math.PI) / 180;
  const tokens: OcrToken[] = [];
  let index = 0;

  const push = (text: string, x: number, y: number, w: number) => {
    const i = index;
    index += 1;
    if (opts.drop?.(text, i)) return;
    const jitter = opts.jitter ?? 0;
    const jx = jitter ? (rand() * 2 - 1) * jitter : 0;
    const jy = jitter ? (rand() * 2 - 1) * jitter : 0;
    const cx = x + w / 2 + jx;
    const cy = y + h / 2 + jy;
    const rx = cx * Math.cos(rad) - cy * Math.sin(rad);
    const ry = cx * Math.sin(rad) + cy * Math.cos(rad);
    const conf = typeof opts.conf === "function" ? opts.conf(text, i) : (opts.conf ?? 0.95);
    tokens.push({ text, conf, box: { x: rx - w / 2, y: ry - h / 2, w, h } });
  };

  lines.forEach((line, row) => {
    const y = top + row * lineGap;
    for (const [x, text] of line) {
      if (opts.phrases) {
        push(text, x, y, text.length * charW);
        continue;
      }
      let cursor = x;
      for (const word of text.split(" ").filter(Boolean)) {
        const split =
          typeof opts.splitTimes === "function"
            ? opts.splitTimes(word, index)
            : (opts.splitTimes ?? false);
        if (split && TIME_WORD.test(word)) {
          const m = word.match(/^(.{1,2})([:.٫h])(.{2})$/);
          if (m) {
            const [, hh = "", sep = "", mm = ""] = m;
            push(hh, cursor, y, hh.length * charW);
            push(sep, cursor + hh.length * charW, y, charW * 0.5);
            push(mm, cursor + (hh.length + 0.5) * charW, y, mm.length * charW);
            cursor += (word.length + 1) * charW;
            continue;
          }
        }
        push(word, cursor, y, word.length * charW);
        cursor += (word.length + 1) * charW;
      }
    }
  });
  return { tokens, width: 2000, height: top + lines.length * lineGap + 80 };
}

export type Style =
  | "24"
  | "12"
  | "12pad"
  | "ampm"
  | "ampmSpace"
  | "dot"
  | "h"
  | "arabic"
  | "urdu"
  | "arabicSep";

const EASTERN = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";

/** Formats "HH:mm" in a sheet style. */
export function fmt(value: string, style: Style): string {
  const [hh = "0", mm = "00"] = value.split(":");
  const hour = Number(hh);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  switch (style) {
    case "24":
      return value;
    case "12":
      return `${h12}:${mm}`;
    case "12pad":
      return `${String(h12).padStart(2, "0")}:${mm}`;
    case "ampm":
      return `${h12}:${mm}${suffix.toLowerCase()}`;
    case "ampmSpace":
      return `${h12}:${mm} ${suffix}`;
    case "dot":
      return `${h12}.${mm}`;
    case "h":
      return `${hh}h${mm}`;
    case "arabic":
      return `${h12}:${mm}`.replace(/\d/g, (d) => EASTERN[Number(d)] ?? d);
    case "arabicSep":
      return `${h12}٫${mm}`.replace(/\d/g, (d) => EASTERN[Number(d)] ?? d);
    case "urdu":
      return `${h12}:${mm}`.replace(/\d/g, (d) => PERSIAN[Number(d)] ?? d);
  }
}

export function toArabicDigits(text: string): string {
  return text.replace(/\d/g, (d) => EASTERN[Number(d)] ?? d);
}

export function addMinutes(value: string, minutes: number): string {
  const [h = "0", m = "0"] = value.split(":");
  const total = (((Number(h) * 60 + Number(m) + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export type DayTimes = Partial<Record<TimetablePrayer, { adhan?: string; iqamah?: string }>>;

/** A plausible month of times: each day shifts by `drift` minutes per prayer. */
export function monthTimes(
  days: number,
  base: DayTimes,
  drift: Partial<Record<TimetablePrayer, number>> = {},
): DayTimes[] {
  return Array.from({ length: days }, (_, d) => {
    const out: DayTimes = {};
    for (const [prayer, times] of Object.entries(base) as Array<
      [TimetablePrayer, { adhan?: string; iqamah?: string }]
    >) {
      const shift = Math.round((drift[prayer] ?? 0) * d);
      // Iqamah moves in 5-minute steps like real sheets.
      const iqShift = Math.round(shift / 5) * 5;
      out[prayer] = {
        ...(times.adhan && { adhan: addMinutes(times.adhan, shift) }),
        ...(times.iqamah && { iqamah: addMinutes(times.iqamah, iqShift) }),
      };
    }
    return out;
  });
}
