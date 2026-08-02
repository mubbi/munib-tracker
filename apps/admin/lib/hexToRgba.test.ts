import { describe, expect, it } from "vitest";
import { hexToRgba } from "./hexToRgba";

describe("hexToRgba", () => {
  it("converts 6-digit hex with hash", () => {
    expect(hexToRgba("#10b981", 0.5)).toBe("rgba(16,185,129,0.5)");
  });

  it("converts 6-digit hex without hash", () => {
    expect(hexToRgba("e6c065", 1)).toBe("rgba(230,192,101,1)");
  });

  it("expands 3-digit shorthand", () => {
    expect(hexToRgba("#f00", 0.25)).toBe("rgba(255,0,0,0.25)");
  });

  it("returns fallback green for invalid hex", () => {
    expect(hexToRgba("not-a-color", 0.8)).toBe("rgba(46, 125, 50, 0.8)");
  });

  it("returns fallback for wrong length", () => {
    expect(hexToRgba("#12345", 1)).toBe("rgba(46, 125, 50, 1)");
  });

  it("preserves alpha parameter", () => {
    expect(hexToRgba("#000000", 0)).toBe("rgba(0,0,0,0)");
  });
});
