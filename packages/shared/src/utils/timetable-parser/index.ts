import type { IqamahDaily, JumuahSlot } from "../../masjid/osm";
import { IQAMAH_TIMETABLE_PRAYERS, timetableDateKey, timetablePeriodFor } from "./parse";
import type { ParsedTimetable, TimetableCell } from "./types";

export { classifyLabel, dateColumnRole, monthFromText } from "./labels";
/**
 * NF-3.12 timetable OCR parser (D3 — on-device only, rule-based, no LLM).
 * Import from `@munib-tracker/shared/timetable-parser` (kept out of the
 * `utils` barrel so it never lands in the common web chunk).
 */
export {
  clockMinutes,
  formatClock,
  normaliseDigits,
  normaliseLabel,
  numericText,
  parseClockText,
  parseLooseClockText,
} from "./normalise";
export {
  daysInMonth,
  IQAMAH_TIMETABLE_PRAYERS,
  parseTimetable,
  TIMETABLE_PRAYERS,
  timetableDateKey,
  timetablePeriodFor,
} from "./parse";
export type * from "./types";

export interface ImportedTimes {
  daily?: IqamahDaily;
  monthly?: Record<string, IqamahDaily>;
  jumuah?: JumuahSlot[];
}

function iqamahOf(cells: readonly TimetableCell[]): IqamahDaily | undefined {
  const out: IqamahDaily = {};
  for (const prayer of IQAMAH_TIMETABLE_PRAYERS) {
    const cell = cells.find((c) => c.prayer === prayer && c.kind === "iqamah");
    if (cell?.value) out[prayer] = cell.value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * The reviewed timetable → private "Your times" (iqamah only — adhan times are
 * always calculated on-device). Monthly rows need the sheet's (first) month /
 * year; rows past a month wrap carry `monthOffset`. A sheet whose date column
 * is still ambiguous should be resolved in review before this is called.
 */
export function timetableToPrivateTimes(
  parsed: ParsedTimetable,
  period: { year: number; month: number },
): ImportedTimes {
  const out: ImportedTimes = {};
  if (parsed.layout === "daily") {
    const daily = iqamahOf(parsed.rows[0]?.cells ?? []);
    if (daily) out.daily = daily;
  } else if (parsed.layout === "monthly") {
    for (const row of parsed.rows) {
      if (row.day == null) continue;
      const day = iqamahOf(row.cells);
      if (!day) continue;
      out.monthly ??= {};
      const month = timetablePeriodFor(period, row.monthOffset ?? 0);
      out.monthly[timetableDateKey(month.year, month.month, row.day)] = day;
    }
  }
  const jumuah: JumuahSlot[] = [];
  for (const slot of parsed.jumuah) {
    const clean: JumuahSlot = {};
    if (slot.khutbahAt) clean.khutbahAt = slot.khutbahAt;
    if (slot.iqamahAt) clean.iqamahAt = slot.iqamahAt;
    if (clean.khutbahAt || clean.iqamahAt) jumuah.push(clean);
  }
  if (jumuah.length > 0) out.jumuah = jumuah.slice(0, 3);
  return out;
}

/** Counts for the review header ("12 of 155 cells need a look"). */
export function timetableReviewStats(parsed: ParsedTimetable): {
  cells: number;
  filled: number;
  needsReview: number;
} {
  let cells = 0;
  let filled = 0;
  let needsReview = 0;
  for (const row of parsed.rows) {
    for (const cell of row.cells) {
      cells += 1;
      if (cell.value) filled += 1;
      if (cell.needsReview) needsReview += 1;
    }
  }
  return { cells, filled, needsReview };
}
