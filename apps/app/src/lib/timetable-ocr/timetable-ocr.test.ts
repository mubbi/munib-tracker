import type { OcrResult, ParsedTimetable } from "@munib-tracker/shared/timetable-parser";
import { parseTimetable } from "@munib-tracker/shared/timetable-parser";

import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";
import type { PlatformOverrides } from "@/test-support/platform";

import { calculatedTimesFor } from "./index";
import {
  draftFromParsed,
  draftToImported,
  normaliseTypedTime,
  overrideKey,
  type ReviewDraft,
  reviewCounts,
  rowsForReview,
  typedTimeReinterpreted,
} from "./review";

type Recognize = typeof import("./recognize");

let restore: () => void = () => {};
afterEach(() => restore());

function load(module: object | null, platform: PlatformOverrides): Recognize {
  const loaded = loadOnPlatformWithNativeModules(
    platform,
    module ? { MunibTextRecognition: module } : {},
    () => require("./recognize"),
  );
  restore = loaded.restore;
  return loaded.module as Recognize;
}

/** A tiny daily board as OCR word tokens. */
function board(rows: Array<[string, string, string?]>, conf = 0.95): OcrResult {
  const tokens: OcrResult["tokens"] = [
    { text: "Begins", conf, box: { x: 300, y: 40, w: 84, h: 28 } },
    { text: "Jamaat", conf, box: { x: 450, y: 40, w: 84, h: 28 } },
  ];
  rows.forEach(([label, adhan, iqamah], i) => {
    const y = 90 + i * 44;
    tokens.push({ text: label, conf, box: { x: 60, y, w: label.length * 14, h: 28 } });
    tokens.push({ text: adhan, conf, box: { x: 310, y, w: adhan.length * 14, h: 28 } });
    if (iqamah)
      tokens.push({ text: iqamah, conf, box: { x: 460, y, w: iqamah.length * 14, h: 28 } });
  });
  return { tokens, width: 800, height: 400 };
}

const WINTER: Array<[string, string, string?]> = [
  ["Fajr", "6:05", "6:30"],
  ["Sunrise", "7:35"],
  ["Zuhr", "12:10", "12:45"],
  ["Asr", "2:05", "2:30"],
  ["Maghrib", "4:20", "4:25"],
  ["Isha", "5:50", "7:00"],
];

describe("on-device recognition availability (D3)", () => {
  it.each([
    ["web via this file", { OS: "web" as const }],
    ["Android TV", { OS: "android" as const, isTV: true }],
  ])("is unavailable natively on %s", (_label, platform) => {
    const recognize = load({ isSupported: () => true, recognize: jest.fn() }, platform);
    expect(recognize.ocrAvailability()).toBe("unavailable");
  });

  it("is unavailable when the native module is missing (Expo Go / old build)", async () => {
    const recognize = load(null, { OS: "ios" });
    expect(recognize.ocrAvailability()).toBe("unavailable");
    await expect(recognize.recognizeImage("file:///x.jpg")).rejects.toThrow();
  });

  it("uses the native module on iOS / Android and normalises its output", async () => {
    const native = {
      isSupported: () => true,
      recognize: jest.fn(async () => ({
        tokens: [{ text: "5:12", conf: 0.9, box: { x: 1, y: 2, w: 3, h: 4 } }],
        width: "100",
        height: 50,
      })),
    };
    const recognize = load(native, { OS: "android" });
    expect(recognize.ocrAvailability()).toBe("native");
    expect(recognize.ocrDownloadBytes()).toBe(0);
    await expect(recognize.recognizeImage("file:///photo.jpg")).resolves.toEqual({
      tokens: [{ text: "5:12", conf: 0.9, box: { x: 1, y: 2, w: 3, h: 4 } }],
      width: 100,
      height: 50,
    });
    expect(native.recognize).toHaveBeenCalledWith("file:///photo.jpg");
  });

  it("states the web download size before first use", () => {
    const web = require("./recognize.web") as typeof import("./recognize.web");
    expect(web.ocrDownloadBytes()).toBeGreaterThan(6_000_000);
    expect(web.ocrDownloadBytes({ arabic: true }) - web.ocrDownloadBytes()).toBe(
      web.WEB_OCR_DOWNLOAD.ara,
    );
  });
});

