import { ApiError } from "@munib-tracker/api-client";
import {
  NEARBY_ERROR_CODES,
  NEARBY_LIMITS,
  NEARBY_SERVICE_UUID_PREFIX,
  nearbyServiceUuid,
} from "@munib-tracker/shared/circles/nearby";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { captureAppStateListener } from "@/test-support/app-state";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import {
  createQueryWrapper,
  emitNearby,
  makeNearbyPreview,
  mockNearbyNative,
  mockNearbyPermissions,
  NEARBY_SESSION_ID,
  nearbyNativeError,
  resetNearbyMocks,
} from "@/test-support/nearby";
import { setPlatform } from "@/test-support/platform";

jest.mock("@/lib/nearby/native", () => require("@/test-support/nearby").nearbyNativeMock);
jest.mock("@/lib/nearby/permissions", () => require("@/test-support/nearby").nearbyPermissionsMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/lib/circles/child-session", () => ({
  saveChildSession: jest.fn(async () => undefined),
}));
jest.mock("@/lib/circles/api", () => ({
  ...jest.requireActual("@/lib/circles/api"),
  previewNearbySession: jest.fn(),
  requestNearbyJoin: jest.fn(),
  nearbyRequestStatus: jest.fn(),
  cancelNearbyRequest: jest.fn(async () => undefined),
}));

import type { NearbyPurpose } from "@munib-tracker/shared/circles/nearby";
import * as api from "@/lib/circles/api";
import { saveChildSession } from "@/lib/circles/child-session";

import { ANDROID_SCAN_START_LIMIT, nearbyScanStartLimiter } from "./scan-throttle";
import { nearbyJoinErrorOf, useNearbyJoin } from "./use-nearby-join";

const appState = captureAppStateListener();
const UUID = nearbyServiceUuid(NEARBY_SESSION_ID);
const CREATED = {
  requestId: "r-1",
  requestToken: "mtn_secret_secret_secret",
  status: "pending" as const,
  expiresAt: "2026-11-24T10:10:00Z",
};

