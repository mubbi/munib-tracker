import { describe, expect, it } from "vitest";

import {
  classifyLabel,
  normaliseDigits,
  type ParsedTimetable,
  parseClockText,
  parseTimetable,
  type TimetableKind,
  type TimetablePrayer,
  timetableReviewStats,
  timetableToPrivateTimes,
} from "../index";
import { fmt } from "./fixture-builder";
import {
  board,
  calcFrom,
  FIXTURES,
  grid,
  NOT_A_TIMETABLE,
  NOV,
  NOV_DAYS,
  sheetOf,
  type TimetableFixture,
  WINTER,
} from "./fixtures";

function cellValue(
  parsed: ParsedTimetable,
  day: number | null,
  prayer: TimetablePrayer,
  kind: TimetableKind,
): string | null | undefined {
  const row = parsed.rows.find((r) => r.day === day);
  return row?.cells.find((c) => c.prayer === prayer && c.kind === kind)?.value;
}

function score(fixture: TimetableFixture, parsed: ParsedTimetable) {
  let total = 0;
  let correct = 0;
  const misses: string[] = [];
  for (const row of fixture.expected.rows) {
    for (const [prayer, times] of Object.entries(row.times) as Array<
      [TimetablePrayer, { adhan?: string; iqamah?: string }]
    >) {
      for (const kind of ["adhan", "iqamah"] as const) {
        const want = times[kind];
        if (!want) continue;
        total += 1;
        const got = cellValue(parsed, row.day, prayer, kind);
        if (got === want) correct += 1;
        else misses.push(`${row.day ?? "daily"} ${prayer}.${kind}: want ${want}, got ${got}`);
      }
    }
  }
  return { total, correct, misses };
}

const results = FIXTURES.map((fixture) => {
  const parsed = parseTimetable(fixture.ocr, fixture.options);
  return { fixture, parsed, ...score(fixture, parsed) };
});

