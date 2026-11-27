import { describe, expect, it } from "vitest";

import {
  type ParsedTimetable,
  parseClockText,
  parseTimetable,
  type TimetableCell,
  type TimetableKind,
  type TimetablePrayer,
  timetablePeriodFor,
  timetableToPrivateTimes,
} from "../index";
import { type DayTimes, fmt, type Line } from "./fixture-builder";
import { board, grid, iqamahOnly, NOV, NOV_DAYS, sheetOf, WINTER } from "./fixtures";

/**
 * Final-review fixes for the NF-3.12 parser: misread headers (M6), Ramadan-day
 * vs Gregorian date columns (M8), begins-only sheets (L19), duplicate Jumu'ah
 * slots (L20), Isha after midnight (L21) and Arabic separators (L22).
 */

const LABELS: Record<TimetablePrayer, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function cellOf(
  parsed: ParsedTimetable,
  day: number | null,
  prayer: TimetablePrayer,
  kind: TimetableKind,
  monthOffset = 0,
): TimetableCell | undefined {
  const row = parsed.rows.find((r) => r.day === day && (r.monthOffset ?? 0) === monthOffset);
  return row?.cells.find((c) => c.prayer === prayer && c.kind === kind);
}

const allCells = (parsed: ParsedTimetable) => parsed.rows.flatMap((r) => r.cells);

describe("M6 — a misread header never merges its column into a neighbour", () => {
  const days = NOV_DAYS.slice(0, 10);

  it("leaves the Asr columns unassigned (missing, flagged) instead of saving them as Dhuhr", () => {
    const parsed = parseTimetable(
      sheetOf(grid(days, "12", { labels: { ...LABELS, asr: "Ase" } }), { lineGap: 34 }),
      { year: 2026, month: 11 },
    );
    expect(parsed.layout).toBe("monthly");
    for (let day = 1; day <= days.length; day += 1) {
      const want = days[day - 1];
      expect(cellOf(parsed, day, "dhuhr", "iqamah")?.value).toBe(want?.dhuhr?.iqamah);
      expect(cellOf(parsed, day, "dhuhr", "adhan")?.value).toBe(want?.dhuhr?.adhan);
      expect(cellOf(parsed, day, "maghrib", "adhan")?.value).toBe(want?.maghrib?.adhan);
      expect(cellOf(parsed, day, "maghrib", "iqamah")?.value).toBe(want?.maghrib?.iqamah);
      const asr = cellOf(parsed, day, "asr", "iqamah");
      expect(asr?.value ?? null).toBeNull();
      expect(asr?.needsReview).toBe(true);
    }
    // The Asr jamaat time is never saved under any prayer.
    const saved = timetableToPrivateTimes(parsed, { year: 2026, month: 11 });
    expect(saved.monthly?.["2026-11-01"]?.dhuhr).toBe(days[0]?.dhuhr?.iqamah);
    expect(saved.monthly?.["2026-11-01"]?.asr).toBeUndefined();
  });

  it("flags a prayer that a long label pulls a neighbour's column under (iqamah-only grid)", () => {
    const only = days.map(iqamahOnly);
    const parsed = parseTimetable(
      sheetOf(grid(only, "12", { iqamahOnly: true, labels: { ...LABELS, isha: "Ishx" } }), {
        lineGap: 34,
      }),
      { year: 2026, month: 11 },
    );
    const maghrib = cellOf(parsed, 1, "maghrib", "iqamah");
    expect(maghrib?.value).toBe(only[0]?.maghrib?.iqamah);
    expect(maghrib?.flags).toContain("columnUnclear");
    expect(maghrib?.needsReview).toBe(true);
    // The Isha column is released, not read as a second Maghrib time.
    expect(cellOf(parsed, 1, "maghrib", "adhan")).toBeUndefined();
    expect(cellOf(parsed, 1, "isha", "iqamah")?.value ?? null).toBeNull();
  });

  it("keeps clean two-column headers (label centred over Begins + Jamaat) unflagged", () => {
    const parsed = parseTimetable(sheetOf(grid(days, "12"), { lineGap: 34 }), {
      year: 2026,
      month: 11,
    });
    expect(allCells(parsed).some((c) => c.flags.includes("columnUnclear"))).toBe(false);
  });
});

