import { buildStrand, resolveStrand } from "./bead-layout";
import { countEventFor, feedbackFor, type TasbeehFeedbackEvent } from "./feedback";

const EVENTS: TasbeehFeedbackEvent[] = ["bead", "spacer", "lap", "milestone", "complete", "limit"];

describe("feedbackFor", () => {
  it.each([
    ["bead", ["light"], "bead"],
    ["spacer", ["medium"], "spacer"],
    ["lap", ["medium", "medium"], "spacer"],
    ["milestone", ["medium", "medium"], "spacer"],
    ["complete", ["success"], "complete"],
    ["limit", ["light"], null],
  ] as const)("subtle: %s → %j + %s", (event, haptics, sound) => {
    expect(feedbackFor("misbaha", event, "subtle")).toEqual({ haptics, sound });
  });

  it("uses detent primitives for Rich", () => {
    expect(feedbackFor("misbaha", "bead", "rich").haptics).toEqual(["tick"]);
    expect(feedbackFor("misbaha", "spacer", "rich").haptics).toEqual(["detent"]);
    expect(feedbackFor("misbaha", "complete", "rich").haptics).toEqual(["success"]);
  });

  it("silences tasbeeh haptics when off but keeps the sound table", () => {
    for (const event of EVENTS) {
      expect(feedbackFor("ring", event, "off").haptics).toEqual([]);
    }
    expect(feedbackFor("ring", "bead", "off").sound).toBe("bead");
  });

  it("keeps Ring identical to the original counter (light per tap, success at target)", () => {
    expect(feedbackFor("ring", "bead", "subtle").haptics).toEqual(["light"]);
    expect(feedbackFor("ring", "complete", "subtle").haptics).toEqual(["success"]);
  });
});

describe("countEventFor", () => {
  it("counts plain beads on Ring and Clicker", () => {
    expect(countEventFor("ring", 33)).toBe("bead");
    expect(countEventFor("clicker", 66)).toBe("bead");
  });

  it("marks every 33 on Focus / Night", () => {
    expect(countEventFor("minimal", 33)).toBe("milestone");
    expect(countEventFor("minimal", 66)).toBe("milestone");
    expect(countEventFor("minimal", 99)).toBe("milestone");
    expect(countEventFor("minimal", 34)).toBe("bead");
  });

  it("reads the misbaha strand", () => {
    const strand = buildStrand(resolveStrand("auto", 99));
    expect(countEventFor("misbaha", 33, strand)).toBe("spacer");
    expect(countEventFor("misbaha", 66, strand)).toBe("spacer");
    expect(countEventFor("misbaha", 34, strand)).toBe("bead");
    const loop = buildStrand(resolveStrand("auto", 0));
    expect(countEventFor("misbaha", 33, loop)).toBe("lap");
  });
});
