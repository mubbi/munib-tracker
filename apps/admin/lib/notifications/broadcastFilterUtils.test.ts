import { describe, expect, it } from "vitest";
import { countActiveBroadcastFilters, formatBroadcastFilterSummary } from "./broadcastFilterUtils";

describe("countActiveBroadcastFilters", () => {
  it("returns zero for empty filters", () => {
    expect(countActiveBroadcastFilters({})).toBe(0);
  });

  it("counts each active filter dimension once", () => {
    expect(
      countActiveBroadcastFilters({
        platforms: ["ios", "android"],
        locales: ["en", "ar"],
        activeWithinDays: 30,
        inactiveForDays: 90,
      }),
    ).toBe(4);
  });

  it("ignores empty arrays", () => {
    expect(countActiveBroadcastFilters({ platforms: [], locales: ["en"] })).toBe(1);
  });
});

describe("formatBroadcastFilterSummary", () => {
  it("returns empty array when no filters", () => {
    expect(formatBroadcastFilterSummary({})).toEqual([]);
  });

  it("formats all filter dimensions", () => {
    expect(
      formatBroadcastFilterSummary({
        platforms: ["ios", "web"],
        locales: ["en", "ur"],
        activeWithinDays: 14,
        inactiveForDays: 60,
      }),
    ).toEqual([
      "Platforms: IOS, WEB",
      "Languages: en, ur",
      "Active within 14 days",
      "Inactive for 60+ days",
    ]);
  });
});
