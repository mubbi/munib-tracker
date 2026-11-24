import {
  CALIBRATION_FLOOR,
  calibrationFromScores,
  clampOffset,
  MAX_CALIBRATION_RELAX,
  passesGate,
  resolveTasbeehVoicePrefs,
  SENSITIVITY_THRESHOLDS,
  thresholdFor,
} from "./gate";

describe("confidence gate", () => {
  it("defaults to Strict and a 60 s auto-stop (D16)", () => {
    expect(resolveTasbeehVoicePrefs(undefined)).toEqual({
      sensitivity: "strict",
      silenceStopSec: 60,
    });
    expect(resolveTasbeehVoicePrefs({ sensitivity: "balanced", silenceStopSec: 120 })).toEqual({
      sensitivity: "balanced",
      silenceStopSec: 120,
    });
    expect(
      resolveTasbeehVoicePrefs({ sensitivity: "loose" as never, silenceStopSec: 5 as never }),
    ).toEqual({ sensitivity: "strict", silenceStopSec: 60 });
  });

  it("makes Balanced looser than Strict", () => {
    expect(SENSITIVITY_THRESHOLDS.balanced).toBeLessThan(SENSITIVITY_THRESHOLDS.strict);
  });

  it("applies a calibration offset within limits and never below the floor", () => {
    expect(thresholdFor("strict")).toBe(SENSITIVITY_THRESHOLDS.strict);
    expect(thresholdFor("strict", { thresholdOffset: -0.1, at: "" })).toBeCloseTo(
      SENSITIVITY_THRESHOLDS.strict - 0.1,
    );
    expect(clampOffset(-5)).toBe(-MAX_CALIBRATION_RELAX);
    expect(thresholdFor("balanced", { thresholdOffset: -5, at: "" })).toBeGreaterThanOrEqual(
      CALIBRATION_FLOOR,
    );
    expect(clampOffset(Number.NaN)).toBe(0);
  });

  it("passes only finite scores at or above the threshold", () => {
    expect(passesGate(-0.2, -0.5)).toBe(true);
    expect(passesGate(-0.6, -0.5)).toBe(false);
    expect(passesGate(Number.NEGATIVE_INFINITY, -0.5)).toBe(false);
  });

  it("calibrates from the user's weaker repetitions", () => {
    const base = SENSITIVITY_THRESHOLDS.strict;
    const quiet = calibrationFromScores(
      [base - 0.2, base - 0.1, base, base, base + 0.05],
      "strict",
    );
    expect(quiet.ok && quiet.thresholdOffset).toBeLessThan(0);
    const clear = calibrationFromScores([-0.05, -0.04, -0.03, -0.02, -0.01], "strict");
    expect(clear.ok && clear.thresholdOffset).toBeGreaterThan(0);
  });

  it("refuses to calibrate from too few repetitions", () => {
    expect(calibrationFromScores([-0.2, -0.3], "strict")).toEqual({
      ok: false,
      reason: "not-enough",
    });
  });
});
