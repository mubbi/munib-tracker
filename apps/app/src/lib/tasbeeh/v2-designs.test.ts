import { defined } from "@/test-support/assert";

import { constellation } from "./constellation";
import { TASBEEH_DESIGN_NOTES } from "./design-notes";
import { countEventFor } from "./feedback";
import {
  fingerAngle,
  fingerSpots,
  fingersFor,
  HAND_BOX,
  handsFor,
  palmPath,
} from "./finger-layout";
import { pebbleArc, pebbleGeometry, pebbleOccupancy, pebbleSlot } from "./pebble-layout";
import { petalAngle, petalPolygon, starPolygon } from "./rosette";
import { closesRound, FINGER_ROUND, ROUND_SIZE, roundSizeFor, roundState } from "./rounds";

const TIPS = { fingers: { layout: "tips" as const } };
const JOINTS = { fingers: { layout: "joints" as const } };

describe("rounds", () => {
  it.each([
    ["pebbles", 33, 33],
    ["pebbles", 10, 10],
    ["pebbles", 99, 33],
    ["pebbles", 100, 33],
    ["pebbles", 0, 33],
    ["geometric", 99, 33],
    ["stars", 7, 7],
  ] as const)("%s with target %i shows rounds of %i", (design, target, size) => {
    expect(roundSizeFor(design, target, TIPS)).toBe(size);
  });

  it("uses 10 fingertips or 15 joints for finger counting, whatever the target", () => {
    expect(roundSizeFor("fingers", 33, TIPS)).toBe(FINGER_ROUND.tips);
    expect(roundSizeFor("fingers", 33, JOINTS)).toBe(FINGER_ROUND.joints);
    expect(FINGER_ROUND).toEqual({ tips: 10, joints: 15 });
  });

  it("leaves the other designs without rounds", () => {
    for (const design of ["ring", "misbaha", "clicker", "minimal"] as const) {
      expect(roundSizeFor(design, 33, TIPS)).toBeUndefined();
    }
  });

  it.each([
    [0, 1, 0],
    [1, 1, 1],
    [32, 1, 32],
    [33, 1, 33],
    [34, 2, 1],
    [99, 3, 33],
  ])("count %i is round %i with %i done", (count, lap, done) => {
    expect(roundState(count, ROUND_SIZE)).toEqual({ size: 33, lap, done });
  });

  it("closes a round only when it isn't the last one", () => {
    expect(closesRound(33, 33, 99)).toBe(true);
    expect(closesRound(99, 33, 99)).toBe(false);
    expect(closesRound(33, 33, 33)).toBe(false);
    expect(closesRound(66, 33, 0)).toBe(true);
    expect(closesRound(32, 33, 0)).toBe(false);
  });

  it("marks finished rounds as laps in the feedback table", () => {
    expect(countEventFor("pebbles", 33, undefined, { size: 33, target: 99 })).toBe("lap");
    expect(countEventFor("pebbles", 34, undefined, { size: 33, target: 99 })).toBe("bead");
    expect(countEventFor("fingers", 10, undefined, { size: 10, target: 33 })).toBe("lap");
    // Reaching the target is the completion cue, not a lap.
    expect(countEventFor("stars", 33, undefined, { size: 33, target: 33 })).toBe("bead");
  });
});

describe("pebbles layout", () => {
  it("puts the source dish at the reading start", () => {
    const ltr = pebbleGeometry(272, 136, 33, false);
    const rtl = pebbleGeometry(272, 136, 33, true);
    expect(ltr.source.cx).toBeLessThan(ltr.counted.cx);
    expect(rtl.source.cx).toBeGreaterThan(rtl.counted.cx);
  });

  it("keeps every slot inside its dish", () => {
    const g = pebbleGeometry(272, 136, 33, false);
    for (let i = 0; i < 33; i++) {
      const slot = pebbleSlot(g.source, i, 33, "pits", 1);
      const nx = (slot.x - g.source.cx) / g.source.rx;
      const ny = (slot.y - g.source.cy) / g.source.ry;
      expect(nx * nx + ny * ny).toBeLessThanOrEqual(1);
    }
  });

  it("is deterministic", () => {
    const g = pebbleGeometry(272, 136, 33, false);
    expect(pebbleSlot(g.counted, 5, 33, "stones", 2)).toEqual(
      pebbleSlot(g.counted, 5, 33, "stones", 2),
    );
  });

  it("moves exactly one item per count, keeping the total", () => {
    for (let done = 0; done <= 33; done++) {
      const occ = pebbleOccupancy(33, done);
      expect(occ.source + occ.counted).toBe(33);
      expect(occ.counted).toBe(done);
    }
    expect(pebbleOccupancy(33, 0).moving).toBeNull();
    expect(pebbleOccupancy(33, 5).moving).toEqual({ from: 28, to: 4 });
  });

  it("arcs between the dishes and lands exactly", () => {
    const from = { x: 0, y: 50 };
    const to = { x: 100, y: 50 };
    expect(pebbleArc(from, to, 0, 20)).toEqual(from);
    expect(pebbleArc(from, to, 1, 20).x).toBe(100);
    expect(pebbleArc(from, to, 0.5, 20).y).toBeCloseTo(30);
  });
});

