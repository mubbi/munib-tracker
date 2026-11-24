import { createScanStartLimiter, scanStartDelay } from "./scan-throttle";

const LIMIT = { maxStarts: 5, windowMs: 30_000 };

describe("scanStartDelay", () => {
  it("allows up to five starts inside the window", () => {
    expect(scanStartDelay([], 0, LIMIT)).toBe(0);
    expect(scanStartDelay([0, 1_000, 2_000, 3_000], 4_000, LIMIT)).toBe(0);
  });

  it("delays a sixth start until the oldest counted start leaves the window", () => {
    expect(scanStartDelay([0, 1_000, 2_000, 3_000, 4_000], 5_000, LIMIT)).toBe(25_000);
    expect(scanStartDelay([0, 1_000, 2_000, 3_000, 4_000], 30_000, LIMIT)).toBe(0);
  });

  it("ignores starts older than the window", () => {
    expect(scanStartDelay([-60_000, -50_000, 0, 1_000, 2_000, 3_000], 4_000, LIMIT)).toBe(0);
  });
});

describe("createScanStartLimiter", () => {
  it("records starts, prunes old ones and resets", () => {
    const limiter = createScanStartLimiter(LIMIT);
    for (let at = 0; at < 5_000; at += 1_000) limiter.record(at);
    expect(limiter.delay(5_000)).toBe(25_000);
    limiter.record(40_000);
    expect(limiter.delay(40_000)).toBe(0);
    for (let at = 41_000; at < 45_000; at += 1_000) limiter.record(at);
    expect(limiter.delay(45_000)).toBe(25_000);
    limiter.reset();
    expect(limiter.delay(45_000)).toBe(0);
  });
});
