import { describe, expect, it } from "vitest";

import {
  parseClockText,
  parseIntegerText,
  parseMeridiemToken,
  stripEdgePunctuation,
} from "../normalise";

describe.concurrent("stripEdgePunctuation", () => {
  it("trims whitespace and edge punctuation from both ends only", () => {
    expect(stripEdgePunctuation(" (5:30) ")).toBe("5:30");
    expect(stripEdgePunctuation("“Fajr”,")).toBe("Fajr");
    expect(stripEdgePunctuation("\t•— 12:45 —•\n")).toBe("12:45");
    expect(stripEdgePunctuation("a (b) c")).toBe("a (b) c");
    expect(stripEdgePunctuation("()[]")).toBe("");
    expect(stripEdgePunctuation("")).toBe("");
  });

  it("stays linear on long whitespace runs (CodeQL js/polynomial-redos)", () => {
    const text = `1${"\t".repeat(200_000)}x`;
    const started = performance.now();
    expect(stripEdgePunctuation(text)).toBe(text);
    expect(parseClockText(text)).toBeNull();
    expect(performance.now() - started).toBeLessThan(1_000);
  });

  it("keeps the token parsers' edge handling", () => {
    expect(parseClockText(" (5:30 pm) ")).toEqual({ hour: 5, minute: 30, meridiem: "pm" });
    expect(parseIntegerText("“12th”,")).toBe(12);
    expect(parseMeridiemToken(" (AM) ")).toBe("am");
    expect(parseClockText("5 : 30")).toEqual({ hour: 5, minute: 30, meridiem: null });
    expect(parseClockText("5 . 30")).toEqual({ hour: 5, minute: 30, meridiem: null });
    expect(parseClockText("13h05")).toEqual({ hour: 13, minute: 5, meridiem: null });
    expect(parseClockText("٥٫٣٠")).toEqual({ hour: 5, minute: 30, meridiem: null });
  });
});