describe("finger layout", () => {
  it("has 10 fingertips over both hands, right hand first", () => {
    const spots = fingerSpots("tips");
    expect(spots).toHaveLength(10);
    expect(spots.slice(0, 5).every((s) => s.side === "right")).toBe(true);
    expect(spots[0]?.finger).toBe("thumb");
    expect(handsFor("tips")).toEqual(["left", "right"]);
  });

  it("has 15 right-hand joints, tip to base on each finger", () => {
    const spots = fingerSpots("joints");
    expect(spots).toHaveLength(15);
    expect(spots.every((s) => s.side === "right")).toBe(true);
    expect(spots.slice(0, 3).map((s) => s.segment)).toEqual([0, 1, 2]);
    expect(handsFor("joints")).toEqual(["right"]);
  });

  it("keeps every spot inside the hand box", () => {
    for (const spot of [...fingerSpots("tips"), ...fingerSpots("joints")]) {
      expect(spot.x).toBeGreaterThan(0);
      expect(spot.x).toBeLessThan(HAND_BOX.width);
      expect(spot.y).toBeGreaterThan(0);
      expect(spot.y).toBeLessThan(HAND_BOX.height);
    }
  });

  it("mirrors the left hand", () => {
    const right = fingersFor("right").find((f) => f.id === "thumb");
    const left = fingersFor("left").find((f) => f.id === "thumb");
    expect(left?.tip.x).toBe(HAND_BOX.width - (right?.tip.x ?? 0));
    expect(palmPath("left")).not.toBe(palmPath("right"));
    expect(palmPath("left").startsWith("M 80 62")).toBe(true);
  });

  it("points an upright capsule along the finger", () => {
    const middle = fingersFor("right").find((f) => f.id === "middle");
    expect(Math.abs(fingerAngle(defined(middle, "middle finger")))).toBeLessThan(1);
    const thumb = fingersFor("right").find((f) => f.id === "thumb");
    // Thumb tip is up and to the right of its base: the capsule turns clockwise.
    expect(fingerAngle(defined(thumb, "thumb"))).toBeGreaterThan(0);
  });
});

describe("rosette", () => {
  it("starts at 12 o'clock and sweeps with the reading direction", () => {
    const ltr = petalAngle(0, 33, false);
    const rtl = petalAngle(0, 33, true);
    expect(Math.cos(ltr)).toBeGreaterThan(0);
    expect(Math.cos(rtl)).toBeLessThan(0);
  });

  it("builds kite petals and a twelve-point star", () => {
    expect(petalPolygon(3, 33, false)).toHaveLength(4);
    const star = starPolygon(12, 5, 0.5);
    expect(star).toHaveLength(24);
    expect(Math.hypot(star[0]?.x ?? 0, star[0]?.y ?? 0)).toBeCloseTo(0.5);
  });
});

describe("constellation", () => {
  it("places one star per mark inside the sky, mirrored in RTL", () => {
    const ltr = constellation(33, false);
    const rtl = constellation(33, true);
    expect(ltr).toHaveLength(33);
    for (const star of ltr) {
      expect(star.x).toBeGreaterThan(0);
      expect(star.x).toBeLessThan(1);
      expect(star.y).toBeGreaterThan(0);
      expect(star.y).toBeLessThan(1);
    }
    expect(rtl[0]?.x).toBeCloseTo(1 - (ltr[0]?.x ?? 0));
  });
});

describe("design notes", () => {
  it("links the pebbles evidence by corpus number (D16 / proof log)", () => {
    const refs = TASBEEH_DESIGN_NOTES.pebbles?.refs.map((r) => `${r.collection}:${r.number}`);
    expect(refs).toEqual(["tirmidhi:3568", "abudawud:1500", "abudawud:1501"]);
  });

  it("cites Abu Dawud 1501 first for finger counting", () => {
    const refs = TASBEEH_DESIGN_NOTES.fingers?.refs.map((r) => `${r.collection}:${r.number}`);
    expect(refs).toEqual(["abudawud:1501", "tirmidhi:3583"]);
  });
});