describe("timetable parser — normalisation (step 1)", () => {
  it("maps Eastern Arabic and Persian digits to ASCII", () => {
    expect(normaliseDigits("٠١٢٣٤٥٦٧٨٩ ۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789 0123456789");
  });

  it.each([
    ["5:12", { hour: 5, minute: 12, meridiem: null }],
    ["05.12", { hour: 5, minute: 12, meridiem: null }],
    ["05h12", { hour: 5, minute: 12, meridiem: null }],
    ["٥٫١٢", { hour: 5, minute: 12, meridiem: null }],
    ["۵:۱۲", { hour: 5, minute: 12, meridiem: null }],
    ["5:12pm", { hour: 5, minute: 12, meridiem: "pm" }],
    ["5:12 a.m.", { hour: 5, minute: 12, meridiem: "am" }],
    ["٥:١٢ م", { hour: 5, minute: 12, meridiem: "pm" }],
    ["٥:١٢ص", { hour: 5, minute: 12, meridiem: "am" }],
    ["6:O5", { hour: 6, minute: 5, meridiem: null }],
    ["l2:30", { hour: 12, minute: 30, meridiem: null }],
    ["(13:45)", { hour: 13, minute: 45, meridiem: null }],
  ])("parses %s", (text, want) => {
    expect(parseClockText(text)).toEqual(want);
  });

  it.each(["12", "1st", "25:10", "5:7", "2026", "Fajr", "12.5", "01.11.2026"])(
    "rejects %s",
    (text) => {
      expect(parseClockText(text)).toBeNull();
    },
  );
});

describe("timetable parser — header synonyms (step 4)", () => {
  it.each([
    ["Fajr", "fajr"],
    ["FAJAR", "fajr"],
    ["Subh", "fajr"],
    ["الفجر", "fajr"],
    ["Shurooq", "sunrise"],
    ["Zohar", "dhuhr"],
    ["ظہر", "dhuhr"],
    ["Asar", "asr"],
    ["Maghreb", "maghrib"],
    ["العشاء", "isha"],
    ["Jumu'ah", "jumuah"],
    ["جمعہ", "jumuah"],
  ])("%s → %s", (text, prayer) => {
    expect(classifyLabel(text)).toMatchObject({ type: "prayer", prayer });
  });

  it.each([
    ["Begins", "adhan"],
    ["الأذان", "adhan"],
    ["Jama'at", "iqamah"],
    ["الإقامة", "iqamah"],
    ["جماعت", "iqamah"],
    ["Khutbah", "khutbah"],
  ])("qualifier %s → %s", (text, kind) => {
    expect(classifyLabel(text)).toMatchObject({ type: "qualifier", kind });
  });

  it("reads a prayer glued to its qualifier and ignores date / sehri columns", () => {
    expect(classifyLabel("Fajr-Jamaat")).toEqual({
      type: "prayer",
      prayer: "fajr",
      kind: "iqamah",
    });
    expect(classifyLabel("Sehri")).toEqual({ type: "other" });
    expect(classifyLabel("Date")).toEqual({ type: "other" });
    expect(classifyLabel("Weekly")).toBeNull();
  });
});

describe("timetable parser — fixtures", () => {
  it("has at least 30 fixture dumps", () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(30);
  });

  it.each(results.map((r) => [r.fixture.name, r] as const))("%s", (_name, r) => {
    expect(r.parsed.layout).toBe(r.fixture.expected.layout);
    // Every clean fixture parses perfectly; noisy ones may leave a few cells for review.
    const allowed = r.fixture.name.includes("dropped") ? 0.95 : 1;
    expect({ accuracy: r.correct / r.total, misses: r.misses.slice(0, 5) }).toMatchObject({
      accuracy: expect.any(Number),
    });
    expect(r.correct / r.total).toBeGreaterThanOrEqual(allowed);
    if (r.fixture.expected.jumuah) {
      const slots = r.parsed.jumuah.flatMap((s) =>
        [s.khutbahAt, s.iqamahAt].filter((v): v is string => !!v),
      );
      expect(slots).toEqual(r.fixture.expected.jumuah);
    }
  });

  it("meets the ≥ 95% cell accuracy target before review across all fixtures", () => {
    const total = results.reduce((s, r) => s + r.total, 0);
    const correct = results.reduce((s, r) => s + r.correct, 0);
    expect(total).toBeGreaterThan(2000);
    expect(correct / total).toBeGreaterThanOrEqual(0.95);
  });

  it("returns no layout for text that is not a timetable", () => {
    expect(parseTimetable(NOT_A_TIMETABLE).layout).toBe("none");
    expect(parseTimetable({ tokens: [], width: 0, height: 0 }).layout).toBe("none");
  });
});