/** Ramadan grid: Gregorian "Date" column + a Ramadan-day column, wrapping Feb → Mar. */
function ramadanSheet(o: { dateHeader?: string; ramadanHeader?: string; ramadanFirst?: boolean }) {
  const days = NOV_DAYS.slice(0, 16);
  const dates = Array.from({ length: 16 }, (_, i) => (i < 11 ? 18 + i : i - 10));
  const lines = grid(days, "12", { hijri: 1 });
  return lines.map((line, index): Line => {
    if (index === 0) {
      return line.flatMap(([x, text]): Line => {
        if (text === "Date") {
          return o.dateHeader ? [[o.ramadanFirst ? 180 : x, o.dateHeader]] : [];
        }
        if (text === "Hijri") {
          return o.ramadanHeader ? [[o.ramadanFirst ? 30 : x, o.ramadanHeader]] : [];
        }
        return [[x, text]];
      });
    }
    const dataIndex = index - 2;
    if (dataIndex < 0) return line;
    // Swap the columns' positions when the Ramadan day is printed first.
    return line.map(([x, text]): [number, string] => {
      if (x === 30) return [o.ramadanFirst ? 180 : 30, String(dates[dataIndex])];
      if (x === 180) return [o.ramadanFirst ? 30 : 180, text];
      return [x, text];
    });
  });
}