beforeEach(() => {
  resetNearbyMocks();
  resetAuthMock();
  setMockAuth({
    session: { accessToken: "tok", userId: "u-1" },
    isAuthenticated: true,
    isGuest: false,
  });
  jest.mocked(api.previewNearbySession).mockReset().mockResolvedValue(makeNearbyPreview());
  jest.mocked(api.requestNearbyJoin).mockReset().mockResolvedValue(CREATED);
  jest
    .mocked(api.nearbyRequestStatus)
    .mockReset()
    .mockResolvedValue({ status: "pending", circleType: "khatm_group", circleId: null });
  jest.mocked(api.cancelNearbyRequest).mockClear();
  jest.mocked(saveChildSession).mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

async function setup(purpose: NearbyPurpose = "member") {
  const { QueryWrapper } = createQueryWrapper();
  const hook = await renderHook(() => useNearbyJoin({ purpose }), { wrapper: QueryWrapper });
  await act(async () => {
    await hook.result.current.start();
  });
  return hook;
}

async function discover(hook: Awaited<ReturnType<typeof setup>>, rssi = -55) {
  await act(async () => {
    emitNearby("onDiscovered", { serviceUuid: UUID, rssi });
  });
  await waitFor(() => expect(hook.result.current.items).toHaveLength(1));
}

async function askAndWait(hook: Awaited<ReturnType<typeof setup>>, displayName?: string) {
  await act(async () => {
    hook.result.current.select(NEARBY_SESSION_ID);
  });
  await act(async () => {
    await hook.result.current.confirm(displayName);
  });
}

async function pollOnce() {
  await act(async () => {
    jest.advanceTimersByTime(NEARBY_LIMITS.pollMs);
  });
  await act(async () => {
    await Promise.resolve();
  });
}

describe("useNearbyJoin", () => {
  it("scans for the app prefix only while open, and previews each beacon once", async () => {
    const hook = await setup();
    expect(hook.result.current.state).toEqual({ kind: "scanning" });
    expect(mockNearbyNative.startNearbyScanning).toHaveBeenCalledWith(
      NEARBY_SERVICE_UUID_PREFIX,
      NEARBY_LIMITS.sessionTtlMinutes * 60_000,
    );
    await discover(hook);
    expect(hook.result.current.items[0]).toMatchObject({
      sessionId: NEARBY_SESSION_ID,
      proximity: "veryClose",
      preview: { circleName: "Ramadan khatm" },
    });
    await act(async () => {
      emitNearby("onDiscovered", { serviceUuid: UUID, rssi: -70 });
    });
    expect(api.previewNearbySession).toHaveBeenCalledTimes(1);

    await act(async () => {
      hook.result.current.close();
    });
    expect(mockNearbyNative.stopNearbyScanning).toHaveBeenCalled();
    expect(hook.result.current.items).toEqual([]);
  });

  it("hides child-device sessions from the circles hub (and the reverse)", async () => {
    jest
      .mocked(api.previewNearbySession)
      .mockResolvedValue(makeNearbyPreview({ purpose: "child_link" }));
    const hook = await setup("member");
    await act(async () => {
      emitNearby("onDiscovered", { serviceUuid: UUID, rssi: -50 });
    });
    await waitFor(() => expect(api.previewNearbySession).toHaveBeenCalled());
    expect(hook.result.current.items).toEqual([]);
  });

  it("sends the request after 'They match', stops scanning, and joins once accepted", async () => {
    const hook = await setup();
    await discover(hook);
    jest.useFakeTimers();
    await askAndWait(hook, "  Yusuf ");
    expect(api.requestNearbyJoin).toHaveBeenCalledWith("tok", NEARBY_SESSION_ID, {
      matchCode: "0472",
      displayName: "Yusuf",
    });
    expect(hook.result.current.state).toMatchObject({ kind: "waiting", requestId: "r-1" });
    expect(mockNearbyNative.stopNearbyScanning).toHaveBeenCalled();
    expect(hook.result.current.selected?.circleName).toBe("Ramadan khatm");

    await pollOnce();
    expect(hook.result.current.state.kind).toBe("waiting");

    jest
      .mocked(api.nearbyRequestStatus)
      .mockResolvedValue({ status: "accepted", circleType: "khatm_group", circleId: "c-9" });
    await pollOnce();
    expect(api.nearbyRequestStatus).toHaveBeenCalledWith(
      NEARBY_SESSION_ID,
      "r-1",
      CREATED.requestToken,
    );
    expect(hook.result.current.state).toEqual({
      kind: "joined",
      circleId: "c-9",
      circleType: "khatm_group",
      childLinked: false,
    });
  });

  it("links a child's phone without an account and stores the child session", async () => {
    jest
      .mocked(api.previewNearbySession)
      .mockResolvedValue(makeNearbyPreview({ purpose: "child_link", circleType: "family" }));
    const hook = await setup("child_link");
    await discover(hook);
    jest.useFakeTimers();
    await askAndWait(hook);
    expect(api.requestNearbyJoin).toHaveBeenCalledWith(null, NEARBY_SESSION_ID, {
      matchCode: "0472",
      displayName: undefined,
    });

    const child = { id: "child-1", nickname: "Ali" } as never;
    jest.mocked(api.nearbyRequestStatus).mockResolvedValue({
      status: "completed",
      circleType: "family",
      circleId: null,
      childToken: "mtc_token",
      child,
    });
    await pollOnce();
    expect(saveChildSession).toHaveBeenCalledWith("mtc_token", child);
    expect(hook.result.current.state).toEqual({
      kind: "joined",
      circleId: null,
      circleType: "family",
      childLinked: true,
    });
  });

  it("returns to the digits with a reason when the request is refused", async () => {
    jest
      .mocked(api.requestNearbyJoin)
      .mockRejectedValue(new ApiError("x", 409, { code: NEARBY_ERROR_CODES.matchMismatch }));
    const hook = await setup();
    await discover(hook);
    await askAndWait(hook);
    expect(hook.result.current.state).toEqual({
      kind: "confirming",
      sessionId: NEARBY_SESSION_ID,
      error: "mismatch",
    });
  });

  it("withdraws a pending request when closed", async () => {
    const hook = await setup();
    await discover(hook);
    await askAndWait(hook);
    await act(async () => {
      hook.result.current.close();
    });
    expect(api.cancelNearbyRequest).toHaveBeenCalledWith(
      NEARBY_SESSION_ID,
      "r-1",
      CREATED.requestToken,
    );
    expect(hook.result.current.state).toEqual({ kind: "idle" });
  });

  it("pauses in the background and resumes in the foreground", async () => {
    const hook = await setup();
    await act(async () => {
      appState.emit("background");
    });
    expect(hook.result.current.state).toEqual({ kind: "paused", reason: "background" });
    expect(mockNearbyNative.stopNearbyScanning).toHaveBeenCalled();
    await act(async () => {
      appState.emit("active");
    });
    expect(hook.result.current.state).toEqual({ kind: "scanning" });
    expect(mockNearbyNative.startNearbyScanning).toHaveBeenCalledTimes(2);
  });

  it("on Android, spaces rapid background/foreground restarts under the 5-per-30 s scan limit", async () => {
    jest.useFakeTimers({ now: 1_000_000 });
    nearbyScanStartLimiter.reset();
    const restorePlatform = setPlatform({ OS: "android" });
    try {
      const hook = await setup();
      // Start 1 is the open; four quick app switches make starts 2–5.
      for (let i = 0; i < 4; i += 1) {
        await act(async () => appState.emit("background"));
        await act(async () => appState.emit("active"));
      }
      expect(mockNearbyNative.startNearbyScanning).toHaveBeenCalledTimes(5);

      // A sixth return inside the window waits instead of starting a throttled scan.
      await act(async () => appState.emit("background"));
      await act(async () => appState.emit("active"));
      expect(hook.result.current.state).toEqual({ kind: "scanning" });
      expect(mockNearbyNative.startNearbyScanning).toHaveBeenCalledTimes(5);

      await act(async () => {
        jest.advanceTimersByTime(ANDROID_SCAN_START_LIMIT.windowMs);
      });
      expect(mockNearbyNative.startNearbyScanning).toHaveBeenCalledTimes(6);
    } finally {
      restorePlatform();
      nearbyScanStartLimiter.reset();
    }
  });

  it("follows the native 10-minute timeout", async () => {
    const hook = await setup();
    await act(async () => {
      emitNearby("onStopped", { role: "scan", reason: "timeout" });
    });
    expect(hook.result.current.state).toEqual({ kind: "paused", reason: "timeout" });
  });

  it.each([
    [
      "never asked → rationale",
      () => mockNearbyPermissions.checkNearbyPermission.mockResolvedValue("notDetermined"),
      { kind: "rationale" },
    ],
    [
      "Android ≤ 11 with location off",
      () => {
        mockNearbyPermissions.nearbyScanNeedsLocationServices.mockReturnValue(true);
        mockNearbyNative.nearbyLocationServicesEnabled.mockReturnValue(false);
      },
      { kind: "blocked", reason: "locationOff" },
    ],
    [
      "no BLE / web-like",
      () => mockNearbyNative.isNearbyAvailable.mockReturnValue(false),
      { kind: "blocked", reason: "unsupported" },
    ],
  ])("preflight: %s", async (_label, arrange, expected) => {
    arrange();
    const hook = await setup();
    expect(hook.result.current.state).toEqual(expected);
    expect(mockNearbyNative.startNearbyScanning).not.toHaveBeenCalled();
  });

  it("shows a native permission rejection as blocked", async () => {
    mockNearbyNative.startNearbyScanning.mockRejectedValue(nearbyNativeError("ERR_PERMISSION"));
    const hook = await setup();
    await waitFor(() =>
      expect(hook.result.current.state).toEqual({ kind: "blocked", reason: "permissionBlocked" }),
    );
  });
});

describe("nearbyJoinErrorOf", () => {
  it.each([
    [new ApiError("x", 409, { code: NEARBY_ERROR_CODES.alreadyMember }), "alreadyMember"],
    [new ApiError("x", 401, {}), "needsAccount"],
    [new ApiError("x", 410, {}), "gone"],
    [new ApiError("x", 404, {}), "gone"],
    [new ApiError("x", 429, { code: NEARBY_ERROR_CODES.sessionFull }), "busy"],
    [new Error("network"), "offline"],
  ])("%#", (error, expected) => {
    expect(nearbyJoinErrorOf(error)).toBe(expected);
  });
});
