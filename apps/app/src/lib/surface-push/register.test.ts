import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  buildSalahPhaseBoundary,
  buildSalahTrackingSession,
} from "@/test-support/fixtures/salah-phase";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";
import { usePlatform } from "@/test-support/platform";

type Register = typeof import("./register");

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);
jest.mock("@/auth/session-store", () => ({
  SessionStore: { getDeviceId: async () => "device-1" },
}));
const mockBuildSchedule = jest.fn();
jest.mock("@/lib/salah-phase", () => ({
  ...jest.requireActual("@/lib/salah-phase"),
  buildSalahPhaseSchedule: (...args: unknown[]) => mockBuildSchedule(...args),
}));
const mockApplyPhase = jest.fn(async (_json: string) => undefined);
jest.mock("@/lib/external-commands/native-bridge", () => ({
  nativeApplyOngoingPhasePayload: (json: string) => mockApplyPhase(json),
}));

const mockPreferencesGet = jest.fn();
jest.mock("@/db", () => ({ PreferencesRepository: { get: () => mockPreferencesGet() } }));

const REGISTRATION_KEY = "@munib_tracker_surface_push_registration_id";

let mockApiFetch: jest.Mock;

/** Fresh module (in-memory registration id) per test, with its isolated `mockApiFetch`. */
function setup(): Register {
  let mod: Register | undefined;
  jest.isolateModules(() => {
    mod = require("./register");
    mockApiFetch = require("@/test-support/mocks/api-client").mockApiFetch;
  });
  mockApiFetch.mockResolvedValue({ registrationId: 7, channel: "web_push", scheduled: 1 });
  return mod as Register;
}

function registerInput(channel: "expo" | "web_push") {
  return {
    accessToken: "access",
    channel,
    target: "token",
    session: buildSalahTrackingSession(),
    snapshot: buildWidgetSnapshot(),
    stopLabel: "Stop",
  };
}

const requestBody = (call = 0) => JSON.parse(mockApiFetch.mock.calls[call][0].body);

beforeEach(async () => {
  await AsyncStorage.clear();
  mockBuildSchedule.mockReset().mockReturnValue([buildSalahPhaseBoundary()]);
  mockApplyPhase.mockClear();
  mockPreferencesGet.mockReset().mockRejectedValue(new Error("db unavailable"));
});

describe("registerSurfacePushSchedule", () => {
  it("returns null when there is nothing to schedule", async () => {
    mockBuildSchedule.mockReturnValue([]);
    expect(await setup().registerSurfacePushSchedule(registerInput("web_push"))).toBeNull();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("puts Web Push payloads with a 2-day horizon and remembers the id", async () => {
    const register = setup();
    const result = await register.registerSurfacePushSchedule(registerInput("web_push"));
    expect(result).toMatchObject({ registrationId: 7 });
    expect(mockBuildSchedule.mock.calls[0][0]).toMatchObject({ horizonMs: 2 * 24 * 60 * 60_000 });
    const body = requestBody();
    expect(body).toMatchObject({
      channel: "web_push",
      target: "token",
      sessionId: "session-1",
      deviceId: "device-1",
    });
    expect(body.updates[0].payload).toMatchObject({
      type: "salah_phase",
      tag: "salah-session-1-asr",
      actions: [
        { action: "open", title: "Mark Salah" },
        { action: "dismiss", title: "Stop" },
      ],
    });
    expect(register.getLastSurfaceRegistrationId()).toBe(7);
    expect(await AsyncStorage.getItem(REGISTRATION_KEY)).toBe("7");
  });

  it("puts ongoing-notification payloads for Expo", async () => {
    await setup().registerSurfacePushSchedule(registerInput("expo"));
    expect(mockBuildSchedule.mock.calls[0][0].horizonMs).toBeUndefined();
    expect(requestBody().updates[0].payload).toMatchObject({ sessionId: "session-1" });
  });

  it("keeps the in-memory id when storage fails", async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error("disk"));
    const register = setup();
    await register.registerSurfacePushSchedule(registerInput("web_push"));
    expect(register.getLastSurfaceRegistrationId()).toBe(7);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("does nothing", async () => {
      expect(await setup().registerSurfacePushSchedule(registerInput("expo"))).toBeNull();
    });
  });
});

