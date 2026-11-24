import type { OcrResult, ParseTimetableOptions, TimetableLayout, TimetablePrayer } from "../types";
import {
  addMinutes,
  type DayTimes,
  fmt,
  type Line,
  monthTimes,
  type SheetOptions,
  type Style,
  sheet,
  toArabicDigits,
} from "./fixture-builder";

/**
 * ≥ 30 NF-3.12 fixtures: synthetic layouts modelled on real masjid sheets
 * (daily boards, daily strips, monthly grids), anonymised — no masjid names.
 */

export interface TimetableFixture {
  name: string;
  ocr: OcrResult;
  options?: ParseTimetableOptions;
  expected: {
    layout: TimetableLayout;
    rows: Array<{ day: number | null; times: DayTimes }>;
    jumuah?: string[];
  };
}

export const WINTER: DayTimes = {
  fajr: { adhan: "06:05", iqamah: "06:30" },
  sunrise: { adhan: "07:35" },
  dhuhr: { adhan: "12:10", iqamah: "12:45" },
  asr: { adhan: "14:05", iqamah: "14:30" },
  maghrib: { adhan: "16:20", iqamah: "16:25" },
  isha: { adhan: "17:50", iqamah: "19:00" },
};

export const SUMMER: DayTimes = {
  fajr: { adhan: "03:05", iqamah: "03:45" },
  sunrise: { adhan: "04:50" },
  dhuhr: { adhan: "13:15", iqamah: "13:45" },
  asr: { adhan: "17:30", iqamah: "18:00" },
  maghrib: { adhan: "21:25", iqamah: "21:30" },
  isha: { adhan: "22:50", iqamah: "23:15" },
};

const PRAYERS: TimetablePrayer[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
const EN_LABEL: Record<TimetablePrayer, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};
const AR_LABEL: Record<TimetablePrayer, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};
const UR_LABEL: Record<TimetablePrayer, string> = {
  fajr: "فجر",
  sunrise: "طلوع",
  dhuhr: "ظہر",
  asr: "عصر",
  maghrib: "مغرب",
  isha: "عشاء",
};

const CHAR_W = 14;
const centred = (cx: number, text: string): [number, string] => [
  cx - (text.length * CHAR_W) / 2,
  text,
];

function iqamahOnly(times: DayTimes): DayTimes {
  const out: DayTimes = {};
  for (const p of PRAYERS) {
    if (p === "sunrise") continue;
    const iq = times[p]?.iqamah;
    if (iq) out[p] = { iqamah: iq };
  }
  return out;
}

/** Daily board: one prayer per line — label, begins, iqamah. */
function board(
  times: DayTimes,
  style: Style,
  o: {
    labels?: Record<TimetablePrayer, string>;
    header?: Line | null;
    rtl?: boolean;
    include?: TimetablePrayer[];
    onlyIqamah?: boolean;
    reverseColumns?: boolean;
    extra?: Line[];
  } = {},
): Line[] {
  const labels = o.labels ?? EN_LABEL;
  const lines: Line[] = [];
  if (o.header !== null) {
    lines.push(
      o.header ??
        (o.onlyIqamah
          ? [centred(480, "Jamaat")]
          : o.reverseColumns
            ? [centred(330, "Jamaat"), centred(480, "Begins")]
            : [centred(330, "Begins"), centred(480, "Jamaat")]),
    );
  }
  for (const p of o.include ?? PRAYERS) {
    const t = times[p];
    if (!t) continue;
    const line: Line = [];
    const labelX = o.rtl ? 700 : 60;
    line.push([labelX, labels[p]]);
    const adhanX = o.reverseColumns ? 480 : 330;
    const iqamahX = o.reverseColumns ? 330 : 480;
    if (t.adhan && !o.onlyIqamah) line.push(centred(o.rtl ? 480 : adhanX, fmt(t.adhan, style)));
    if (t.iqamah) line.push(centred(o.rtl ? 330 : iqamahX, fmt(t.iqamah, style)));
    lines.push(line);
  }
  return [...lines, ...(o.extra ?? [])];
}