describe("calculatedTimesFor", () => {
  it("returns HH:mm calculated times for a date (plausibility input)", () => {
    const calc = calculatedTimesFor({
      latitude: 51.5,
      longitude: -0.12,
      label: "London",
      method: "MuslimWorldLeague",
      madhab: "shafi",
      source: "manual",
      updatedAt: null,
      timeZone: "Europe/London",
    } as never);
    const times = calc?.("2026-11-24");
    expect(times?.fajr).toMatch(/^0[5-6]:\d{2}$/);
    expect(times?.maghrib).toMatch(/^1[56]:\d{2}$/);
    expect(calculatedTimesFor(null)).toBeUndefined();
  });
});

describe("review grid model", () => {
  const parsed = parseTimetable(board(WINTER), {
    referenceDate: { year: 2026, month: 11, day: 24 },
  }) as ParsedTimetable;

  it("normalises typed times", () => {
    expect(normaliseTypedTime("5:30")).toBe("05:30");
    expect(normaliseTypedTime("1730")).toBe("17:30");
    expect(normaliseTypedTime("١٧:٣٠")).toBe("17:30");
    expect(normaliseTypedTime("")).toBe("");
    expect(normaliseTypedTime("25:00")).toBeNull();
    expect(normaliseTypedTime("abc")).toBeNull();
  });

  it("builds an iqamah-only draft and saves only iqamah times", () => {
    const draft = draftFromParsed(parsed);
    expect(draft?.layout).toBe("daily");
    expect(draft?.rows[0]?.cells.dhuhr.text).toBe("12:45");
    expect(draftToImported(draft as never, { year: 2026, month: 11 })).toEqual({
      daily: { fajr: "06:30", dhuhr: "12:45", asr: "14:30", maghrib: "16:25", isha: "19:00" },
    });
  });

  it("keeps user edits across a re-parse and blocks saving invalid text", () => {
    const draft = draftFromParsed(parsed, {
      [overrideKey(null, "isha")]: "19:15",
      [overrideKey(null, "fajr")]: "6:7",
    });
    expect(draft?.rows[0]?.cells.isha).toMatchObject({ text: "19:15", edited: true });
    expect(reviewCounts(draft as never).invalid).toBe(1);
  });

  it("lists rows with cells to check first", () => {
    const low = parseTimetable(board(WINTER, 0.5), {
      referenceDate: { year: 2026, month: 11, day: 24 },
    });
    const draft = draftFromParsed(low);
    const { flagged, rest } = rowsForReview(draft as never);
    expect(flagged).toHaveLength(1);
    expect(rest).toHaveLength(0);
    expect(reviewCounts(draft as never).toCheck).toBe(5);
  });

  it("returns null when the photo held no timetable", () => {
    expect(draftFromParsed(parseTimetable({ tokens: [], width: 0, height: 0 }))).toBeNull();
  });
});

