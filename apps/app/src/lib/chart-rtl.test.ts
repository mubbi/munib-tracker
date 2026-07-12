import { describe, expect, it } from "@jest/globals";

import {
  progressFillTransformOrigin,
  progressRingArcPath,
  progressRingConicGradient,
  progressRingKnobOffset,
  progressRingSweepAngle,
  progressSweepRtl,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
  segmentProgressFilled,
} from "@/lib/chart-rtl";

describe("progressRingSweepAngle", () => {
  it("sweeps clockwise in LTR and counter-clockwise in RTL", () => {
    expect(progressRingSweepAngle(0.25, false)).toBeCloseTo(Math.PI / 2, 5);
    expect(progressRingSweepAngle(0.25, true)).toBeCloseTo(-Math.PI / 2, 5);
  });
});

describe("progressRingKnobOffset", () => {
  it("places the knob at 12 o'clock for zero progress", () => {
    const { translateX, translateY } = progressRingKnobOffset(100, 10, 0, false);
    expect(translateX).toBeCloseTo(0, 0);
    expect(translateY).toBeCloseTo(-45, 0);
  });

  it("places the knob at the arc head for clockwise progress", () => {
    const { translateX, translateY } = progressRingKnobOffset(100, 10, 0.25, false);
    expect(translateX).toBeCloseTo(45, 0);
    expect(translateY).toBeCloseTo(0, 0);
  });

  it("mirrors the knob to the counter-clockwise arc head in RTL", () => {
    const ltr = progressRingKnobOffset(100, 10, 0.25, false);
    const rtl = progressRingKnobOffset(100, 10, 0.25, true);
    expect(rtl.translateX).toBeCloseTo(-ltr.translateX, 0);
    expect(rtl.translateY).toBeCloseTo(ltr.translateY, 0);
  });
});

describe("progressRingArcPath", () => {
  it("ends at 3 o'clock for 25% clockwise progress", () => {
    const path = progressRingArcPath(50, 50, 40, 0.25, false);
    expect(path).toContain("90 50");
  });

  it("ends at 9 o'clock for 25% counter-clockwise progress", () => {
    const path = progressRingArcPath(50, 50, 40, 0.25, true);
    expect(path).toMatch(/10 49\.?9+/);
  });
});

describe("progressRingConicGradient", () => {
  it("fills clockwise from the top in LTR", () => {
    expect(progressRingConicGradient("#f00", "#ccc", 0.5, false)).toBe(
      "conic-gradient(#f00 0deg 180deg, #ccc 180deg 360deg)",
    );
  });

  it("fills counter-clockwise from the top in RTL", () => {
    expect(progressRingConicGradient("#f00", "#ccc", 0.5, true)).toBe(
      "conic-gradient(#ccc 0deg 180deg, #f00 180deg 360deg)",
    );
  });
});

describe("progressFillTransformOrigin", () => {
  it("defaults to LTR when not in RTL layout", () => {
    expect(progressSweepRtl()).toBe(false);
    expect(progressFillTransformOrigin()).toBe("0% 50%");
  });
});

describe("segmentProgressFilled", () => {
  it("fills from the start in LTR", () => {
    expect(segmentProgressFilled(0, 5, 2, false)).toBe(true);
    expect(segmentProgressFilled(1, 5, 2, false)).toBe(true);
    expect(segmentProgressFilled(2, 5, 2, false)).toBe(false);
  });

  it("fills from the end in RTL", () => {
    expect(segmentProgressFilled(3, 5, 2, true)).toBe(true);
    expect(segmentProgressFilled(4, 5, 2, true)).toBe(true);
    expect(segmentProgressFilled(2, 5, 2, true)).toBe(false);
  });

  it("clamps completed to total", () => {
    expect(segmentProgressFilled(4, 5, 99, false)).toBe(true);
    expect(segmentProgressFilled(0, 5, 99, true)).toBe(true);
    expect(segmentProgressFilled(0, 5, 0, true)).toBe(false);
  });
});

describe("segmentedTrackDirection", () => {
  it("defaults to row in LTR layout", () => {
    expect(segmentedTrackDirection()).toBe("row");
  });
});

describe("segmentedThumbAnchor", () => {
  it("anchors to the left in LTR and right in RTL", () => {
    expect(segmentedThumbAnchor(6, false)).toEqual({ left: 6 });
    expect(segmentedThumbAnchor(6, true)).toEqual({ right: 6 });
  });
});

describe("segmentedThumbOffset", () => {
  it("moves right from the left anchor in LTR", () => {
    expect(segmentedThumbOffset(0, 80, 4, false)).toBe(0);
    expect(segmentedThumbOffset(1, 80, 4, false)).toBe(84);
  });

  it("moves left from the right anchor in RTL", () => {
    expect(segmentedThumbOffset(0, 80, 4, true)).toBe(0);
    expect(segmentedThumbOffset(1, 80, 4, true)).toBe(-84);
  });
});
