import type { IqamahDaily, JumuahSlot } from "@munib-tracker/shared/masjid";
import {
  IQAMAH_TIMETABLE_PRAYERS,
  normaliseDigits,
  type ParsedTimetable,
  type TimetableCellFlag,
  type TimetableDateColumn,
  timetableDateKey,
  timetablePeriodFor,
} from "@munib-tracker/shared/timetable-parser";

/**
 * NF-3.12 review grid model (pure). The parser's cells become an editable
 * draft of iqamah times — the only values saved as "Your times" (adhan times
 * are always calculated on-device). User edits are kept as overrides so a
 * re-parse (e.g. after picking a different month) never loses them.
 */

export type IqamahPrayer = (typeof IQAMAH_TIMETABLE_PRAYERS)[number];
/** What a typed time belongs to — decides how a 12-hour "8:15" is read. */
export type TypedTimeSlot = IqamahPrayer | "jumuah";

export interface DraftCell {
  /** Text in the input ("HH:mm" or what the user typed). */
  text: string;
  /** The parser flagged this cell (or its confidence is low) and the user hasn't edited it. */
  needsReview: boolean;
  flags: TimetableCellFlag[];
  /** OCR text the value came from. */
  raw: string;
  edited: boolean;
}

export interface DraftRow {
  /** Day of month (monthly) or null (daily). */
  day: number | null;
  /** Months after the sheet's first month (a sheet that runs into the next month). */
  monthOffset?: number;
  cells: Record<IqamahPrayer, DraftCell>;
}

export interface JumuahDraft {
  text: string;
  kind: "iqamah" | "khutbah";
}

export interface ReviewDraft {
  layout: "daily" | "monthly";
  rows: DraftRow[];
  /** Jumu'ah slots: the iqamah time, or the khutbah time when that is all the sheet gave. */
  jumuah: JumuahDraft[];
  /** The sheet lists start (Adhan) times only — no iqamah was taken from it. */
  beginsOnly?: boolean;
  /** The date column wraps into the next month. */
  monthWrap?: boolean;
  /**
   * Monthly sheet with more than one possible date column (e.g. Ramadan day
   * vs Gregorian date): the user must pick one before saving.
   */
  dateQuestion?: { columns: TimetableDateColumn[]; chosen: number | null };
}

/** `${day|"daily"}:${prayer}` (prefixed `${offset}+` past a month wrap) → typed text. */
export type ReviewOverrides = Record<string, string>;

export function overrideKey(day: number | null, prayer: IqamahPrayer, monthOffset = 0): string {
  return `${monthOffset > 0 ? `${monthOffset}+` : ""}${day ?? "daily"}:${prayer}`;
}

const TYPED_MERIDIEM = /\s*(a\.?\s?m\.?|p\.?\s?m\.?|a|p|ص|م)$/i;
const TYPED_SEPARATORS = /\s*[:.٫٬،,h]\s*/g;

/**
 * 24-hour value for a 12-hour clock typed without AM/PM, read the way the
 * parser reads the sheet (plan §5): Fajr is morning; Dhuhr is late morning or
 * after noon (10–12 as written, 1–9 PM); Asr / Maghrib are afternoon or
 * evening; Isha is evening, or just after midnight for 12 / 1 / 2; Jumu'ah is
 * midday (10–12 as written, 1–9 PM).
 */
function hourFor(slot: TypedTimeSlot, hour: number): number {
  switch (slot) {
    case "fajr":
      return hour % 12;
    case "dhuhr":
    case "jumuah":
      return hour >= 10 ? hour : hour + 12;
    case "isha":
      return hour === 12 || hour < 3 ? hour % 12 : hour + 12;
    default:
      return hour === 12 ? 12 : hour + 12;
  }
}

/**
 * Normalises what the user typed in a cell to "HH:mm" (24h): "17:30" and
 * "1730" stay as written; "٨:١٥" → digits mapped; "8:15 pm" / "8:15 م" honour
 * the marker; a bare 12-hour time (hour 1–12, leading zero or not) is read for
 * its `slot` like the parser does — "8:15" for Isha → "20:15", "1:30" for
 * Dhuhr → "13:30". Without a slot the text is taken as 24-hour. Empty → ""
 * (cell left blank, not saved). Anything else → null (invalid).
 */
