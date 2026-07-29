import {
  getQiblaTurnGuidance,
  qiblaAlignmentProgress,
  qiblaArrowAngle,
} from "@/lib/qibla-guidance";

describe("qiblaArrowAngle", () => {
  it("returns 0 when heading matches bearing", () => {
    expect(qiblaArrowAngle(268, 268)).toBe(0);
  });

  it("wraps across the 0/360 seam along the shortest arc", () => {
    expect(qiblaArrowAngle(10, 350)).toBe(20);
    expect(qiblaArrowAngle(350, 10)).toBe(-20);
  });
});

describe("getQiblaTurnGuidance", () => {
  it("marks alignment within the default threshold", () => {
    expect(getQiblaTurnGuidance(3).kind).toBe("aligned");
    expect(getQiblaTurnGuidance(-4).kind).toBe("aligned");
  });

  it("nudges left or right when nearly aligned", () => {
    expect(getQiblaTurnGuidance(8).kind).toBe("fineTuneRight");
    expect(getQiblaTurnGuidance(-9).kind).toBe("fineTuneLeft");
  });

  it("guides with slight turns before full turns", () => {
    expect(getQiblaTurnGuidance(25).kind).toBe("slightRight");
    expect(getQiblaTurnGuidance(-30).kind).toBe("slightLeft");
  });

  it("asks for a full turn when far off", () => {
    expect(getQiblaTurnGuidance(120).kind).toBe("right");
    expect(getQiblaTurnGuidance(-150).kind).toBe("left");
  });
});

describe("qiblaAlignmentProgress", () => {
  it("ramps from 0 at max offset to 1 when aligned", () => {
    expect(qiblaAlignmentProgress(90)).toBe(0);
    expect(qiblaAlignmentProgress(0)).toBe(1);
    expect(qiblaAlignmentProgress(45)).toBeCloseTo(0.5);
  });
});
