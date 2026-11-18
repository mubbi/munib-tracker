import { describe, expect, it } from "@jest/globals";
import type { DailySummary } from "@munib-tracker/shared/types";

import { buildDailySummary, buildEmptyDailySummary } from "@/test-support/fixtures/daily-summary";

import { buildJannahJourney } from "./jannah-journey";

function setup(
  summary: DailySummary = buildDailySummary(),
  activity: { streak?: number; khushuThisWeek?: number; tahajjudThisWeek?: number } = {},
) {
  const snapshot = buildJannahJourney({
    summary,
    streak: 0,
    khushuThisWeek: 0,
    tahajjudThisWeek: 0,
    formatCount: (n) => String(n),
    ...activity,
  });
  const row = (id: string) => snapshot.rows.find((r) => r.id === id);
  return { snapshot, row };
}

describe("buildJannahJourney", () => {
  it("reports Salah completion as a value and progress", () => {
    const { row } = setup();
    expect(row("salah")).toMatchObject({ value: "3/5", route: "/tracker" });
    expect(row("salah")?.progress).toBeCloseTo(0.6);
  });

  it("shows today's qaza target progress when one is scheduled", () => {
    const { row } = setup();
    expect(row("qaza")).toMatchObject({ value: "2/4", progress: 0.5 });
  });

  it("shows remaining qaza without progress when no target is set", () => {
    const { row } = setup(buildDailySummary({ qazaTargetToday: 0, qazaRemaining: 12 }));
    expect(row("qaza")).toMatchObject({ value: "12", progress: undefined });
  });

  it("uses zero progress when nothing is scheduled", () => {
    const { row } = setup(buildEmptyDailySummary());
    expect([row("salah")?.progress, row("dhikr")?.progress]).toEqual([0, 0]);
  });

  it("has no activity on an empty day", () => {
    expect(setup(buildEmptyDailySummary()).snapshot.hasActivity).toBe(false);
  });

  it.each([
    ["Salah", buildEmptyDailySummary({ salahCompleted: 1 }), {}],
    ["zikr", buildEmptyDailySummary({ zikrCompleted: 1 }), {}],
    ["qaza", buildEmptyDailySummary({ qazaCompletedToday: 1 }), {}],
    ["a streak", buildEmptyDailySummary(), { streak: 1 }],
    ["khushu", buildEmptyDailySummary(), { khushuThisWeek: 1 }],
    ["tahajjud", buildEmptyDailySummary(), { tahajjudThisWeek: 1 }],
  ])("counts %s as activity", (_label, summary, activity) => {
    expect(setup(summary, activity).snapshot.hasActivity).toBe(true);
  });
});