export function normaliseTypedTime(text: string, slot?: TypedTimeSlot): string | null {
  let s = normaliseDigits(text).trim();
  if (s === "") return "";
  let meridiem: "am" | "pm" | null = null;
  const marker = s.match(TYPED_MERIDIEM);
  if (marker && marker.index !== undefined && marker.index > 0) {
    const word = marker[1] ?? "";
    meridiem = /^a/i.test(word) || word === "ص" ? "am" : "pm";
    s = s.slice(0, marker.index);
  }
  s = s.replace(TYPED_SEPARATORS, ":");
  const match = s.match(/^(\d{1,2}):?(\d{2})$/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (meridiem === "pm" ? 12 : 0);
  } else if (slot && hour >= 1 && hour <= 12) {
    hour = hourFor(slot, hour);
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * True when the saved value isn't literally what was typed (a 12-hour time
 * read as afternoon / evening / after midnight) — the grid then shows it.
 */
export function typedTimeReinterpreted(text: string, slot: TypedTimeSlot): boolean {
  const read = normaliseTypedTime(text, slot);
  if (!read) return false;
  return read !== normaliseTypedTime(text);
}

function emptyCell(): DraftCell {
  return { text: "", needsReview: false, flags: [], raw: "", edited: false };
}

export function draftFromParsed(
  parsed: ParsedTimetable,
  overrides: ReviewOverrides = {},
): ReviewDraft | null {
  if (parsed.layout === "none") return null;
  const rows: DraftRow[] = parsed.rows.map((row) => {
    const offset = row.monthOffset ?? 0;
    const cells = Object.fromEntries(
      IQAMAH_TIMETABLE_PRAYERS.map((prayer) => {
        const cell = row.cells.find((c) => c.prayer === prayer && c.kind === "iqamah");
        const typed = overrides[overrideKey(row.day, prayer, offset)];
        const base: DraftCell = cell
          ? {
              text: cell.value ?? "",
              needsReview: cell.needsReview,
              flags: cell.flags,
              raw: cell.raw,
              edited: false,
            }
          : emptyCell();
        return [
          prayer,
          typed !== undefined ? { ...base, text: typed, needsReview: false, edited: true } : base,
        ];
      }),
    ) as Record<IqamahPrayer, DraftCell>;
    return { day: row.day, ...(offset > 0 && { monthOffset: offset }), cells };
  });
  const jumuah: JumuahDraft[] = parsed.jumuah
    .map((slot): JumuahDraft | null =>
      slot.iqamahAt
        ? { text: slot.iqamahAt, kind: "iqamah" }
        : slot.khutbahAt
          ? { text: slot.khutbahAt, kind: "khutbah" }
          : null,
    )
    .filter((slot): slot is JumuahDraft => slot != null)
    .slice(0, 3);
  return {
    layout: parsed.layout,
    rows,
    jumuah,
    ...(parsed.beginsOnly && { beginsOnly: true }),
    ...(parsed.monthWrap && { monthWrap: true }),
    ...(parsed.dateColumnAmbiguous &&
      parsed.dateColumns && {
        dateQuestion: { columns: parsed.dateColumns, chosen: parsed.dateColumn ?? null },
      }),
  };
}

/** Rows with a cell to check come first (each group keeps the sheet's order). */
export function rowsForReview(draft: ReviewDraft): { flagged: DraftRow[]; rest: DraftRow[] } {
  const flagged: DraftRow[] = [];
  const rest: DraftRow[] = [];
  for (const row of draft.rows) {
    if (IQAMAH_TIMETABLE_PRAYERS.some((p) => row.cells[p].needsReview)) flagged.push(row);
    else rest.push(row);
  }
  return { flagged, rest };
}

export function reviewCounts(draft: ReviewDraft): {
  filled: number;
  toCheck: number;
  invalid: number;
  /** A question (which column is the date?) must be answered before saving. */
  blocked: boolean;
} {
  let filled = 0;
  let toCheck = 0;
  let invalid = 0;
  for (const row of draft.rows) {
    for (const prayer of IQAMAH_TIMETABLE_PRAYERS) {
      const cell = row.cells[prayer];
      const value = normaliseTypedTime(cell.text, prayer);
      if (value === null) invalid += 1;
      else if (value) filled += 1;
      if (cell.needsReview) toCheck += 1;
    }
  }
  for (const slot of draft.jumuah) {
    if (normaliseTypedTime(slot.text, "jumuah") === null) invalid += 1;
  }
  return { filled, toCheck, invalid, blocked: draft.dateQuestion != null };
}

/** The reviewed draft → the private-times shape `saveImportedTimetable` takes. */
export function draftToImported(
  draft: ReviewDraft,
  period: { year: number; month: number },
): { daily?: IqamahDaily; monthly?: Record<string, IqamahDaily>; jumuah?: JumuahSlot[] } {
  const out: { daily?: IqamahDaily; monthly?: Record<string, IqamahDaily>; jumuah?: JumuahSlot[] } =
    {};
  const rowTimes = (row: DraftRow): IqamahDaily | undefined => {
    const times: IqamahDaily = {};
    for (const prayer of IQAMAH_TIMETABLE_PRAYERS) {
      const value = normaliseTypedTime(row.cells[prayer].text, prayer);
      if (value) times[prayer] = value;
    }
    return Object.keys(times).length > 0 ? times : undefined;
  };
  if (draft.layout === "daily") {
    const daily = draft.rows[0] ? rowTimes(draft.rows[0]) : undefined;
    if (daily) out.daily = daily;
  } else {
    for (const row of draft.rows) {
      if (row.day == null) continue;
      const times = rowTimes(row);
      if (!times) continue;
      out.monthly ??= {};
      const month = timetablePeriodFor(period, row.monthOffset ?? 0);
      out.monthly[timetableDateKey(month.year, month.month, row.day)] = times;
    }
  }
  const jumuah: JumuahSlot[] = [];
  for (const slot of draft.jumuah) {
    const value = normaliseTypedTime(slot.text, "jumuah");
    if (value) jumuah.push(slot.kind === "khutbah" ? { khutbahAt: value } : { iqamahAt: value });
  }
  if (jumuah.length > 0) out.jumuah = jumuah;
  return out;
}
