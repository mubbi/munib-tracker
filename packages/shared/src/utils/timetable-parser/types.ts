/**
 * NF-3.12 timetable OCR — types shared by the on-device recogniser (native
 * module / web WASM) and the pure rule-based parser. No cloud OCR, no LLM (D3).
 */

/** One recognised word with its confidence (0–1, or 0–100 — normalised) and box in image pixels. */
export interface OcrToken {
  text: string;
  conf: number;
  box: { x: number; y: number; w: number; h: number };
}

/** Output contract of `recognize(uri)` on every platform. */
export interface OcrResult {
  tokens: OcrToken[];
  width: number;
  height: number;
}

/** Prayers a timetable header can name (Jumu'ah is collected separately). */
export type TimetablePrayer = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export type TimetableKind = "adhan" | "iqamah";

export type TimetableCellFlag =
  /** OCR confidence (or layout confidence) under the review threshold. */
  | "lowConfidence"
  /** The adhan is more than 20 min from the calculated time for that date. */
  | "farFromCalculated"
  /** The iqamah is not within [adhan, adhan + 90 min]. */
  | "iqamahWindow"
  /** No AM/PM assignment keeps the prayers in order. */
  | "orderConflict"
  /** A header or qualifier was inferred (e.g. single unlabelled column ⇒ iqamah). */
  | "kindAssumed"
  /** Expected a time but nothing readable was found. */
  | "missing"
  /**
   * The column's header was unclear (a misread or missing label left more
   * columns under one prayer than it can have) — the prayer / kind is a guess.
   */
  | "columnUnclear";

export interface TimetableCell {
  prayer: TimetablePrayer;
  kind: TimetableKind;
  /** "HH:mm" (24h) after normalisation + disambiguation; null when missing. */
  value: string | null;
  /** The OCR text the value came from (for the review grid). */
  raw: string;
  /** min(token confidence, layout confidence), 0–1. */
  confidence: number;
  flags: TimetableCellFlag[];
  /** Highlighted for review: confidence < 0.8 or any flag. */
  needsReview: boolean;
}

export interface TimetableRow {
  /** Day of month for monthly sheets; null for a daily sheet. */
  day: number | null;
  /** True when the day number was inferred from its neighbours. */
  dayInferred?: boolean;
  /**
   * Months after the sheet's first month (1 once the date column wraps from
   * 28–31 back to 1, e.g. a Ramadan sheet spanning two Gregorian months).
   */
  monthOffset?: number;
  cells: TimetableCell[];
}

/** A column of day numbers a monthly sheet could be dated by. */
export interface TimetableDateColumn {
  /** Stable id (left-to-right order) for {@link ParseTimetableOptions.dateColumn}. */
  id: number;
  /** What its header says: a Gregorian date, a Hijri / Ramadan day, or nothing readable. */
  header: "gregorian" | "hijri" | null;
  /** First and last day numbers read in the column (sheet order). */
  first: number;
  last: number;
}

export interface TimetableJumuah {
  khutbahAt?: string;
  iqamahAt?: string;
  confidence: number;
  needsReview: boolean;
}

export type TimetableLayout = "daily" | "monthly" | "none";

export interface ParsedTimetable {
  layout: TimetableLayout;
  /** `rows`: one prayer per line (daily boards); `columns`: one prayer per column (grids). */
  orientation: "rows" | "columns" | null;
  rows: TimetableRow[];
  jumuah: TimetableJumuah[];
  /** Month / year printed on the sheet ("November 2026"), if any. */
  monthHint: { month?: number; year?: number };
  /** Detected skew in degrees (rotated photo). */
  skewDegrees: number;
  /** Monthly sheets: every column of day numbers found (Gregorian, Hijri, Ramadan day …). */
  dateColumns?: TimetableDateColumn[];
  /** Id of the column the rows are dated by (null: none, days inferred from 1). */
  dateColumn?: number | null;
  /**
   * More than one column could be the Gregorian date and no header settled it:
   * the review must ask the user (re-parse with `dateColumn`) before saving.
   */
  dateColumnAmbiguous?: boolean;
  /** The date column wraps into the next month (rows carry `monthOffset`). */
  monthWrap?: boolean;
  /**
   * The sheet only lists start (Adhan) times: its single unlabelled column
   * tracks the calculated Adhan, so no iqamah time is taken from it.
   */
  beginsOnly?: boolean;
}

/** Calculated adhan times for a local date (`YYYY-MM-DD`), used for plausibility checks. */
export type CalculatedTimesFn = (
  dateKey: string,
) => Partial<Record<TimetablePrayer, string>> | null | undefined;

export interface ParseTimetableOptions {
  /** Month (1–12) / year of a monthly sheet; defaults to the sheet's hint, then `referenceDate`. */
  year?: number;
  month?: number;
  /** "Today" for daily sheets and the monthly default (local calendar). */
  referenceDate?: { year: number; month: number; day: number };
  /** On-device calculated times (`prayer-times.ts`) for the user's location. */
  calculated?: CalculatedTimesFn;
  /** Review threshold (default 0.8). */
  reviewThreshold?: number;
  /** Monthly sheets: the user's answer to "which column is the date?" (a `dateColumns` id). */
  dateColumn?: number;
}
