import {
  buildStrand,
  DRAG_DETENT,
  dragStep,
  edgeOpacity,
  itemKind,
  itemOffset,
  itemProgressFor,
  lapOf,
  MAX_VISIBLE_ITEMS,
  pathPoint,
  projectDrag,
  resolveStrand,
  spacerAfter,
  strandCountEvent,
  strandGeometry,
  threadPath,
  visibleItems,
} from "./bead-layout";

describe("resolveStrand", () => {
  it.each([
    [33, { beads: 33, imamCounts: false, loop: false }],
    [99, { beads: 99, imamCounts: false, loop: false }],
    [100, { beads: 99, imamCounts: true, loop: false }],
    [0, { beads: 33, imamCounts: false, loop: true }],
    [313, { beads: 33, imamCounts: false, loop: true }],
  ])("auto strand for target %i", (target, expected) => {
    expect(resolveStrand("auto", target)).toEqual(expected);
  });

  it("loops a fixed strand that is shorter than the target", () => {
    expect(resolveStrand(33, 99)).toEqual({ beads: 33, imamCounts: false, loop: true });
    expect(resolveStrand(99, 33)).toEqual({ beads: 99, imamCounts: false, loop: true });
    expect(resolveStrand(99, 100)).toEqual({ beads: 99, imamCounts: true, loop: false });
    expect(resolveStrand(33, 33)).toEqual({ beads: 33, imamCounts: false, loop: false });
  });
});

describe("buildStrand", () => {
  it("places spacers after the 11th and 22nd of 33, and 33rd and 66th of 99", () => {
    expect(spacerAfter(33)).toEqual([10, 21]);
    expect(spacerAfter(99)).toEqual([32, 65]);
  });

  it("builds a 33 strand: 33 beads, 2 spacers, an imam that rides with the last bead", () => {
    const model = buildStrand({ beads: 33, imamCounts: false, loop: false });
    expect(model.unitsPerLap).toBe(33);
    expect(model.itemsPerLap).toBe(36);
    expect(model.kinds.filter((k) => k === "spacer")).toHaveLength(2);
    expect(model.kinds[model.itemsPerLap - 1]).toBe("imam");
    expect(model.kinds[11]).toBe("spacer");
    expect(model.unitSize[10]).toBe(2);
    expect(model.unitSize[32]).toBe(2);
    expect(model.spacerUnit.filter(Boolean)).toHaveLength(2);
  });

  it("makes the imam the 100th count in 100-mode", () => {
    const model = buildStrand(resolveStrand("auto", 100));
    expect(model.unitsPerLap).toBe(100);
    expect(model.unitSize[99]).toBe(1);
    expect(model.kinds[model.unitStart[99]]).toBe("imam");
  });

  it("drops spacers when they are off", () => {
    const model = buildStrand(resolveStrand("auto", 33), { spacers: false });
    expect(model.itemsPerLap).toBe(34);
    expect(model.spacerUnit.some(Boolean)).toBe(false);
  });
});

describe("strand events and laps", () => {
  const model33 = buildStrand(resolveStrand("auto", 33));
  const loop = buildStrand(resolveStrand("auto", 0));

  it("marks the counts that move a spacer", () => {
    expect(strandCountEvent(model33, 11)).toBe("spacer");
    expect(strandCountEvent(model33, 22)).toBe("spacer");
    expect(strandCountEvent(model33, 12)).toBe("bead");
    expect(strandCountEvent(model33, 1)).toBe("bead");
  });

  it("marks laps on a looping strand", () => {
    expect(strandCountEvent(loop, 33)).toBe("lap");
    expect(strandCountEvent(loop, 44)).toBe("spacer");
    expect(lapOf(loop, 32)).toBe(0);
    expect(lapOf(loop, 33)).toBe(1);
    expect(lapOf(loop, 70)).toBe(2);
    expect(lapOf(model33, 33)).toBe(0);
  });

  it("knows which items exist", () => {
    expect(itemKind(model33, -1)).toBeNull();
    expect(itemKind(model33, 36)).toBeNull();
    expect(itemKind(model33, 0)).toBe("bead");
    expect(itemKind(loop, 36)).toBe("bead");
  });
});

describe("item progress and offsets", () => {
  const model = buildStrand(resolveStrand("auto", 33));

  it("moves a spacer unit as two items", () => {
    expect(itemProgressFor(model, 0)).toBe(0);
    expect(itemProgressFor(model, 10)).toBe(10);
    expect(itemProgressFor(model, 10.5)).toBe(11);
    expect(itemProgressFor(model, 11)).toBe(12);
    expect(itemProgressFor(model, 33)).toBe(36);
    expect(itemProgressFor(model, 40)).toBe(36);
  });

  it("is continuous across a count", () => {
    const gapStart = 100;
    const gapEnd = 160;
    const pitch = 24;
    for (const a of [3, 4, 5]) {
      const before = itemOffset(a, 4 - 1e-6, gapStart, gapEnd, pitch);
      const after = itemOffset(a, 4 + 1e-6, gapStart, gapEnd, pitch);
      expect(Math.abs(before - after)).toBeLessThan(0.01);
    }
  });

  it("stacks uncounted items before the gap and counted ones after it", () => {
    expect(itemOffset(5, 5, 100, 160, 24)).toBe(100); // next to count
    expect(itemOffset(6, 5, 100, 160, 24)).toBe(76);
    expect(itemOffset(4, 5, 100, 160, 24)).toBe(160); // newest counted
    expect(itemOffset(3, 5, 100, 160, 24)).toBe(184);
    expect(itemOffset(5, 5.5, 100, 160, 24)).toBe(130); // crossing
  });
});

