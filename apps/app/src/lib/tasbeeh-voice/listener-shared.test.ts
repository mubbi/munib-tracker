import {
  createLevelReporter,
  createMuteWindows,
  msToSamples,
  samplesToMs,
} from "./listener-shared";

describe("listener bookkeeping", () => {
  it("converts between 16 kHz samples and milliseconds", () => {
    expect(samplesToMs(16_000)).toBe(1000);
    expect(msToSamples(1000)).toBe(16_000);
    expect(msToSamples(0.04)).toBe(1);
  });

  it("mutes hits that overlap a window and keeps the newest 16 windows", () => {
    const mutes = createMuteWindows();
    mutes.add(1000, 500);
    expect(mutes.covers({ startMs: 1400, endMs: 1800, score: 0 })).toBe(true);
    expect(mutes.covers({ startMs: 1500, endMs: 1800, score: 0 })).toBe(false);
    expect(mutes.covers({ startMs: 0, endMs: 1000, score: 0 })).toBe(false);
    for (let i = 0; i < 16; i++) mutes.add(10_000 + i * 1000, 10);
    expect(mutes.covers({ startMs: 1400, endMs: 1800, score: 0 })).toBe(false);
  });

  it("reports the level at most every 100 ms of audio", () => {
    const onLevel = jest.fn();
    const report = createLevelReporter(onLevel);
    report(800, -40);
    report(1600, -30);
    report(2000, -20);
    report(3200, -10);
    expect(onLevel.mock.calls).toEqual([[-30], [-10]]);
    expect(() => createLevelReporter(undefined)(5000, 0)).not.toThrow();
  });
});
