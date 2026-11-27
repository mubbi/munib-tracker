import { calculateMirath } from "@munib-tracker/shared/mirath";

import i18n from "@/i18n";

import {
  MIRATH_CHART_HUE_COUNT,
  mirathChartA11yLabel,
  mirathChartSegments,
  mirathSegmentLabel,
} from "./chart";

const t = i18n.t.bind(i18n);

describe("mirath results chart", () => {
  it("lists inheriting heirs with exact fractions that sum to 100%", () => {
    const result = calculateMirath({
      school: "hanafi",
      deceased: { gender: "female" },
      heirs: { husband: 1, father: 1, mother: 1, full_brother: 2 },
    });
    const segments = mirathChartSegments(result);
    expect(segments.map((s) => (s.kind === "heir" ? s.heir : s.kind))).toEqual([
      "husband",
      "father",
      "mother",
    ]);
    expect(segments.map((s) => s.fraction)).toEqual(["1/2", "1/3", "1/6"]);
    const total = segments.reduce((n, s) => n + s.percent, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it("adds the unassigned rest as its own segment", () => {
    const result = calculateMirath({
      school: "hanafi",
      deceased: { gender: "male" },
      heirs: { wife: 1 },
    });
    const segments = mirathChartSegments(result);
    expect(segments).toHaveLength(2);
    expect(segments[1]).toEqual({ kind: "unallocated", fraction: "3/4", percent: 75 });
    expect(mirathSegmentLabel(t, segments[1] as (typeof segments)[number])).toContain("3/4");
  });

  it("is empty when nothing is distributed", () => {
    const result = calculateMirath({ school: "shafii", deceased: { gender: "male" }, heirs: {} });
    expect(mirathChartSegments(result)).toEqual([]);
  });

  it("cycles hues and labels every slice with fraction and percentage", () => {
    const result = calculateMirath({
      school: "hanbali",
      deceased: { gender: "male" },
      heirs: { wife: 1, mother: 1, daughter: 2, father: 1 },
    });
    const segments = mirathChartSegments(result);
    for (const s of segments)
      if (s.kind === "heir") expect(s.hue).toBeLessThan(MIRATH_CHART_HUE_COUNT);
    const label = mirathChartA11yLabel(t, segments);
    for (const s of segments) {
      expect(label).toContain(s.fraction);
      expect(label).toContain(`${s.percent}%`);
    }
    expect(label).not.toContain("mirath.");
  });
});