describe("typed times are read per Salah like the parser (M7)", () => {
  it.each([
    ["8:15", "isha", "20:15"],
    ["08:15", "isha", "20:15"],
    ["12:10", "isha", "00:10"],
    ["1:05", "isha", "01:05"],
    ["٨:١٥", "isha", "20:15"],
    ["8،15", "isha", "20:15"],
    ["8:15 am", "isha", "08:15"],
    ["20:15", "isha", "20:15"],
    ["00:20", "isha", "00:20"],
    ["1:30", "dhuhr", "13:30"],
    ["11:45", "dhuhr", "11:45"],
    ["12:30", "dhuhr", "12:30"],
    ["5:30", "fajr", "05:30"],
    ["4:15", "asr", "16:15"],
    ["12:50", "asr", "12:50"],
    ["5:30", "maghrib", "17:30"],
    ["5:30 م", "maghrib", "17:30"],
    ["1:15", "jumuah", "13:15"],
    ["11:30", "jumuah", "11:30"],
  ] as const)("%s for %s → %s", (text, slot, want) => {
    expect(normaliseTypedTime(text, slot)).toBe(want);
  });

  it("keeps 24-hour reading without a slot and rejects impossible AM/PM times", () => {
    expect(normaliseTypedTime("8:15")).toBe("08:15");
    expect(normaliseTypedTime("8:15pm")).toBe("20:15");
    expect(normaliseTypedTime("13:00 pm", "isha")).toBeNull();
    expect(normaliseTypedTime("8:75", "isha")).toBeNull();
  });

  it("tells the grid when a typed time was read as afternoon / evening", () => {
    expect(typedTimeReinterpreted("8:15", "isha")).toBe(true);
    expect(typedTimeReinterpreted("20:15", "isha")).toBe(false);
    expect(typedTimeReinterpreted("8:15 pm", "isha")).toBe(false);
    expect(typedTimeReinterpreted("6:30", "fajr")).toBe(false);
    expect(typedTimeReinterpreted("", "isha")).toBe(false);
  });

  it("saves an edited 12-hour Isha / Dhuhr / Jumu'ah as the evening / afternoon time", () => {
    const parsed = parseTimetable(board(WINTER), {
      referenceDate: { year: 2026, month: 11, day: 24 },
    });
    const draft = draftFromParsed(parsed, {
      [overrideKey(null, "isha")]: "8:15",
      [overrideKey(null, "dhuhr")]: "1:30",
    }) as ReviewDraft;
    draft.jumuah = [{ text: "1:15", kind: "iqamah" }];
    expect(reviewCounts(draft)).toMatchObject({ invalid: 0, blocked: false });
    expect(draftToImported(draft, { year: 2026, month: 11 })).toMatchObject({
      daily: { dhuhr: "13:30", isha: "20:15", fajr: "06:30" },
      jumuah: [{ iqamahAt: "13:15" }],
    });
  });
});

describe("review draft for monthly sheets (M8 / L19)", () => {
  const cell = (prayer: string, value: string | null) => ({
    prayer,
    kind: "iqamah",
    value,
    raw: value ?? "",
    confidence: 1,
    flags: [],
    needsReview: false,
  });
  const cells = (isha: string) => [
    cell("fajr", "06:30"),
    cell("dhuhr", "12:45"),
    cell("asr", "14:30"),
    cell("maghrib", "16:25"),
    cell("isha", isha),
  ];
  const wrapped = {
    layout: "monthly",
    orientation: "columns",
    rows: [
      { day: 28, cells: cells("19:00") },
      { day: 1, monthOffset: 1, cells: cells("19:05") },
    ],
    jumuah: [],
    monthHint: {},
    skewDegrees: 0,
    monthWrap: true,
  } as unknown as ParsedTimetable;

  it("dates rows past a month wrap in the next month and keys their edits apart", () => {
    const draft = draftFromParsed(wrapped, {
      [overrideKey(1, "isha", 1)]: "7:10",
      [overrideKey(1, "isha")]: "9:99",
    }) as ReviewDraft;
    expect(draft.monthWrap).toBe(true);
    expect(draft.rows[1]).toMatchObject({ day: 1, monthOffset: 1 });
    expect(draft.rows[1]?.cells.isha).toMatchObject({ text: "7:10", edited: true });
    expect(reviewCounts(draft).invalid).toBe(0);
    const saved = draftToImported(draft, { year: 2027, month: 2 });
    expect(Object.keys(saved.monthly ?? {})).toEqual(["2027-02-28", "2027-03-01"]);
    expect(saved.monthly?.["2027-03-01"]?.isha).toBe("19:10");
  });

  it("blocks saving until the user says which column is the date", () => {
    const draft = draftFromParsed({
      ...wrapped,
      dateColumnAmbiguous: true,
      dateColumn: 0,
      dateColumns: [
        { id: 0, header: null, first: 1, last: 16 },
        { id: 1, header: null, first: 18, last: 5 },
      ],
    }) as ReviewDraft;
    expect(draft.dateQuestion?.columns).toHaveLength(2);
    expect(reviewCounts(draft).blocked).toBe(true);
    const answered = draftFromParsed({ ...wrapped, dateColumnAmbiguous: false, dateColumn: 1 });
    expect(answered?.dateQuestion).toBeUndefined();
  });

  it("carries the begins-only note so the grid can explain the empty cells", () => {
    const draft = draftFromParsed({
      ...wrapped,
      layout: "daily",
      rows: [{ day: null, cells: [] }],
      beginsOnly: true,
    });
    expect(draft?.beginsOnly).toBe(true);
    expect(draftToImported(draft as ReviewDraft, { year: 2026, month: 11 })).toEqual({});
  });
});