/** Daily strip: prayers across, "Begins" and "Jamaat" rows. */
function strip(
  times: DayTimes,
  style: Style,
  o: { oneRow?: "iqamah"; jumuah?: string } = {},
): Line[] {
  const header: Line = [];
  PRAYERS.forEach((p, i) => {
    header.push(centred(260 + i * 160, EN_LABEL[p]));
  });
  if (o.jumuah) header.push(centred(260 + 6 * 160, "Jumu'ah"));
  const begins: Line = [[40, "Begins"]];
  const jamaat: Line = [[40, "Jamaat"]];
  PRAYERS.forEach((p, i) => {
    const t = times[p];
    if (t?.adhan) begins.push(centred(260 + i * 160, fmt(t.adhan, style)));
    if (t?.iqamah) jamaat.push(centred(260 + i * 160, fmt(t.iqamah, style)));
  });
  if (o.jumuah) jamaat.push(centred(260 + 6 * 160, fmt(o.jumuah, style)));
  if (o.oneRow) {
    const row: Line = [[40, "Iqamah"]];
    PRAYERS.forEach((p, i) => {
      const t = times[p];
      const v = p === "sunrise" ? t?.adhan : t?.iqamah;
      if (v) row.push(centred(260 + i * 160, fmt(v, style)));
    });
    return [header, row];
  }
  return [header, begins, jamaat];
}

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

/** Monthly grid: Date | Day | Fajr B/J | Sunrise | Dhuhr B/J | Asr B/J | Maghrib B/J | Isha B/J. */
function grid(
  days: DayTimes[],
  style: Style,
  o: {
    title?: string;
    labels?: Record<TimetablePrayer, string>;
    qualifiers?: [string, string];
    iqamahOnly?: boolean;
    hijri?: number;
    rtl?: boolean;
    arabicDays?: boolean;
    firstDay?: number;
    /** Ramadan sheets: Sehri / Iftar columns after Isha (must be ignored). */
    ramadan?: boolean;
  } = {},
): Line[] {
  const labels = o.labels ?? EN_LABEL;
  const cols: Array<{ prayer: TimetablePrayer; kind: "adhan" | "iqamah" }> = [];
  for (const p of PRAYERS) {
    if (p === "sunrise") {
      if (!o.iqamahOnly) cols.push({ prayer: p, kind: "adhan" });
      continue;
    }
    if (!o.iqamahOnly) cols.push({ prayer: p, kind: "adhan" });
    cols.push({ prayer: p, kind: "iqamah" });
  }
  const pitch = 100;
  const start = o.hijri != null ? 300 : 230;
  const x = (i: number) => (o.rtl ? start + (cols.length - 1 - i) * pitch : start + i * pitch);
  const lines: Line[] = [];
  if (o.title) lines.push([[400, o.title]]);
  const head1: Line = [
    [30, o.rtl ? "التاريخ" : "Date"],
    [100, o.rtl ? "اليوم" : "Day"],
  ];
  if (o.hijri != null) head1.push([180, "Hijri"]);
  const head2: Line = [];
  for (const p of PRAYERS) {
    const idx = cols.map((c, i) => ({ c, i })).filter(({ c }) => c.prayer === p);
    if (idx.length === 0) continue;
    const cx = idx.reduce((s, { i }) => s + x(i) + 35, 0) / idx.length;
    head1.push(centred(cx, labels[p]));
    if (!o.iqamahOnly && p !== "sunrise") {
      const [b, j] = o.qualifiers ?? ["Begins", "Jamaat"];
      for (const { c, i } of idx) head2.push(centred(x(i) + 35, c.kind === "adhan" ? b : j));
    }
  }
  const extraX = x(cols.length - 1) + 35 + pitch;
  if (o.ramadan) head1.push(centred(extraX, "Sehri"), centred(extraX + pitch, "Iftar"));
  lines.push(head1);
  if (head2.length) lines.push(head2);
  days.forEach((t, d) => {
    const dayNo = (o.firstDay ?? 1) + d;
    const line: Line = [
      [30, o.arabicDays ? toArabicDigits(String(dayNo)) : String(dayNo)],
      [100, WEEKDAYS[d % 7] ?? ""],
    ];
    if (o.hijri != null) line.push([180, String(((o.hijri + d - 1) % 30) + 1)]);
    cols.forEach((c, i) => {
      const v = t[c.prayer]?.[c.kind];
      if (v) line.push(centred(x(i) + 35, fmt(v, style)));
    });
    if (o.ramadan) {
      const fajr = t.fajr?.adhan;
      const maghrib = t.maghrib?.adhan;
      if (fajr) line.push(centred(extraX, fmt(addMinutes(fajr, -10), style)));
      if (maghrib) line.push(centred(extraX + pitch, fmt(maghrib, style)));
    }
    lines.push(line);
  });
  return lines;
}

