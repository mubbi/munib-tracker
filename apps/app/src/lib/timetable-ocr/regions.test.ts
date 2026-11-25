import type { OcrResult } from "@munib-tracker/shared/timetable-parser";
import { parseTimetable } from "@munib-tracker/shared/timetable-parser";

import {
  containedFrame,
  draftFromMarks,
  looseTimeText,
  marksFromParsed,
  rectFromDrag,
  timeFromTokens,
  toPixels,
  voteReadings,
} from "./regions";
import { draftToImported, reviewCounts } from "./review";

const token = (text: string, x: number, y: number, w = 40, h = 20) => ({
  text,
  conf: 0.9,
  box: { x, y, w, h },
});

describe("marking times on the photo (guided import)", () => {
  it("finds where a contained image sits in its view", () => {
    // 200 × 400 photo in a 400 × 400 view: scaled to 200 × 400, centred.
    expect(containedFrame({ width: 400, height: 400 }, { width: 200, height: 400 })).toEqual({
      x: 100,
      y: 0,
      width: 200,
      height: 400,
    });
  });

  it("turns a drag into an image area (either direction, clamped to the photo)", () => {
    const frame = { x: 100, y: 0, width: 200, height: 400 };
    expect(rectFromDrag({ x: 300, y: 200 }, { x: 200, y: 100 }, frame)).toEqual({
      x: 0.5,
      y: 0.25,
      w: 0.5,
      h: 0.25,
    });
    // Dragging off the photo stops at its edge.
    const clamped = rectFromDrag({ x: 50, y: 0 }, { x: 150, y: 40 }, frame);
    expect(clamped?.x).toBe(0);
    expect(clamped?.w).toBeCloseTo(0.25);
  });

  it("ignores a tap (an area too small to be a box)", () => {
    const frame = { x: 0, y: 0, width: 300, height: 300 };
    expect(rectFromDrag({ x: 10, y: 10 }, { x: 12, y: 11 }, frame)).toBeNull();
  });

  it("maps an area to pixels of any size, inside the image", () => {
    expect(toPixels({ x: 0.5, y: 0.25, w: 0.6, h: 0.25 }, { width: 200, height: 400 })).toEqual({
      x: 100,
      y: 100,
      w: 100,
      h: 100,
    });
  });

  it.each([
    ["5:00", "5:00"],
    ["500", "5:00"],
    ["8 15", "8:15"],
    ["12:30 PM", "12:30 pm"],
    ["Fajr", null],
  ])("reads marked text %s as %s", (text, want) => {
    expect(looseTimeText(text)).toBe(want);
  });

  it("reads the full-photo tokens inside a marked area (native)", () => {
    const ocr: OcrResult = {
      width: 400,
      height: 200,
      tokens: [
        token("Fajr", 20, 40),
        token("5", 200, 40, 16),
        token("30", 230, 40, 30),
        token("Dhuhr", 20, 100),
        token("1:15", 200, 100),
      ],
    };
    // Box around "5 30" (LED gap, no colon) in the first line.
    expect(timeFromTokens(ocr, { x: 0.48, y: 0.18, w: 0.18, h: 0.14 })).toBe("5:30");
    // A box that also caught the label still finds the time.
    expect(timeFromTokens(ocr, { x: 0, y: 0.48, w: 0.7, h: 0.14 })).toBe("1:15");
    expect(timeFromTokens(ocr, { x: 0.9, y: 0.9, w: 0.05, h: 0.05 })).toBeNull();
    expect(timeFromTokens(null, { x: 0, y: 0, w: 1, h: 1 })).toBeNull();
  });

  it("votes across several reads of one area", () => {
    expect(
      voteReadings([
        { text: "530", conf: 0.6 },
        { text: "5:30", conf: 0.8 },
        { text: "520", conf: 0.9 },
        { text: "", conf: 0.9 },
        { text: "30", conf: 0.99 },
      ]),
    ).toBe("5:30");
    expect(voteReadings([{ text: "?", conf: 1 }])).toBeNull();
  });

  it("saves marked 12-hour times per Salah, like typed ones", () => {
    const draft = draftFromMarks({
      fajr: "5:00",
      dhuhr: "1:30",
      asr: "",
      maghrib: "5:20",
      isha: "8:15",
      jumuah: "1:30",
    });
    expect(reviewCounts(draft)).toMatchObject({ filled: 4, toCheck: 0, invalid: 0 });
    expect(draftToImported(draft, { year: 2026, month: 11 })).toEqual({
      daily: { fajr: "05:00", dhuhr: "13:30", maghrib: "17:20", isha: "20:15" },
      jumuah: [{ iqamahAt: "13:30" }],
    });
  });

  it("starts from what the automatic read found", () => {
    const parsed = parseTimetable({
      width: 600,
      height: 300,
      tokens: [
        token("Fajr", 20, 40),
        token("5:30", 200, 40),
        token("Dhuhr", 20, 90),
        token("1:15", 200, 90),
        token("Asr", 20, 140),
        token("4:45", 200, 140),
        token("Jumuah", 20, 190),
        token("1:30", 200, 190),
      ],
    });
    expect(marksFromParsed(parsed)).toEqual({
      fajr: "05:30",
      dhuhr: "13:15",
      asr: "16:45",
      jumuah: "13:30",
    });
    expect(marksFromParsed(null)).toEqual({});
  });
});
