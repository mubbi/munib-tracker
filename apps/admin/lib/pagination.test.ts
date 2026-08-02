import { describe, expect, it } from "vitest";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "./pagination";

describe("parsePage", () => {
  it("defaults to 1 for undefined", () => {
    expect(parsePage(undefined)).toBe(1);
  });

  it("defaults to 1 for invalid values", () => {
    expect(parsePage("")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
  });

  it("floors positive numbers", () => {
    expect(parsePage("2")).toBe(2);
    expect(parsePage("2.9")).toBe(2);
  });
});

describe("pageOffset", () => {
  it("computes offset from page and size", () => {
    expect(pageOffset(1, 25)).toBe(0);
    expect(pageOffset(2, 25)).toBe(25);
    expect(pageOffset(3, 10)).toBe(20);
  });

  it("uses PAGE_SIZE by default", () => {
    expect(pageOffset(2)).toBe(PAGE_SIZE);
  });
});

describe("takePage", () => {
  it("returns full page when no next page", () => {
    const rows = [1, 2, 3];
    expect(takePage(rows, 25)).toEqual({ rows: [1, 2, 3], hasNext: false });
  });

  it("detects next page when peek row exists", () => {
    const rows = Array.from({ length: 26 }, (_, i) => i + 1);
    const result = takePage(rows, 25);
    expect(result.rows).toHaveLength(25);
    expect(result.rows[24]).toBe(25);
    expect(result.hasNext).toBe(true);
  });

  it("uses PAGE_SIZE by default", () => {
    const rows = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => i);
    expect(takePage(rows).hasNext).toBe(true);
  });
});
