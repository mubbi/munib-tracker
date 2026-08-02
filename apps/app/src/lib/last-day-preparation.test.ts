import { describe, expect, it } from "@jest/globals";
import type { DailySummary } from "@munib-tracker/shared/types";

import { buildLastDayPreparation } from "./last-day-preparation";

const baseSummary: DailySummary = {
  date: "2026-07-03",
  salahCompleted: 3,
  salahTotal: 5,
  zikrCompleted: 2,
  zikrTotal: 4,
  qazaRemaining: 7,
  qazaTargetToday: 1,
  qazaCompletedToday: 0,
  streakDays: 5,
};

describe("buildLastDayPreparation", () => {
  it("builds nine preparation rows with progress where applicable", () => {
    const snapshot = buildLastDayPreparation({
      summary: baseSummary,
      lessonsCompleted: 2,
      lessonsTotal: 5,
      repentanceChecked: false,
      characterChecked: true,
      formatCount: String,
    });

    expect(snapshot.rows).toHaveLength(9);
    expect(snapshot.rows.map((r) => r.id)).toEqual([
      "salah",
      "quran",
      "dhikr",
      "charity",
      "repentance",
      "rights",
      "character",
      "reflection",
      "learning",
    ]);

    const salah = snapshot.rows.find((r) => r.id === "salah");
    expect(salah?.value).toBe("3/5");
    expect(salah?.progress).toBeCloseTo(0.6);

    const dhikr = snapshot.rows.find((r) => r.id === "dhikr");
    expect(dhikr?.value).toBe("2/4");
    expect(dhikr?.progress).toBeCloseTo(0.5);

    const learning = snapshot.rows.find((r) => r.id === "learning");
    expect(learning?.value).toBe("2/5");
    expect(learning?.progress).toBeCloseTo(0.4);
  });

  it("marks checked repentance and character rows", () => {
    const snapshot = buildLastDayPreparation({
      summary: baseSummary,
      lessonsCompleted: 0,
      lessonsTotal: 0,
      repentanceChecked: true,
      characterChecked: true,
      formatCount: (n) => `#${n}`,
    });

    expect(snapshot.rows.find((r) => r.id === "repentance")?.value).toBe("✓");
    expect(snapshot.rows.find((r) => r.id === "character")?.value).toBe("✓");
    expect(snapshot.rows.find((r) => r.id === "rights")?.value).toBe("#7");
  });

  it("sets hasActivity when any tracked item is non-zero or checked", () => {
    const inactive = buildLastDayPreparation({
      summary: { ...baseSummary, salahCompleted: 0, zikrCompleted: 0 },
      lessonsCompleted: 0,
      lessonsTotal: 5,
      repentanceChecked: false,
      characterChecked: false,
      formatCount: String,
    });
    expect(inactive.hasActivity).toBe(false);

    const active = buildLastDayPreparation({
      summary: baseSummary,
      lessonsCompleted: 0,
      lessonsTotal: 5,
      repentanceChecked: true,
      characterChecked: false,
      formatCount: String,
    });
    expect(active.hasActivity).toBe(true);
  });

  it("includes today's date in the snapshot", () => {
    const snapshot = buildLastDayPreparation({
      summary: baseSummary,
      lessonsCompleted: 0,
      lessonsTotal: 0,
      repentanceChecked: false,
      characterChecked: false,
      formatCount: String,
    });
    expect(snapshot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