describe("ending / deleting a registration", () => {
  it.each([
    ["endSurfacePushRegistration", "/surface-push/7/lifecycle", "PUT"],
    ["deleteSurfacePushRegistration", "/surface-push/7", "DELETE"],
  ] as const)("%s uses the id stored by an earlier run", async (fn, url, method) => {
    await AsyncStorage.setItem(REGISTRATION_KEY, "7");
    await setup()[fn]("access");
    expect(mockApiFetch).toHaveBeenCalledWith(expect.objectContaining({ url, method }), {
      accessToken: "access",
    });
    expect(await AsyncStorage.getItem(REGISTRATION_KEY)).toBeNull();
  });

  it("sends the requested lifecycle state for an explicit id", async () => {
    await setup().endSurfacePushRegistration("access", 9, "dismissed");
    expect(mockApiFetch.mock.calls[0][0]).toMatchObject({
      url: "/surface-push/9/lifecycle",
      body: '{"state":"dismissed"}',
    });
  });

  it.each(["endSurfacePushRegistration", "deleteSurfacePushRegistration"] as const)(
    "%s keeps the id when the API call fails",
    async (fn) => {
      await AsyncStorage.setItem(REGISTRATION_KEY, "7");
      const register = setup();
      mockApiFetch.mockRejectedValueOnce(new Error("offline"));
      await register[fn]("access");
      expect(await AsyncStorage.getItem(REGISTRATION_KEY)).toBe("7");
    },
  );

  it("keeps a newer remembered id when ending an explicit older one", async () => {
    const register = setup();
    await register.registerSurfacePushSchedule(registerInput("web_push"));
    await register.endSurfacePushRegistration("access", 3);
    expect(register.getLastSurfaceRegistrationId()).toBe(7);
  });

  it.each([
    ["nothing is stored", null],
    ["the stored id is invalid", "abc"],
  ])("does nothing when %s", async (_label, stored) => {
    if (stored) await AsyncStorage.setItem(REGISTRATION_KEY, stored);
    await setup().deleteSurfacePushRegistration("access");
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("treats unreadable storage as no id", async () => {
    jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error("disk"));
    await setup().endSurfacePushRegistration("access");
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("does nothing", async () => {
      const register = setup();
      await register.endSurfacePushRegistration("access", 1);
      await register.deleteSurfacePushRegistration("access", 1);
      expect(mockApiFetch).not.toHaveBeenCalled();
    });
  });
});

describe("handleSurfacePhaseDataMessage", () => {
  const payload = JSON.stringify({ sessionId: "ambient" });

  it("ignores data messages off Android", async () => {
    await setup().handleSurfacePhaseDataMessage({ type: "salah_phase", payload });
    expect(mockApplyPhase).not.toHaveBeenCalled();
  });

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    it.each([
      ["a string payload", { type: "salah_phase", payload }],
      ["a payloadJson field", { type: "salah_surface_phase", payloadJson: payload }],
    ])("applies %s", async (_label, data) => {
      await setup().handleSurfacePhaseDataMessage(data);
      expect(mockApplyPhase).toHaveBeenCalledWith(payload);
    });

    it("fails open when the session store cannot be read", async () => {
      const sessionPayload = JSON.stringify({ sessionId: "session-1" });
      await setup().handleSurfacePhaseDataMessage({ type: "salah_phase", payload: sessionPayload });
      expect(mockApplyPhase).toHaveBeenCalledWith(sessionPayload);
    });

    describe("for a tracked session", () => {
      const sessionPayload = JSON.stringify({ sessionId: "session-1" });
      const future = new Date(Date.now() + 60_000).toISOString();
      const past = new Date(Date.now() - 60_000).toISOString();

      function withSession(overrides: Parameters<typeof buildSalahTrackingSession>[0]) {
        mockPreferencesGet.mockResolvedValue({
          salahTrackingSession: buildSalahTrackingSession({ endsAt: future, ...overrides }),
        });
      }

      it("applies the phase while the session is still active", async () => {
        withSession({});
        await setup().handleSurfacePhaseDataMessage({
          type: "salah_phase",
          payload: sessionPayload,
        });
        expect(mockApplyPhase).toHaveBeenCalledWith(sessionPayload);
      });

      it.each([
        ["another session", { sessionId: "session-2" }],
        ["a dismissed session", { dismissed: true }],
        ["an ended session", { endsAt: past }],
        ["an ended session status", { status: "ended" as const }],
      ])("drops a late push for %s", async (_label, overrides) => {
        withSession(overrides);
        await setup().handleSurfacePhaseDataMessage({
          type: "salah_phase",
          payload: sessionPayload,
        });
        expect(mockApplyPhase).not.toHaveBeenCalled();
      });
    });

    it.each([
      ["no data", undefined],
      ["another message type", { type: "chat", payload }],
      ["no payload", { type: "salah_phase" }],
      ["malformed JSON", { type: "salah_phase", payload: "{bad" }],
    ])("ignores %s", async (_label, data) => {
      await setup().handleSurfacePhaseDataMessage(data);
      expect(mockApplyPhase).not.toHaveBeenCalled();
    });
  });
});
