import {
  contrastRatio,
  hexToRgb,
  isValidHex,
  normalizeHex,
  normalizeHexForPicker,
  relativeLuminance,
} from "@/lib/color";

describe("hexToRgb", () => {
  it("parses #RRGGBB and #RGB (with whitespace, without #)", () => {
    expect(hexToRgb("#1A2b3C")).toEqual({ r: 26, g: 43, b: 60 });
    expect(hexToRgb(" fff ")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#0a0")).toEqual({ r: 0, g: 170, b: 0 });
  });

  it("rejects malformed input", () => {
    expect(hexToRgb("#12345")).toBeNull();
    expect(hexToRgb("#zzzzzz")).toBeNull();
    expect(hexToRgb("")).toBeNull();
    expect(isValidHex("#abc")).toBe(true);
    expect(isValidHex("abcd")).toBe(false);
  });
});

describe("normalizeHex", () => {
  it("expands shorthand and lowercases", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("010203")).toBe("#010203");
    expect(normalizeHex("nope")).toBeNull();
  });

  it("normalizeHexForPicker strips alpha channels and falls back to black", () => {
    expect(normalizeHexForPicker("#11223344")).toBe("#112233");
    expect(normalizeHexForPicker("#abcd")).toBe("#aabbcc");
    expect(normalizeHexForPicker("#ABCDEF")).toBe("#abcdef");
    expect(normalizeHexForPicker("garbage")).toBe("#000000");
  });
});

describe("luminance and contrast", () => {
  it("computes WCAG luminance at the extremes and for invalid input", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("invalid")).toBe(0);
    // Low channel uses the linear segment (c <= 0.03928).
    expect(relativeLuminance("#010101")).toBeCloseTo(1 / 255 / 12.92, 6);
  });

  it("is symmetric and spans 1–21", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#777777")).toBe(1);
  });
});
