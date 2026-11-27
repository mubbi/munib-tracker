import { previewCountSize } from "@/components/tasbeeh/faces/ring-face";
import { gridCardWidth } from "@/components/tasbeeh/tasbeeh-appearance-editor";

describe("design grid card width", () => {
  it("fills each row exactly (no ragged gap at the end)", () => {
    // 540px row: four cards + three 8px gaps.
    const width = gridCardWidth(540);
    expect(width * 4 + 8 * 3).toBeLessThanOrEqual(540);
    expect(width).toBeGreaterThanOrEqual(120);
    expect(540 - (width * 4 + 8 * 3)).toBeLessThan(4);
  });

  it("never drops below one column", () => {
    expect(gridCardWidth(80)).toBe(80);
  });
});

describe("ring preview count size", () => {
  it("scales with the ring and keeps a legible floor", () => {
    expect(previewCountSize(156)).toBe(34);
    expect(previewCountSize(70)).toBe(15);
    expect(previewCountSize(40)).toBe(14);
  });
});
