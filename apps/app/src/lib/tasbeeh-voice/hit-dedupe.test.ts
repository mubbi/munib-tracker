import { createHitTracker, mergeHits } from "./hit-dedupe";

const hit = (startMs: number, endMs: number, score = -0.1) => ({ startMs, endMs, score });

describe("hit de-dupe", () => {
  it("keeps the best of overlapping candidates", () => {
    const merged = mergeHits([hit(100, 600, -0.3), hit(120, 640, -0.1), hit(100, 700, -0.2)], 300);
    expect(merged).toEqual([hit(120, 640, -0.1)]);
  });

  it("merges hits that start closer than the phrase's minimum length", () => {
    expect(mergeHits([hit(0, 200), hit(250, 450, -0.2)], 400)).toHaveLength(1);
  });

  it("keeps back-to-back phrases that do not overlap", () => {
    expect(mergeHits([hit(0, 500), hit(500, 1000), hit(1000, 1500)], 400)).toHaveLength(3);
  });

  it("never double counts across overlapping windows", () => {
    const tracker = createHitTracker(400);
    // Window 1 (0–3000 ms) sees the phrase at 1000–1600, settled up to 2520.
    expect(tracker.offer([hit(1000, 1600, -0.2)], 2520)).toHaveLength(1);
    // Window 2 (1000–4000 ms) sees the same phrase again (slightly different
    // alignment, even a better score) plus a new one.
    const second = tracker.offer([hit(1040, 1640, -0.05), hit(3000, 3600)], 3700);
    expect(second).toEqual([hit(3000, 3600)]);
    expect(tracker.flush()).toHaveLength(0);
    expect(tracker.committed).toHaveLength(2);
  });

  it("holds a hit near the window edge until a later window settles it", () => {
    const tracker = createHitTracker(400);
    expect(tracker.offer([hit(2600, 2980, -0.4)], 2520)).toHaveLength(0);
    // The next window sees the whole phrase with a better score.
    expect(tracker.offer([hit(2600, 3200, -0.1)], 3520)).toEqual([hit(2600, 3200, -0.1)]);
    expect(tracker.flush()).toHaveLength(0);
  });

  it("commits pending hits on flush", () => {
    const tracker = createHitTracker(400);
    tracker.offer([hit(2600, 2980)], 2520);
    expect(tracker.flush()).toHaveLength(1);
  });

  it("forgets everything on reset", () => {
    const tracker = createHitTracker(400);
    tracker.offer([hit(0, 500)], 1000);
    tracker.reset();
    expect(tracker.committed).toHaveLength(0);
    expect(tracker.offer([hit(0, 500)], 1000)).toHaveLength(1);
  });
});
