import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

import { stopLiveActivity, syncLiveActivity } from "./index";

const mockNative = {
  supported: true,
  running: false,
  start: jest.fn(async () => undefined),
  update: jest.fn(async () => undefined),
  end: jest.fn(async () => undefined),
};
jest.mock("@/lib/live-activity/native", () => ({
  isLiveActivitySupported: () => mockNative.supported,
  isLiveActivityRunning: () => mockNative.running,
  startLiveActivity: (...args: unknown[]) => mockNative.start(...(args as [])),
  updateLiveActivity: (...args: unknown[]) => mockNative.update(...(args as [])),
  endLiveActivity: () => mockNative.end(),
  subscribeLiveActivityLifecycle: jest.fn(),
  subscribeLiveActivityPushTokens: jest.fn(),
}));

const mockRegisterSchedule = jest.fn(async (..._args: unknown[]) => undefined);
jest.mock("@/lib/live-activity/register", () => ({
  registerLiveActivitySchedule: (...args: unknown[]) => mockRegisterSchedule(...args),
  handleLiveActivityPushToken: jest.fn(),
  notifyLiveActivityLifecycle: jest.fn(),
  rememberLiveActivitySnapshot: jest.fn(),
}));

function setup({ supported = true, running = false } = {}) {
  Object.assign(mockNative, { supported, running });
  for (const fn of [mockNative.start, mockNative.update, mockNative.end, mockRegisterSchedule])
    fn.mockClear();
  return { snapshot: buildWidgetSnapshot(), now: new Date("2026-07-03T12:00:00Z") };
}

describe("syncLiveActivity", () => {
  it("does nothing without ActivityKit", async () => {
    const { snapshot } = setup({ supported: false });
    await syncLiveActivity({ snapshot, enabled: true });
    expect(mockNative.start).not.toHaveBeenCalled();
    expect(mockRegisterSchedule).not.toHaveBeenCalled();
  });

  it("starts the activity when enabled and absent, then registers the schedule", async () => {
    const { snapshot, now } = setup();
    await syncLiveActivity({ snapshot, enabled: true, now });
    expect(mockNative.start).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.any(String) }),
    );
    expect(mockRegisterSchedule).toHaveBeenCalledWith(snapshot, true);
  });

  it("updates a running activity", async () => {
    const { snapshot } = setup({ running: true });
    await syncLiveActivity({ snapshot, enabled: true });
    expect(mockNative.update).toHaveBeenCalled();
    expect(mockNative.start).not.toHaveBeenCalled();
  });

  it("ends a running activity when disabled and clears the schedule", async () => {
    const { snapshot } = setup({ running: true });
    await syncLiveActivity({ snapshot, enabled: false });
    expect(mockNative.end).toHaveBeenCalled();
    expect(mockRegisterSchedule).toHaveBeenCalledWith(snapshot, false);
  });

  it("does not end an activity that is not running", async () => {
    const { snapshot } = setup();
    await syncLiveActivity({ snapshot, enabled: false });
    expect(mockNative.end).not.toHaveBeenCalled();
  });
});

describe("stopLiveActivity", () => {
  it.each([
    [{ supported: true, running: true }, 1],
    [{ supported: true, running: false }, 0],
    [{ supported: false, running: true }, 0],
  ])("with %o ends %i time(s)", async (state, calls) => {
    setup(state);
    await stopLiveActivity();
    expect(mockNative.end).toHaveBeenCalledTimes(calls);
  });
});
