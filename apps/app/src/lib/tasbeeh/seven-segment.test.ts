import { lcdCells, segmentPolygons, segmentsFor } from "./seven-segment";

describe("seven-segment", () => {
  it("lights the right segments", () => {
    expect(segmentsFor("8").every(Boolean)).toBe(true);
    expect(segmentsFor("1")).toEqual([false, true, true, false, false, false, false]);
    expect(segmentsFor("0")[6]).toBe(false);
    expect(segmentsFor(" ").some(Boolean)).toBe(false);
    for (let d = 0; d <= 9; d++) expect(segmentsFor(String(d)).some(Boolean)).toBe(true);
  });

  it("right-aligns the count in blank cells", () => {
    expect(lcdCells(7)).toEqual([" ", " ", " ", "7"]);
    expect(lcdCells(1234)).toEqual(["1", "2", "3", "4"]);
    expect(lcdCells(123456)).toHaveLength(6);
    expect(lcdCells(-3)).toEqual([" ", " ", " ", "0"]);
  });

  it("draws seven polygons inside the cell", () => {
    const polygons = segmentPolygons(20, 36);
    expect(polygons).toHaveLength(7);
    for (const poly of polygons) {
      for (const pair of poly.split(" ")) {
        const [x, y] = pair.split(",").map(Number);
        expect(x).toBeGreaterThanOrEqual(-0.01);
        expect(x).toBeLessThanOrEqual(20.01);
        expect(y).toBeGreaterThanOrEqual(-0.01);
        expect(y).toBeLessThanOrEqual(36.01);
      }
    }
  });
});