describe("M8 — Ramadan-day vs Gregorian date columns", () => {
  const options = { year: 2027, month: 2 };

  it("dates rows by the Date column, skips the Ramadan column and wraps into March", () => {
    const parsed = parseTimetable(
      sheetOf(ramadanSheet({ dateHeader: "Date", ramadanHeader: "Ramadan" }), { lineGap: 34 }),
      options,
    );
    expect(parsed.layout).toBe("monthly");
    expect(parsed.dateColumnAmbiguous).toBe(false);
    expect(parsed.monthWrap).toBe(true);
    expect(parsed.dateColumns?.map((c) => c.header).sort()).toEqual(["gregorian", "hijri"]);
    expect(parsed.rows.map((r) => [r.day, r.monthOffset ?? 0])).toEqual([
      ...Array.from({ length: 11 }, (_, i) => [18 + i, 0]),
      ...Array.from({ length: 5 }, (_, i) => [1 + i, 1]),
    ]);
    // Ramadan day 1 (18 Feb) keeps its own iqamah.
    expect(cellOf(parsed, 18, "isha", "iqamah")?.value).toBe(NOV_DAYS[0]?.isha?.iqamah);
    expect(cellOf(parsed, 1, "isha", "iqamah", 1)?.value).toBe(NOV_DAYS[11]?.isha?.iqamah);

    const saved = timetableToPrivateTimes(parsed, options);
    const keys = Object.keys(saved.monthly ?? {}).sort();
    expect(keys[0]).toBe("2027-02-18");
    expect(keys.at(-1)).toBe("2027-03-05");
    expect(keys).toHaveLength(16);
    expect(saved.monthly?.["2027-02-18"]?.fajr).toBe(NOV_DAYS[0]?.fajr?.iqamah);
  });

  it("never dates by a Ramadan-headed column, even when it is printed first", () => {
    const parsed = parseTimetable(
      sheetOf(ramadanSheet({ ramadanHeader: "Ramadan", ramadanFirst: true }), { lineGap: 34 }),
      options,
    );
    expect(parsed.dateColumnAmbiguous).toBe(false);
    expect(parsed.rows[0]?.day).toBe(18);
  });

  it("asks the user when no header tells the two columns apart, and honours the answer", () => {
    const ocr = sheetOf(ramadanSheet({}), { lineGap: 34 });
    const parsed = parseTimetable(ocr, options);
    expect(parsed.dateColumnAmbiguous).toBe(true);
    expect(parsed.dateColumns).toHaveLength(2);
    const gregorian = parsed.dateColumns?.find((c) => c.first === 18);
    expect(gregorian).toMatchObject({ header: null, last: 5 });

    const answered = parseTimetable(ocr, { ...options, dateColumn: gregorian?.id });
    expect(answered.dateColumnAmbiguous).toBe(false);
    expect(answered.dateColumn).toBe(gregorian?.id);
    expect(answered.rows[0]?.day).toBe(18);
    expect(answered.rows.at(-1)).toMatchObject({ day: 5, monthOffset: 1 });
  });

  it("moves a period across the year end", () => {
    expect(timetablePeriodFor({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(timetablePeriodFor({ year: 2027, month: 2 })).toEqual({ year: 2027, month: 2 });
  });
});

describe("L19 — begins-only sheets never become iqamah times", () => {
  it("reads every single unlabelled column as the Adhan when most track the calculation", () => {
    const begins: DayTimes = Object.fromEntries(
      (["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) => [
        p,
        { iqamah: WINTER[p]?.adhan },
      ]),
    );
    const parsed = parseTimetable(sheetOf(board(begins, "12", { header: null })), {
      referenceDate: NOV,
      // The masjid's Fajr / Isha follow another method (12–15 min apart).
      calculated: () => ({
        fajr: "05:53",
        dhuhr: "12:11",
        asr: "14:04",
        maghrib: "16:21",
        isha: "18:05",
      }),
    });
    expect(parsed.beginsOnly).toBe(true);
    const cells = parsed.rows[0]?.cells ?? [];
    expect(cells.filter((c) => c.kind === "iqamah")).toEqual([]);
    expect(cells.find((c) => c.prayer === "fajr")).toMatchObject({ kind: "adhan", value: "06:05" });
    expect(timetableToPrivateTimes(parsed, { year: 2026, month: 11 }).daily).toBeUndefined();
  });

  it("keeps an iqamah-only board's assumed iqamahs when they don't track the Adhan", () => {
    const parsed = parseTimetable(sheetOf(board(iqamahOnly(WINTER), "12", { header: null })), {
      referenceDate: NOV,
      calculated: () => ({ fajr: "06:05", dhuhr: "12:10", asr: "14:05", maghrib: "16:20" }),
    });
    expect(parsed.beginsOnly).toBeUndefined();
    expect(parsed.rows[0]?.cells.find((c) => c.prayer === "fajr")?.kind).toBe("iqamah");
  });
});

describe("L20 — a monthly Jumu'ah column gives one slot per time", () => {
  it("de-duplicates repeated Jumu'ah times", () => {
    const days = NOV_DAYS.slice(0, 8);
    const lines = grid(days, "12").map((line, index): Line => {
      if (index === 0) return [...line, [1500, "Jumu'ah"]];
      if (index === 1) return line;
      return [...line, [1500, fmt("13:15", "12")]];
    });
    const parsed = parseTimetable(sheetOf(lines, { lineGap: 34 }), { year: 2026, month: 11 });
    expect(parsed.jumuah).toHaveLength(1);
    expect(parsed.jumuah[0]?.iqamahAt).toBe("13:15");
  });
});

describe("L21 — Isha after midnight", () => {
  const summer = (isha: { adhan: string; iqamah: string }): DayTimes => ({
    fajr: { adhan: "03:05", iqamah: "03:45" },
    dhuhr: { adhan: "13:15", iqamah: "13:45" },
    asr: { adhan: "17:30", iqamah: "18:00" },
    maghrib: { adhan: "21:25", iqamah: "21:30" },
    isha,
  });

  it("reads 23:50 / 00:15 (24h) in order without window flags", () => {
    const parsed = parseTimetable(
      sheetOf(board(summer({ adhan: "23:50", iqamah: "00:15" }), "24")),
      { referenceDate: NOV },
    );
    const iqamah = parsed.rows[0]?.cells.find((c) => c.prayer === "isha" && c.kind === "iqamah");
    expect(iqamah?.value).toBe("00:15");
    expect(iqamah?.flags).not.toContain("orderConflict");
    expect(iqamah?.flags).not.toContain("iqamahWindow");
  });

  it("matches a 12-hour 12:20 Isha against a calculated 00:20", () => {
    const parsed = parseTimetable(
      sheetOf(board(summer({ adhan: "00:20", iqamah: "00:40" }), "12")),
      {
        referenceDate: NOV,
        calculated: () => ({
          fajr: "03:05",
          dhuhr: "13:15",
          asr: "17:30",
          maghrib: "21:25",
          isha: "00:20",
        }),
      },
    );
    const adhan = parsed.rows[0]?.cells.find((c) => c.prayer === "isha" && c.kind === "adhan");
    expect(adhan?.value).toBe("00:20");
    expect(adhan?.flags).toEqual([]);
  });
});

describe("L22 — Arabic separators", () => {
  it.each([
    ["5،30", { hour: 5, minute: 30, meridiem: null }],
    ["٥،٣٠", { hour: 5, minute: 30, meridiem: null }],
    ["٥٬٣٠", { hour: 5, minute: 30, meridiem: null }],
    ["٥٫٣٠", { hour: 5, minute: 30, meridiem: null }],
    ["5:30،", { hour: 5, minute: 30, meridiem: null }],
  ])("parses %s", (text, want) => {
    expect(parseClockText(text)).toEqual(want);
  });
});
