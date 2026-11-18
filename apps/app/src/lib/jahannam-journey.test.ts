import type { DailySummary } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { buildJahannamJourney } from "@/lib/jahannam-journey";
import { buildDailySummary, buildEmptyDailySummary } from "@/test-support/fixtures/daily-summary";

function setup(
  summary: DailySummary = buildDailySummary(),
  extra: { reflectionStreak?: number; intentionsSet?: number; intentionsTotal?: number } = {},
) {
  const snapshot = buildJahannamJourney({
    summary,
    reflectionStreak: 0,
    intentionsSet: 0,
    intentionsTotal: 0,
    formatCount: (n) => `#${n}`,
    ...extra,
  });
  const row = (id: string) => snapshot.rows.find((r) => r.id === id);
  return { snapshot, row };
}

describe("buildJahannamJourney", () => {
  it("lists the eight journey rows for today", () => {
    const { snapshot } = setup();
    expect(snapshot.date).toBe(getLocalDateString());
    expect(snapshot.rows.map((r) => r.id)).toEqual([
      "salah",
      "istighfar",
      "quran",
      "charity",
      "character",
      "repentance",
      "rights",
      "reflection",
    ]);
  });

  it("formats Salah and istighfar counts with progress", () => {
    const { row } = setup();
    expect(row("salah")).toMatchObject({ value: "#3/#5", progress: 0.6 });
    expect(row("istighfar")).toMatchObject({ value: "#1/#2", progress: 0.5 });
  });

  it("tracks intentions and the reflection streak", () => {
    const { row } = setup(buildDailySummary(), {
      intentionsSet: 1,
      intentionsTotal: 4,
      reflectionStreak: 3,
    });
    expect(row("charity")).toMatchObject({ value: "#1/#4", progress: 0.25 });
    expect(row("reflection")?.value).toBe("#3");
  });

  it("uses zero progress when nothing is scheduled", () => {
    const { row } = setup(buildEmptyDailySummary());
    expect([row("salah"), row("istighfar"), row("charity")].map((r) => r?.progress)).toEqual([
      0, 0, 0,
    ]);
  });

  it("has no activity on an empty day", () => {
    expect(setup(buildEmptyDailySummary()).snapshot.hasActivity).toBe(false);
  });

  it.each([
    ["Salah", buildEmptyDailySummary({ salahCompleted: 1 }), {}],
    ["istighfar", buildEmptyDailySummary({ zikrCompleted: 1 }), {}],
    ["an intention", buildEmptyDailySummary(), { intentionsSet: 1 }],
    ["a reflection streak", buildEmptyDailySummary(), { reflectionStreak: 1 }],
  ])("counts %s as activity", (_label, summary, extra) => {
    expect(setup(summary, extra).snapshot.hasActivity).toBe(true);
  });
});
