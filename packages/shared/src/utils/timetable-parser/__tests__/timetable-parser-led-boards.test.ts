import { describe, expect, it } from "vitest";

import {
  normaliseDigits,
  numericText,
  type OcrResult,
  type ParsedTimetable,
  parseLooseClockText,
  parseTimetable,
  type TimetablePrayer,
} from "../index";
import { sheet } from "./fixture-builder";
import englishEnhanced from "./ocr-dumps/led-english-board-enhanced.json";
import urduEng from "./ocr-dumps/led-urdu-board-eng.json";
import urduEngAra from "./ocr-dumps/led-urdu-board-eng-ara.json";
import urduSplit from "./ocr-dumps/led-urdu-board-eng-split.json";
import urduUpscaled from "./ocr-dumps/led-urdu-board-upscaled.json";

/**
 * LED / dot-matrix masjid boards. The `ocr-dumps/` files are real Tesseract.js
 * 7 outputs (web engine) for photos of such boards: dot-matrix labels come out
 * as noise ("wi", "ka", "#2"), and colon dots are dropped or mirrored ("5 20",
 * "500", "5-30", ":5 00"). The parser reads the stack of times by position.
 */

const REFERENCE = { referenceDate: { year: 2026, month: 11, day: 27 } };

function iqamah(parsed: ParsedTimetable, prayer: TimetablePrayer): string | null | undefined {
  return parsed.rows[0]?.cells.find((c) => c.prayer === prayer && c.kind === "iqamah")?.value;
}

/** Board: الفجر 5:00 · الظہر 1:30 · العصر 5:30 · المغرب 5:20 · العشاء 8:15 · الجمعہ 1:30. */
const URDU_BOARD = {
  fajr: "05:00",
  dhuhr: "13:30",
  asr: "17:30",
  maghrib: "17:20",
  isha: "20:15",
} as const;

describe("LED boards — unlabelled stack of times (real Tesseract dumps)", () => {
  it.each([
    ["English model", urduEng],
    ["English + Arabic models", urduEngAra],
    ["split colon tokens", urduSplit],
  ])("reads the Urdu-labelled board by line order (%s)", (_name, dump) => {
    const parsed = parseTimetable(dump as OcrResult, REFERENCE);
    expect(parsed.layout).toBe("daily");
    for (const [prayer, value] of Object.entries(URDU_BOARD)) {
      expect(iqamah(parsed, prayer as TimetablePrayer)).toBe(value);
    }
    expect(parsed.jumuah).toEqual([expect.objectContaining({ iqamahAt: "13:30" })]);
  });

  it("flags every positional guess for review", () => {
    const parsed = parseTimetable(urduEng as OcrResult, REFERENCE);
    const cells = parsed.rows[0]?.cells ?? [];
    expect(cells.length).toBeGreaterThan(0);
    for (const cell of cells) {
      expect(cell.needsReview).toBe(true);
      expect(cell.flags).toContain("kindAssumed");
    }
    expect(parsed.jumuah.every((slot) => slot.needsReview)).toBe(true);
  });

  it("keeps a missed line as a gap instead of shifting the prayers", () => {
    // Upscaled read: the Asr line came out as noise ("ET").
    const parsed = parseTimetable(urduUpscaled as OcrResult, REFERENCE);
    expect(iqamah(parsed, "fajr")).toBe("05:00");
    expect(iqamah(parsed, "dhuhr")).toBe("13:30");
    expect(iqamah(parsed, "asr")).toBeNull();
    expect(iqamah(parsed, "maghrib")).toBe("17:20");
    expect(iqamah(parsed, "isha")).toBe("20:15");
  });

  it("reads an English Azan / Jamath board after enhancement", () => {
    const parsed = parseTimetable(englishEnhanced as OcrResult, REFERENCE);
    expect(parsed.layout).toBe("daily");
    expect(iqamah(parsed, "fajr")).toBe("05:30");
    expect(iqamah(parsed, "dhuhr")).toBe("13:00");
    expect(iqamah(parsed, "isha")).toBe("20:00");
  });

  it("uses the stack only when the labelled layouts find almost nothing", () => {
    const labelled = sheet([
      [
        [40, "Fajr"],
        [200, "5:30"],
      ],
      [
        [40, "Dhuhr"],
        [200, "1:15"],
      ],
      [
        [40, "Asr"],
        [200, "4:45"],
      ],
      [
        [40, "Maghrib"],
        [200, "5:22"],
      ],
      [
        [40, "Isha"],
        [200, "7:00"],
      ],
    ]);
    const parsed = parseTimetable(labelled, REFERENCE);
    const asr = parsed.rows[0]?.cells.find((c) => c.prayer === "asr" && c.kind === "iqamah");
    expect(asr?.value).toBe("16:45");
    expect(asr?.flags).not.toContain("columnUnclear");
  });

  it("rejects a stack whose hours can't be the five Salah in order", () => {
    const prices = sheet(
      ["9:10", "9:20", "9:30", "9:40", "9:50", "9:55"].map((t) => [
        [40, "Item"],
        [200, t],
      ]),
    );
    expect(parseTimetable(prices, REFERENCE).layout).toBe("none");
  });

  it("anchors the order on a label it could read", () => {
    // Six lines, but the first readable label says the stack starts at Dhuhr.
    const board = sheet([
      [
        [40, "zz"],
        [200, "1:30"],
      ],
      [
        [40, "qq"],
        [200, "5:00"],
      ],
      [
        [40, "Maghrib"],
        [200, "6:10"],
      ],
      [
        [40, "xx"],
        [200, "8:00"],
      ],
      [
        [40, "yy"],
        [200, "1:45"],
      ],
    ]);
    // Five lines read as Fajr…Isha would make Maghrib the 5:00 line — the
    // "Maghrib" label disagrees, so no positional guess is made.
    expect(parseTimetable(board, REFERENCE).layout).toBe("none");
  });
});

describe("lenient LED times", () => {
  it.each([
    ["500", "5:00"],
    ["5 20", "5:20"],
    ["5-30", "5:30"],
    [":5 00", "5:00"],
    ["1230", "12:30"],
    ["5:OO", "5:00"],
    ["S00", "5:00"],
    ["৫:৩০", "5:30"],
  ])("reads %s as %s", (text, want) => {
    const clock = parseLooseClockText(text);
    expect(clock && `${clock.hour}:${String(clock.minute).padStart(2, "0")}`).toBe(want);
  });

  it.each(["12:1504", "337 apples", "99", "2575", "wd"])("rejects %s", (text) => {
    // 337 alone *is* 3:37 (an LED countdown) — with a word it's not a time.
    expect(parseLooseClockText(text)).toBeNull();
  });

  it("maps Bengali and Devanagari digits", () => {
    expect(normaliseDigits("৮:১৫ ८:१५")).toBe("8:15 8:15");
  });

  it("only fixes letter confusions inside numbers", () => {
    expect(numericText("5:OO")).toBe("5:00");
    // A token needs one real digit first: "S:OO" alone could be a word.
    expect(numericText("S:OO")).toBeNull();
    expect(numericText("SOS")).toBeNull();
  });
});
