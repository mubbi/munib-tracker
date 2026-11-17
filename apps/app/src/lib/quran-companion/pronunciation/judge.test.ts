import { judgeDrill, peakWindowMean, reliableHeads } from "./judge";

const ctx = "c16_l64";

function calibration(status: string, tau = 0.5) {
  return { contexts: { [ctx]: { qalqalah: { status, tau }, ghunna: { status: "off" } } } };
}

function qalqalahHead(peak: number, frames = 40) {
  const values: number[] = [];
  for (let f = 0; f < frames; f++) {
    const p = f >= 10 && f < 22 ? peak : 0;
    values.push(1 - p, p / 2, p / 2);
  }
  return { name: "attr_qalqalah", frames, classes: 3, values };
}

describe("pronunciation judge (Phase 6)", () => {
  it("scores only validated heads", () => {
    expect(reliableHeads(calibration("validated"), ctx)).toEqual(["qalqalah"]);
    expect(reliableHeads(calibration("experimental"), ctx)).toEqual([]);
  });

  it("matched when the head clears tau over its window", () => {
    expect(
      judgeDrill({
        head: "qalqalah",
        heads: [qalqalahHead(0.9)],
        calibration: calibration("validated"),
        context: ctx,
        heardSpeech: true,
      }),
    ).toBe("matched");
  });

  it("try again when speech was heard but the head stayed low", () => {
    expect(
      judgeDrill({
        head: "qalqalah",
        heads: [qalqalahHead(0.1)],
        calibration: calibration("validated"),
        context: ctx,
        heardSpeech: true,
      }),
    ).toBe("try-again");
  });

  it("not sure for experimental heads, silence, or a missing head", () => {
    const base = { head: "qalqalah" as const, context: ctx };
    expect(
      judgeDrill({
        ...base,
        heads: [qalqalahHead(0.9)],
        calibration: calibration("experimental"),
        heardSpeech: true,
      }),
    ).toBe("not-sure");
    expect(
      judgeDrill({
        ...base,
        heads: [qalqalahHead(0.9)],
        calibration: calibration("validated"),
        heardSpeech: false,
      }),
    ).toBe("not-sure");
    expect(
      judgeDrill({ ...base, heads: [], calibration: calibration("validated"), heardSpeech: true }),
    ).toBe("not-sure");
  });

  it("peakWindowMean averages the positive classes", () => {
    expect(peakWindowMean(qalqalahHead(0.8), [1, 2], 12)).toBeCloseTo(0.8);
  });
});