describe("geometry", () => {
  it.each(["arc", "horizontal", "loop"] as const)("keeps the %s gap on the thread", (layout) => {
    const g = strandGeometry(layout, 272, 272, 23);
    expect(g.length).toBeGreaterThan(0);
    expect(g.gapStart).toBeGreaterThan(0);
    expect(g.gapEnd).toBeLessThan(g.length);
    expect(g.gapEnd - g.gapStart).toBeGreaterThan(g.pitch);
    expect(g.pitch).toBeGreaterThanOrEqual(23);
  });

  it("keeps points inside the stage", () => {
    for (const layout of ["arc", "horizontal", "loop"] as const) {
      const g = strandGeometry(layout, 272, 223, 23);
      for (let s = 0; s <= g.length; s += g.length / 10) {
        const p = pathPoint(layout, s, 272, 223, 23, false);
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(272);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(223);
      }
    }
  });

  it("runs the arc downwards and the loop over the top", () => {
    const arc = strandGeometry("arc", 272, 272, 23);
    expect(pathPoint("arc", 0, 272, 272, 23, false).y).toBeLessThan(
      pathPoint("arc", arc.length, 272, 272, 23, false).y,
    );
    const loop = strandGeometry("loop", 272, 272, 23);
    expect(pathPoint("loop", loop.length / 2, 272, 272, 23, false).y).toBeLessThan(136);
  });

  it("mirrors the horizontal strand in RTL only", () => {
    const ltr = pathPoint("horizontal", 10, 272, 223, 23, false);
    const rtl = pathPoint("horizontal", 10, 272, 223, 23, true);
    expect(rtl.x).toBeCloseTo(272 - ltr.x);
    expect(rtl.y).toBeCloseTo(ltr.y);
    expect(strandGeometry("arc", 272, 272, 23, true).rtl).toBe(false);
    expect(strandGeometry("horizontal", 272, 223, 23, true).rtl).toBe(true);
  });

  it("draws an SVG thread", () => {
    const d = threadPath(strandGeometry("loop", 200, 200, 17), 8);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
  });

  it("fades items at the thread ends", () => {
    expect(edgeOpacity(-1, 100, 20)).toBe(0);
    expect(edgeOpacity(5, 100, 20)).toBe(0.5);
    expect(edgeOpacity(50, 100, 20)).toBe(1);
    expect(edgeOpacity(101, 100, 20)).toBe(0);
  });
});

describe("virtual window", () => {
  it.each([
    [33, 0],
    [33, 17],
    [99, 50],
    [100, 99],
    [0, 500],
  ])("draws at most %#'s ~20 items around the gap", (target, count) => {
    const model = buildStrand(resolveStrand("auto", target));
    const g = strandGeometry("arc", 272, 272, 23);
    const items = visibleItems(model, g, count);
    expect(items.length).toBeLessThanOrEqual(MAX_VISIBLE_ITEMS);
    expect(items.length).toBeGreaterThan(0);
    for (const a of items) expect(itemKind(model, a)).not.toBeNull();
  });

  it("never draws items before the first bead of a finite strand", () => {
    const model = buildStrand(resolveStrand("auto", 33));
    const items = visibleItems(model, strandGeometry("arc", 272, 272, 23), 0);
    expect(Math.min(...items)).toBe(0);
  });
});

describe("drag", () => {
  const geometry = { pitch: 24, gapStart: 100, gapEnd: 160 };

  it("projects along the counting direction", () => {
    expect(projectDrag("arc", 30, 12, false)).toBe(12);
    expect(projectDrag("horizontal", 30, 12, false)).toBe(30);
    expect(projectDrag("horizontal", 30, 12, true)).toBe(-30);
    expect(projectDrag("loop", 30, 12, true)).toBe(30);
  });

  it("counts once past the detent", () => {
    const state = { counted: false };
    expect(dragStep(state, DRAG_DETENT * 24 - 1, geometry).count).toBe(false);
    expect(dragStep(state, DRAG_DETENT * 24, geometry).count).toBe(true);
    // A fast flick keeps moving: still one count.
    expect(dragStep(state, 200, geometry).count).toBe(false);
    expect(dragStep(state, 400, geometry).count).toBe(false);
  });

  it("never counts or moves backwards", () => {
    const state = { counted: false };
    const step = dragStep(state, -80, geometry);
    expect(step).toEqual({ fraction: 0, count: false });
    expect(state.counted).toBe(false);
  });

  it("lets the bead follow the finger before the detent", () => {
    const state = { counted: false };
    expect(dragStep(state, 6, geometry).fraction).toBeCloseTo(0.1);
  });
});
