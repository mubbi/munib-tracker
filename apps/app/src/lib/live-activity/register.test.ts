import { buildStoredSession } from "@/test-support/fixtures/auth";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

type Register = typeof import("./register");

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);

// Mocked (not spied): each test loads `./register` in an isolated registry.
const mockGetSession = jest.fn();
jest.mock("@/auth/session-store", () => ({ SessionStore: { get: () => mockGetSession() } }));

const UPDATES = [{ phase: "countdown", executeAt: "2026-07-03T12:00:00.000Z" }];
const mockBuildSchedule = jest.fn((..._args: unknown[]) => UPDATES);
jest.mock("@/lib/live-activity/schedule", () => ({
  buildLiveActivityPushSchedule: (...args: unknown[]) => mockBuildSchedule(...args),
}));

const TOKEN = "AB".repeat(32);
const tokenEvent = (overrides: Partial<{ activityId: string; pushToken: string }> = {}) => ({
  activityId: "act-1",
  pushToken: TOKEN,
  environment: "production" as const,
  ...overrides,
});

let mockApiFetch: jest.Mock;

/**
 * Fresh module state (pending registration, last key, flush chain) per test.
 * The isolated registry has its own `mockApiFetch`, exposed for assertions.
 */
function setup(): Register {
  let mod: Register | undefined;
  jest.isolateModules(() => {
    mod = require("./register");
    mockApiFetch = require("@/test-support/mocks/api-client").mockApiFetch;
  });
  mockApiFetch.mockResolvedValue(undefined);
  return mod as Register;
}

const flush = () => new Promise((r) => setImmediate(r));
const putBodies = () =>
  mockApiFetch.mock.calls.map(([req]) => JSON.parse((req as { body: string }).body));

beforeEach(() => {
  mockBuildSchedule.mockClear().mockReturnValue(UPDATES);
  mockGetSession.mockReset().mockResolvedValue(buildStoredSession());
});

describe("push-token registration", () => {
  it("waits for a snapshot before registering", async () => {
    const register = setup();
    register.handleLiveActivityPushToken(tokenEvent());
    await flush();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("registers the lower-cased token with the schedule once a snapshot arrives", async () => {
    const register = setup();
    register.handleLiveActivityPushToken(tokenEvent());
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    await flush();
    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/live-activities", method: "PUT" }),
      { accessToken: "access-user" },
    );
    expect(putBodies()[0]).toEqual({
      activityId: "act-1",
      pushToken: TOKEN.toLowerCase(),
      environment: "production",
      updates: UPDATES,
    });
  });

  it("uses a snapshot remembered before the token arrived", async () => {
    const register = setup();
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    register.handleLiveActivityPushToken(tokenEvent());
    await flush();
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it("does not re-send an identical registration", async () => {
    const register = setup();
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    register.handleLiveActivityPushToken(tokenEvent());
    await register.registerLiveActivitySchedule(buildWidgetSnapshot(), true);
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["the token is malformed", () => tokenEvent({ pushToken: "not-hex" }), {}],
    ["location is denied", () => tokenEvent(), { locationDenied: true }],
  ])("skips when %s", async (_label, event, snapshot) => {
    const register = setup();
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot(snapshot));
    register.handleLiveActivityPushToken(event());
    await flush();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("skips when the schedule is empty", async () => {
    mockBuildSchedule.mockReturnValue([]);
    const register = setup();
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    register.handleLiveActivityPushToken(tokenEvent());
    await flush();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("skips when signed out", async () => {
    mockGetSession.mockResolvedValue(null);
    const register = setup();
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    register.handleLiveActivityPushToken(tokenEvent());
    await flush();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("retries after a failed PUT", async () => {
    const register = setup();
    mockApiFetch.mockRejectedValueOnce(new Error("offline"));
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    register.handleLiveActivityPushToken(tokenEvent());
    await flush();
    await register.registerLiveActivitySchedule(buildWidgetSnapshot(), true);
    expect(mockApiFetch).toHaveBeenCalledTimes(2);
  });
});

describe("registerLiveActivitySchedule", () => {
  it("does nothing without a pending token", async () => {
    const register = setup();
    await register.registerLiveActivitySchedule(buildWidgetSnapshot(), true);
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("clears the pending registration when disabled", async () => {
    const register = setup();
    register.handleLiveActivityPushToken(tokenEvent());
    await register.registerLiveActivitySchedule(buildWidgetSnapshot(), false);
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    await flush();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });
});

describe("notifyLiveActivityLifecycle", () => {
  it("reports the end state for the activity", async () => {
    const register = setup();
    await register.notifyLiveActivityLifecycle("act/1", "dismissed");
    expect(mockApiFetch).toHaveBeenCalledWith(
      { url: "/live-activities/act%2F1/lifecycle", method: "PUT", body: '{"state":"dismissed"}' },
      { accessToken: "access-user" },
    );
  });

  it("drops a pending registration for the same activity", async () => {
    const register = setup();
    register.handleLiveActivityPushToken(tokenEvent());
    await register.notifyLiveActivityLifecycle("act-1", "ended");
    register.rememberLiveActivitySnapshot(buildWidgetSnapshot());
    await flush();
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it("skips when signed out and swallows API errors", async () => {
    const register = setup();
    mockGetSession.mockResolvedValueOnce(null);
    await register.notifyLiveActivityLifecycle("act-1", "ended");
    expect(mockApiFetch).not.toHaveBeenCalled();
    mockApiFetch.mockRejectedValueOnce(new Error("500"));
    await expect(register.notifyLiveActivityLifecycle("act-1", "ended")).resolves.toBeUndefined();
  });
});
