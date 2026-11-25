import {
  type OcrResult,
  type ParsedTimetable,
  parseLooseClockText,
} from "@munib-tracker/shared/timetable-parser";

import type { IqamahPrayer, ReviewDraft } from "./review";

/**
 * NF-3.12 "mark the times on the photo" (pure). When the automatic read can't
 * find the timetable (LED boards, glare, unusual layouts) the user draws a box
 * around each Salah's time; only that area is read. Areas are kept as
 * fractions of the image (0–1), so they map onto any recogniser's pixel space
 * (Vision / ML Kit report upright image pixels; the web crop uses the natural
 * image size).
 */

export type MarkSlot = IqamahPrayer | "jumuah";

/** Order the guided mode walks through (Jumu'ah last: not every board shows it). */
export const MARK_SLOTS: readonly MarkSlot[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "jumuah",
];

/** A rectangle as fractions of the image (0–1). */
export interface FractionRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Smallest area worth reading (fraction of each side): a stray tap is not a box. */
export const MIN_MARK_FRACTION = 0.02;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Where an image drawn with `resizeMode="contain"` sits inside its view. */
export function containedFrame(view: Size, image: Size): Size & Point {
  if (view.width <= 0 || view.height <= 0 || image.width <= 0 || image.height <= 0) {
    return { x: 0, y: 0, width: view.width, height: view.height };
  }
  const scale = Math.min(view.width / image.width, view.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return { x: (view.width - width) / 2, y: (view.height - height) / 2, width, height };
}

/** Two drag points in view coordinates → the image area they cover (null when too small). */
export function rectFromDrag(start: Point, end: Point, frame: Size & Point): FractionRect | null {
  if (frame.width <= 0 || frame.height <= 0) return null;
  const toFx = (x: number) => clamp01((x - frame.x) / frame.width);
  const toFy = (y: number) => clamp01((y - frame.y) / frame.height);
  const x0 = toFx(Math.min(start.x, end.x));
  const x1 = toFx(Math.max(start.x, end.x));
  const y0 = toFy(Math.min(start.y, end.y));
  const y1 = toFy(Math.max(start.y, end.y));
  if (x1 - x0 < MIN_MARK_FRACTION || y1 - y0 < MIN_MARK_FRACTION) return null;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** The area in a pixel space of `size` (rounded, clamped inside the image). */
export function toPixels(
  rect: FractionRect,
  size: Size,
): { x: number; y: number; w: number; h: number } {
  const x = Math.max(0, Math.floor(rect.x * size.width));
  const y = Math.max(0, Math.floor(rect.y * size.height));
  const w = Math.max(1, Math.min(size.width - x, Math.ceil(rect.w * size.width)));
  const h = Math.max(1, Math.min(size.height - y, Math.ceil(rect.h * size.height)));
  return { x, y, w, h };
}

/** "H:MM" as the board shows it (12-hour stays 12-hour — the review reads it per Salah). */
export function looseTimeText(text: string): string | null {
  const clock = parseLooseClockText(text);
  if (!clock) return null;
  const marker = clock.meridiem ? ` ${clock.meridiem}` : "";
  return `${clock.hour}:${String(clock.minute).padStart(2, "0")}${marker}`;
}

/**
 * The time already recognised inside a marked area: tokens of the full-photo
 * read whose centre falls in it, in reading order. Native engines read LED and
 * printed digits well, so this is all a marked area needs there.
 */
export function timeFromTokens(ocr: OcrResult | null, rect: FractionRect): string | null {
  if (!ocr || ocr.width <= 0 || ocr.height <= 0) return null;
  // A little slack: users draw tight boxes, OCR boxes overhang.
  const padX = rect.w * 0.15;
  const padY = rect.h * 0.25;
  const left = (rect.x - padX) * ocr.width;
  const right = (rect.x + rect.w + padX) * ocr.width;
  const top = (rect.y - padY) * ocr.height;
  const bottom = (rect.y + rect.h + padY) * ocr.height;
  const inside = ocr.tokens
    .filter((t) => {
      const cx = t.box.x + t.box.w / 2;
      const cy = t.box.y + t.box.h / 2;
      return cx >= left && cx <= right && cy >= top && cy <= bottom;
    })
    .sort((a, b) => a.box.x - b.box.x);
  if (inside.length === 0) return null;
  // Try the whole area first, then each token (a label caught in the box).
  return (
    looseTimeText(inside.map((t) => t.text).join(" ")) ??
    inside.map((t) => looseTimeText(t.text)).find((v): v is string => v != null) ??
    null
  );
}

/** Most supported reading across several attempts (each weighted by its confidence 0–1). */
export function voteReadings(
  readings: ReadonlyArray<{ text: string; conf: number }>,
): string | null {
  const scores = new Map<string, number>();
  for (const reading of readings) {
    const time = looseTimeText(reading.text);
    if (!time) continue;
    scores.set(time, (scores.get(time) ?? 0) + Math.max(0.05, reading.conf));
  }
  let best: string | null = null;
  let bestScore = 0;
  for (const [time, score] of scores) {
    if (score > bestScore) {
      best = time;
      bestScore = score;
    }
  }
  return best;
}

export type MarkedTimes = Partial<Record<MarkSlot, string>>;

/**
 * The marked (or typed) times → a daily review draft. Every value came from a
 * box the user drew or a number they typed, so nothing is flagged.
 */
export function draftFromMarks(marks: MarkedTimes): ReviewDraft {
  const cell = (text: string | undefined) => ({
    text: text?.trim() ?? "",
    needsReview: false,
    flags: [],
    raw: text ?? "",
    edited: true,
  });
  const jumuah = marks.jumuah?.trim();
  return {
    layout: "daily",
    rows: [
      {
        day: null,
        cells: {
          fajr: cell(marks.fajr),
          dhuhr: cell(marks.dhuhr),
          asr: cell(marks.asr),
          maghrib: cell(marks.maghrib),
          isha: cell(marks.isha),
        },
      },
    ],
    jumuah: jumuah ? [{ text: jumuah, kind: "iqamah" }] : [],
  };
}

/** Times from an automatic read, to start the guided mode from (daily sheets only). */
export function marksFromParsed(parsed: ParsedTimetable | null): MarkedTimes {
  const row = parsed?.layout === "daily" ? parsed.rows[0] : undefined;
  const out: MarkedTimes = {};
  for (const slot of MARK_SLOTS) {
    if (slot === "jumuah") continue;
    const value = row?.cells.find((c) => c.prayer === slot && c.kind === "iqamah")?.value;
    if (value) out[slot] = value;
  }
  const jumuah = parsed?.jumuah[0]?.iqamahAt;
  if (jumuah) out.jumuah = jumuah;
  return out;
}