const NOV = { year: 2026, month: 11, day: 24 };

function daily(times: DayTimes): Array<{ day: number | null; times: DayTimes }> {
  return [{ day: null, times }];
}

function monthly(days: DayTimes[], firstDay = 1): Array<{ day: number; times: DayTimes }> {
  return days.map((times, i) => ({ day: firstDay + i, times }));
}

const NOV_DAYS = monthTimes(30, WINTER, {
  fajr: 0.9,
  sunrise: 1.1,
  dhuhr: 0.3,
  asr: -0.4,
  maghrib: -0.8,
  isha: -0.7,
});
const JUNE_DAYS = monthTimes(30, SUMMER, {
  fajr: -0.5,
  sunrise: -0.2,
  dhuhr: 0.1,
  asr: 0.2,
  maghrib: 0.3,
  isha: 0.4,
});
const FEB_DAYS = monthTimes(28, WINTER, {
  fajr: -1.5,
  sunrise: -2,
  dhuhr: 0,
  asr: 0.9,
  maghrib: 1.8,
  isha: 1.6,
});
const IQAMAH_NOV = NOV_DAYS.map(iqamahOnly);

/** Calculated times 2 minutes off the printed adhan — what prayer-times.ts would give. */
function calcFrom(days: DayTimes[], year: number, month: number, offset = 2) {
  return (dateKey: string) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    if (y !== year || m !== month) return null;
    const t = days[(d ?? 1) - 1];
    if (!t) return null;
    const out: Partial<Record<TimetablePrayer, string>> = {};
    for (const p of PRAYERS) {
      const a = t[p]?.adhan;
      if (!a) continue;
      const [hh = 0, mm = 0] = a.split(":").map(Number);
      const total = hh * 60 + mm + offset;
      out[p] =
        `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    }
    return out;
  };
}

function sheetOf(lines: Line[], o: SheetOptions = {}) {
  return sheet(lines, { charW: CHAR_W, ...o });
}

export const FIXTURES: TimetableFixture[] = [
  // ── Daily boards (one prayer per line) ────────────────────────────────────
  {
    name: "board: 12h, Begins/Jamaat header",
    ocr: sheetOf(board(WINTER, "12")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: 24h",
    ocr: sheetOf(board(SUMMER, "24")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(SUMMER) },
  },
  {
    name: "board: 12h summer (Isha 11:15 PM, Fajr 3:05 AM) without AM/PM",
    ocr: sheetOf(board(SUMMER, "12")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(SUMMER) },
  },
  {
    name: "board: AM/PM as separate tokens",
    ocr: sheetOf(board(WINTER, "ampmSpace")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: am/pm glued (5:12pm)",
    ocr: sheetOf(board(SUMMER, "ampm")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(SUMMER) },
  },
  {
    name: "board: Arabic labels + Eastern Arabic digits, right-to-left",
    ocr: sheetOf(
      board(WINTER, "arabic", {
        labels: AR_LABEL,
        rtl: true,
        header: [centred(480, "الأذان"), centred(330, "الإقامة")],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: Urdu labels + Urdu digits",
    ocr: sheetOf(
      board(WINTER, "urdu", {
        labels: UR_LABEL,
        rtl: true,
        header: [centred(480, "اذان"), centred(330, "جماعت")],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: Arabic decimal separator ٫",
    ocr: sheetOf(board(WINTER, "arabicSep", { labels: AR_LABEL, rtl: true, header: null })),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: Jamaat only + Jumu'ah footnote",
    ocr: sheetOf(
      board(WINTER, "12", {
        onlyIqamah: true,
        include: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
        extra: [[[60, "Jumu'ah 1:15 & 2:00"]]],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(iqamahOnly(WINTER)), jumuah: ["13:15", "14:00"] },
  },
  {
    name: "board: no header, single (iqamah) time per prayer",
    ocr: sheetOf(
      board(iqamahOnly(WINTER), "12", {
        header: null,
        include: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(iqamahOnly(WINTER)) },
  },
  {
    name: "board: split tokens 5 : 12",
    ocr: sheetOf(board(WINTER, "12"), { splitTimes: true }),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: dot separators 5.12",
    ocr: sheetOf(board(WINTER, "dot")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: French 06h05",
    ocr: sheetOf(
      board(WINTER, "h", {
        labels: { ...EN_LABEL, fajr: "Sobh", sunrise: "Chorouk", dhuhr: "Dohr", isha: "Icha" },
        header: [centred(330, "Adhan"), centred(480, "Iqama")],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: inline qualifiers (Fajr Adhan 6:05 Iqamah 6:30)",
    ocr: sheetOf(
      PRAYERS.filter((p) => p !== "sunrise").map(
        (p): Line => [
          [60, EN_LABEL[p]],
          [200, "Adhan"],
          [300, fmt(WINTER[p]?.adhan ?? "", "12")],
          [420, "Iqamah"],
          [530, fmt(WINTER[p]?.iqamah ?? "", "12")],
        ],
      ),
    ),
    options: { referenceDate: NOV },
    expected: {
      layout: "daily",
      rows: daily(
        Object.fromEntries(
          PRAYERS.filter((p) => p !== "sunrise").map((p) => [p, WINTER[p]]),
        ) as DayTimes,
      ),
    },
  },
  {
    name: "board: OCR noise (O for 0, l for 1, stray bars)",
    ocr: sheetOf([
      [centred(330, "Begins"), centred(480, "Jamaat"), [700, "|"]],
      [[60, "Fajr"], centred(330, "6:O5"), centred(480, "6:30")],
      [[60, "Sunrise"], centred(330, "7:35")],
      [[60, "Zuhr"], centred(330, "l2:10"), centred(480, "l2:45"), [700, "—"]],
      [[60, "Asr"], centred(330, "2:05"), centred(480, "2:30")],
      [[60, "Maghrib"], centred(330, "4:20"), centred(480, "4:25")],
      [[60, "Isha"], centred(330, "5:50"), centred(480, "7:OO")],
      [
        [60, "Tel"],
        [200, "0161"],
        [300, "4960"],
      ],
    ]),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: rotated 4°",
    ocr: sheetOf(board(WINTER, "12"), { rotate: 4 }),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: rotated −6° with jitter",
    ocr: sheetOf(board(SUMMER, "24"), { rotate: -6, jitter: 3, seed: 11 }),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(SUMMER) },
  },
  {
    name: "board: Jamaat column printed before Begins",
    ocr: sheetOf(board(WINTER, "12", { reverseColumns: true })),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: Vision phrases (one token per cell)",
    ocr: sheetOf(board(WINTER, "ampmSpace"), { phrases: true }),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "board: Jumu'ah khutbah + salah line",
    ocr: sheetOf(
      board(WINTER, "12", {
        extra: [
          [
            [60, "Jummah"],
            [200, "Khutbah"],
            [320, "12:45pm"],
            [460, "Salah"],
            [560, "1:15pm"],
          ],
        ],
      }),
    ),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER), jumuah: ["12:45", "13:15"] },
  },
  {
    name: "board: Isha iqamah after midnight (12:05)",
    ocr: sheetOf(board({ ...SUMMER, isha: { adhan: "23:55", iqamah: "00:05" } }, "12")),
    options: { referenceDate: NOV },
    expected: {
      layout: "daily",
      rows: daily({ ...SUMMER, isha: { adhan: "23:55", iqamah: "00:05" } }),
    },
  },

  // ── Daily strips (one prayer per column) ──────────────────────────────────
  {
    name: "strip: Begins / Jamaat rows",
    ocr: sheetOf(strip(WINTER, "12")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "strip: single Iqamah row, 24h",
    ocr: sheetOf(strip(SUMMER, "24", { oneRow: "iqamah" })),
    options: { referenceDate: NOV },
    expected: {
      layout: "daily",
      rows: daily({ ...iqamahOnly(SUMMER), sunrise: SUMMER.sunrise }),
    },
  },
  {
    name: "strip: with Jumu'ah column",
    ocr: sheetOf(strip(WINTER, "12", { jumuah: "13:30" })),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER), jumuah: ["13:30"] },
  },

  // ── Monthly grids ─────────────────────────────────────────────────────────
  {
    name: "grid: November, 12h, Begins/Jamaat sub-header",
    ocr: sheetOf(grid(NOV_DAYS, "12", { title: "November 2026" }), { lineGap: 34 }),
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: June, 24h, summer",
    ocr: sheetOf(grid(JUNE_DAYS, "24", { title: "June 2026" }), { lineGap: 34 }),
    expected: { layout: "monthly", rows: monthly(JUNE_DAYS) },
  },
  {
    name: "grid: June, 12h without AM/PM (Isha 10:50 PM)",
    ocr: sheetOf(grid(JUNE_DAYS, "12"), { lineGap: 34 }),
    options: { year: 2026, month: 6 },
    expected: { layout: "monthly", rows: monthly(JUNE_DAYS) },
  },
  {
    name: "grid: iqamah-only columns",
    ocr: sheetOf(
      grid(IQAMAH_NOV, "12", { iqamahOnly: true, title: "Iqamah times November 2026" }),
      {
        lineGap: 34,
      },
    ),
    expected: { layout: "monthly", rows: monthly(IQAMAH_NOV) },
  },
  {
    name: "grid: Hijri date column next to the Gregorian day",
    ocr: sheetOf(grid(NOV_DAYS, "12", { hijri: 3 }), { lineGap: 34 }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: Arabic headers, Eastern digits, right-to-left",
    ocr: sheetOf(
      grid(NOV_DAYS, "arabic", {
        labels: AR_LABEL,
        qualifiers: ["أذان", "إقامة"],
        rtl: true,
        arabicDays: true,
      }),
      { lineGap: 34 },
    ),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: Urdu digits",
    ocr: sheetOf(grid(NOV_DAYS, "urdu", { labels: UR_LABEL, qualifiers: ["اذان", "جماعت"] }), {
      lineGap: 34,
    }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: February (28 days)",
    ocr: sheetOf(grid(FEB_DAYS, "12", { title: "February 2027" }), { lineGap: 34 }),
    expected: { layout: "monthly", rows: monthly(FEB_DAYS) },
  },
  {
    name: "grid: rotated 2.5°",
    ocr: sheetOf(grid(NOV_DAYS, "12"), { lineGap: 34, rotate: 2.5 }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: split tokens on every 7th time",
    ocr: sheetOf(grid(NOV_DAYS, "12"), {
      lineGap: 34,
      splitTimes: (_t, i) => i % 7 === 0,
    }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: partial crop (days 10–24), dot separators",
    ocr: sheetOf(grid(NOV_DAYS.slice(9, 24), "dot", { firstDay: 10 }), { lineGap: 34 }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS.slice(9, 24), 10) },
  },
  {
    name: "grid: low-confidence tokens and dropped cells (needs review)",
    ocr: sheetOf(grid(NOV_DAYS, "12"), {
      lineGap: 34,
      conf: (_t, i) => (i % 13 === 0 ? 0.55 : 0.93),
      drop: (_t, i) => i % 97 === 50,
    }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: Ramadan sheet with Sehri / Iftar columns",
    ocr: sheetOf(grid(NOV_DAYS, "12", { ramadan: true }), { lineGap: 34 }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
  {
    name: "grid: AM/PM as separate tokens, Vision phrases",
    ocr: sheetOf(grid(NOV_DAYS.slice(0, 10), "ampmSpace"), {
      lineGap: 34,
      phrases: true,
      charW: 10,
    }),
    options: { year: 2026, month: 11 },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS.slice(0, 10)) },
  },
  {
    name: "strip: sub-headers (prayer over Begins / Jamaat), one data row",
    ocr: sheetOf(grid([WINTER], "12")),
    options: { referenceDate: NOV },
    expected: { layout: "daily", rows: daily(WINTER) },
  },
  {
    name: "grid: with calculated times (plausibility on)",
    ocr: sheetOf(grid(NOV_DAYS, "12"), { lineGap: 34 }),
    options: { year: 2026, month: 11, calculated: calcFrom(NOV_DAYS, 2026, 11) },
    expected: { layout: "monthly", rows: monthly(NOV_DAYS) },
  },
];

/** Not a timetable at all. */
export const NOT_A_TIMETABLE: OcrResult = sheetOf([
  [
    [40, "Weekly"],
    [180, "programme"],
  ],
  [
    [40, "Quran"],
    [160, "class"],
    [300, "after"],
    [400, "Maghrib"],
  ],
  [
    [40, "Sisters"],
    [200, "circle"],
    [340, "Saturday"],
  ],
]);

export { board, calcFrom, grid, iqamahOnly, NOV, NOV_DAYS, sheetOf, strip };
