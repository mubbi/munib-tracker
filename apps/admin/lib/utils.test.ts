import { describe, expect, it } from "vitest";
import {
  cn,
  countBy,
  formatBytes,
  formatDate,
  formatDurationShort,
  formatNumber,
  formatPercent,
  isTombstoneEmail,
  maskEmail,
  normalizeEmail,
} from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", false && "hidden", "font-bold")).toBe("text-red-500 font-bold");
  });
});

describe("formatNumber", () => {
  it("formats with en-US grouping", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });
});

describe("formatPercent", () => {
  it("returns 0% when total is zero", () => {
    expect(formatPercent(5, 0)).toBe("0%");
  });

  it("computes one decimal place", () => {
    expect(formatPercent(1, 3)).toBe("33.3%");
    expect(formatPercent(2, 4)).toBe("50.0%");
  });
});

describe("countBy", () => {
  it("tallies and sorts descending", () => {
    const items = [
      { status: "open" },
      { status: "closed" },
      { status: "open" },
      { status: "open" },
    ];
    expect(countBy(items, (item) => item.status)).toEqual([
      { label: "open", value: 3 },
      { label: "closed", value: 1 },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(countBy([], () => "x")).toEqual([]);
  });
});

describe("formatBytes", () => {
  it("returns 0 B for non-positive values", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(-1)).toBe("0 B");
    expect(formatBytes(Number.NaN)).toBe("0 B");
  });

  it("formats byte scales", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1024 ** 2)).toBe("1.0 MB");
  });
});

describe("formatDurationShort", () => {
  it("returns em dash for nullish or invalid", () => {
    expect(formatDurationShort(null)).toBe("—");
    expect(formatDurationShort(undefined)).toBe("—");
    expect(formatDurationShort(-1)).toBe("—");
  });

  it("formats minutes under an hour", () => {
    expect(formatDurationShort(90)).toBe("2m");
  });

  it("formats hours under two days", () => {
    expect(formatDurationShort(7200)).toBe("2.0h");
  });

  it("formats days at 48h and above", () => {
    expect(formatDurationShort(86400 * 3)).toBe("3.0d");
  });
});

describe("formatDate", () => {
  it("returns em dash for empty values", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("")).toBe("—");
  });

  it("formats Date and ISO string", () => {
    const formatted = formatDate(new Date("2024-06-15T14:30:00Z"));
    expect(formatted).toMatch(/Jun/);
    expect(formatted).toMatch(/2024/);
    expect(formatted).toMatch(/15/);

    const fromString = formatDate("2024-06-15T14:30:00Z");
    expect(fromString).toMatch(/Jun/);
  });
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Admin@Example.COM  ")).toBe("admin@example.com");
  });
});

describe("isTombstoneEmail", () => {
  it("detects deleted account tombstones", () => {
    expect(isTombstoneEmail("deleted_abcdef0123456789abcdef0123456789_user@example.com")).toBe(
      true,
    );
  });

  it("returns false for normal or empty emails", () => {
    expect(isTombstoneEmail("user@example.com")).toBe(false);
    expect(isTombstoneEmail(null)).toBe(false);
    expect(isTombstoneEmail(undefined)).toBe(false);
  });
});

describe("maskEmail", () => {
  it("masks local part keeping first two characters", () => {
    expect(maskEmail("admin@example.com")).toBe("ad***@example.com");
  });

  it("returns em dash for tombstone or missing email", () => {
    expect(maskEmail(null)).toBe("—");
    expect(maskEmail("deleted_abcdef0123456789abcdef0123456789_x@x.com")).toBe("—");
  });

  it("returns original when @ is missing", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});