describe("timetable parser — layout details", () => {
  it("detects the monthly orientation, month hint and day numbers", () => {
    const r = results.find((x) => x.fixture.name.startsWith("grid: November"));
    expect(r?.parsed.orientation).toBe("columns");
    expect(r?.parsed.monthHint).toEqual({ month: 11, year: 2026 });
    expect(r?.parsed.rows.map((row) => row.day)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1),
    );
  });

  it("detects the skew of a rotated photo", () => {
    const r = results.find((x) => x.fixture.name === "board: rotated 4°");
    expect(Math.abs(Math.abs(r?.parsed.skewDegrees ?? 0) - 4)).toBeLessThanOrEqual(0.5);
  });

  it("assumes iqamah for a single unlabelled time and flags it for review", () => {
    const r = results.find((x) => x.fixture.name.startsWith("board: no header"));
    const fajr = r?.parsed.rows[0]?.cells.find((c) => c.prayer === "fajr");
    expect(fajr).toMatchObject({ kind: "iqamah", value: "06:30", needsReview: true });
    expect(fajr?.flags).toContain("kindAssumed");
  });

  it("re-reads an unlabelled column that tracks the calculated adhan as the adhan", () => {
    const begins = sheetOf(
      board(
        Object.fromEntries(
          (["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((p) => [
            p,
            { iqamah: WINTER[p]?.adhan },
          ]),
        ),
        "12",
        { header: null, include: ["fajr", "dhuhr", "asr", "maghrib", "isha"] },
      ),
    );
    const parsed = parseTimetable(begins, {
      referenceDate: NOV,
      calculated: () => ({
        fajr: "06:06",
        dhuhr: "12:11",
        asr: "14:04",
        maghrib: "16:20",
        isha: "17:51",
      }),
    });
    expect(parsed.rows[0]?.cells.find((c) => c.prayer === "fajr")?.kind).toBe("adhan");
  });

  it("flags low-confidence cells and missing cells for review", () => {
    const r = results.find((x) => x.fixture.name.includes("low-confidence"));
    const stats = timetableReviewStats(r?.parsed as ParsedTimetable);
    expect(stats.needsReview).toBeGreaterThan(0);
    const flagged = r?.parsed.rows.flatMap((row) => row.cells.filter((c) => c.needsReview)) ?? [];
    expect(flagged.some((c) => c.flags.includes("lowConfidence"))).toBe(true);
  });

  it("flags an adhan far from the calculated time and an iqamah outside its window", () => {
    const shifted = {
      ...WINTER,
      dhuhr: { adhan: "12:50", iqamah: "13:05" },
      asr: { adhan: "14:05", iqamah: "16:00" },
    };
    const parsed = parseTimetable(sheetOf(board(shifted, "24")), {
      referenceDate: NOV,
      calculated: () => ({
        fajr: "06:05",
        sunrise: "07:35",
        dhuhr: "12:10",
        asr: "14:05",
        maghrib: "16:20",
        isha: "17:50",
      }),
    });
    const cells = parsed.rows[0]?.cells ?? [];
    expect(cells.find((c) => c.prayer === "dhuhr" && c.kind === "adhan")?.flags).toContain(
      "farFromCalculated",
    );
    expect(cells.find((c) => c.prayer === "asr" && c.kind === "iqamah")?.flags).toContain(
      "iqamahWindow",
    );
    expect(cells.find((c) => c.prayer === "maghrib" && c.kind === "adhan")?.needsReview).toBe(
      false,
    );
  });

  it("flags cells when no AM/PM assignment keeps the prayers in order", () => {
    const parsed = parseTimetable(
      sheetOf([
        [
          [60, "Fajr"],
          [300, "6:30 AM"],
        ],
        [
          [60, "Dhuhr"],
          [300, "5:45 AM"],
        ],
        [
          [60, "Asr"],
          [300, "2:30"],
        ],
      ]),
      { referenceDate: NOV },
    );
    const cells = parsed.rows[0]?.cells ?? [];
    expect(cells.find((c) => c.prayer === "dhuhr")?.flags).toContain("orderConflict");
    expect(cells.find((c) => c.prayer === "asr")?.flags).not.toContain("orderConflict");
  });

  it("uses the requested month for a grid without a printed month", () => {
    const parsed = parseTimetable(sheetOf(grid(NOV_DAYS.slice(0, 28), "12"), { lineGap: 34 }), {
      year: 2027,
      month: 2,
      calculated: calcFrom(NOV_DAYS, 2027, 2),
    });
    expect(parsed.layout).toBe("monthly");
    expect(parsed.rows).toHaveLength(28);
  });
});

describe("timetableToPrivateTimes", () => {
  it("keeps only iqamah times (daily) and Jumu'ah slots", () => {
    const r = results.find((x) => x.fixture.name.startsWith("board: Jumu'ah khutbah"));
    expect(
      timetableToPrivateTimes(r?.parsed as ParsedTimetable, { year: 2026, month: 11 }),
    ).toEqual({
      daily: { fajr: "06:30", dhuhr: "12:45", asr: "14:30", maghrib: "16:25", isha: "19:00" },
      jumuah: [{ khutbahAt: "12:45", iqamahAt: "13:15" }],
    });
  });

  it("dates monthly rows with the chosen month", () => {
    const r = results.find((x) => x.fixture.name.startsWith("grid: November"));
    const out = timetableToPrivateTimes(r?.parsed as ParsedTimetable, { year: 2026, month: 11 });
    expect(Object.keys(out.monthly ?? {})).toHaveLength(30);
    expect(out.monthly?.["2026-11-01"]).toEqual({
      fajr: "06:30",
      dhuhr: "12:45",
      asr: "14:30",
      maghrib: "16:25",
      isha: "19:00",
    });
    expect(out.daily).toBeUndefined();
  });

  it("formats fixtures exactly as the builder prints them", () => {
    expect(fmt("17:05", "12")).toBe("5:05");
    expect(fmt("05:05", "arabic")).toBe("٥:٠٥");
  });
});
