import { handleExternalCommand } from "./handle-external-command";
import type { ExternalCommand } from "./types";

type TrackerState = {
  isReady: boolean;
  load: jest.Mock;
  excusedReason: string | null;
  date: string;
  prayerStatus: Record<string, string>;
  setPrayerStatus: jest.Mock;
};

const mockTracker: { state: TrackerState } = { state: {} as TrackerState };
const mockLocation = { state: { isReady: true, load: jest.fn(), location: { lat: 0 } } };
const mockResolveMarkable = jest.fn();

jest.mock("@/stores/tracker-store", () => ({
  trackerStore: { getState: () => mockTracker.state },
}));
jest.mock("@/stores/location-store", () => ({
  locationStore: { getState: () => mockLocation.state },
}));
jest.mock("./resolve-markable-prayer", () => ({
  ...jest.requireActual("./resolve-markable-prayer"),
  resolveMarkableObligatoryPrayer: (...args: unknown[]) => mockResolveMarkable(...args),
}));

const TODAY = "2026-07-03";
const markPrayer = (overrides: Partial<Extract<ExternalCommand, { type: "mark-prayer" }>> = {}) =>
  ({ type: "mark-prayer", prayerId: "asr", date: TODAY, ...overrides }) as ExternalCommand;

function setup(overrides: Partial<TrackerState> = {}) {
  mockTracker.state = {
    isReady: true,
    load: jest.fn(async () => undefined),
    excusedReason: null,
    date: TODAY,
    prayerStatus: {},
    setPrayerStatus: jest.fn(async () => undefined),
    ...overrides,
  };
  mockLocation.state = {
    isReady: true,
    load: jest.fn(async () => undefined),
    location: { lat: 0 },
  };
  mockResolveMarkable.mockReset().mockReturnValue("dhuhr");
  return mockTracker.state;
}

describe("handleExternalCommand", () => {
  it("defers without touching stores when locked", async () => {
    const tracker = setup();
    expect(await handleExternalCommand({ type: "mark-current-obligatory" }, { defer: true })).toBe(
      "deferred",
    );
    expect(tracker.setPrayerStatus).not.toHaveBeenCalled();
  });

  it("loads stores that are not ready yet", async () => {
    const tracker = setup({ isReady: false });
    mockLocation.state.isReady = false;
    tracker.load.mockImplementation(async () => {
      tracker.isReady = true;
    });
    await handleExternalCommand(markPrayer());
    expect(tracker.load).toHaveBeenCalled();
    expect(mockLocation.state.load).toHaveBeenCalled();
  });

  it("fails when the tracker never becomes ready", async () => {
    setup({ isReady: false });
    expect(await handleExternalCommand(markPrayer())).toEqual({ ok: false, reason: "not_ready" });
  });

  it("refuses while excused", async () => {
    setup({ excusedReason: "travel" });
    expect(await handleExternalCommand(markPrayer())).toEqual({ ok: false, reason: "excused" });
  });

  it("marks the current markable Salah", async () => {
    const tracker = setup();
    const now = new Date("2026-07-03T13:00:00Z");
    expect(await handleExternalCommand({ type: "mark-current-obligatory" }, { now })).toEqual({
      ok: true,
      prayerId: "dhuhr",
    });
    expect(mockResolveMarkable).toHaveBeenCalledWith({ lat: 0 }, now, {});
    expect(tracker.setPrayerStatus).toHaveBeenCalledWith("dhuhr", "completed");
  });

  it("reports already_done when nothing is markable", async () => {
    setup();
    mockResolveMarkable.mockReturnValue(null);
    expect(await handleExternalCommand({ type: "mark-current-obligatory" })).toEqual({
      ok: false,
      reason: "already_done",
    });
  });

  it("marks a specific Salah for today", async () => {
    const tracker = setup();
    expect(await handleExternalCommand(markPrayer())).toEqual({ ok: true, prayerId: "asr" });
    expect(tracker.setPrayerStatus).toHaveBeenCalledWith("asr", "completed");
  });

  it.each([
    ["another day", markPrayer({ date: "2026-07-02" }), "invalid_date"],
    ["a non-obligatory prayer", markPrayer({ prayerId: "witr" as never }), "invalid_prayer"],
    ["a route command", { type: "open-route", href: "/" } as ExternalCommand, "invalid_prayer"],
  ])("rejects %s", async (_label, command, reason) => {
    setup();
    expect(await handleExternalCommand(command)).toEqual({ ok: false, reason });
  });

  it("reports an already-completed Salah without writing", async () => {
    const tracker = setup({ prayerStatus: { asr: "completed" } });
    expect(await handleExternalCommand(markPrayer())).toEqual({
      ok: true,
      prayerId: "asr",
      alreadyCompleted: true,
    });
    expect(tracker.setPrayerStatus).not.toHaveBeenCalled();
  });
});
