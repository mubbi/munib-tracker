import { ApiError } from "@munib-tracker/api-client";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { captureAppStateListener } from "@/test-support/app-state";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import {
  createQueryWrapper,
  emitNearby,
  makeNearbyRequest,
  makeNearbySession,
  mockNearbyNative,
  mockNearbyPermissions,
  nearbyNativeError,
  resetNearbyMocks,
} from "@/test-support/nearby";

jest.mock("@/lib/nearby/native", () => require("@/test-support/nearby").nearbyNativeMock);
jest.mock("@/lib/nearby/permissions", () => require("@/test-support/nearby").nearbyPermissionsMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/lib/circles/api", () => ({
  ...jest.requireActual("@/lib/circles/api"),
  createNearbySession: jest.fn(),
  endNearbySession: jest.fn(async () => undefined),
  listNearbyRequests: jest.fn(),
  decideNearbyRequest: jest.fn(async () => undefined),
}));

import * as api from "@/lib/circles/api";

import { nearbyDecisionErrorKey, sortRequests, useNearbyHost } from "./use-nearby-host";

const appState = captureAppStateListener();
const session = makeNearbySession();

beforeEach(() => {
  resetNearbyMocks();
  resetAuthMock();
  setMockAuth({
    session: { accessToken: "tok", userId: "u-1" },
    isAuthenticated: true,
    isGuest: false,
  });
  jest.mocked(api.createNearbySession).mockReset().mockResolvedValue(session);
  jest.mocked(api.endNearbySession).mockClear();
  jest.mocked(api.decideNearbyRequest).mockClear();
  jest
    .mocked(api.listNearbyRequests)
    .mockReset()
    .mockResolvedValue({ items: [], active: true, expiresAt: session.expiresAt });
});

async function setup(options: Parameters<typeof useNearbyHost>[0] = { circleId: "c-1" }) {
  const { QueryWrapper } = createQueryWrapper();
  return await renderHook(() => useNearbyHost(options), { wrapper: QueryWrapper });
}

async function startVisible(options?: Parameters<typeof useNearbyHost>[0]) {
  const hook = await setup(options);
  await act(async () => {
    await hook.result.current.start();
  });
  await waitFor(() => expect(hook.result.current.state.kind).toBe("visible"));
  return hook;
}

describe("useNearbyHost", () => {
  it("explains Bluetooth before the OS prompt, then advertises the session UUID", async () => {
    mockNearbyPermissions.checkNearbyPermission.mockResolvedValue("notDetermined");
    const hook = await setup({ circleId: "c-1", role: "parent" });
    await act(async () => {
      await hook.result.current.start();
    });
    expect(hook.result.current.state).toEqual({ kind: "rationale" });
    expect(mockNearbyPermissions.requestNearbyPermission).not.toHaveBeenCalled();
    expect(api.createNearbySession).not.toHaveBeenCalled();

    mockNearbyPermissions.checkNearbyPermission.mockResolvedValue("granted");
    await act(async () => {
      await hook.result.current.grant();
    });
    expect(mockNearbyPermissions.requestNearbyPermission).toHaveBeenCalledWith("advertise");
    expect(api.createNearbySession).toHaveBeenCalledWith("tok", "c-1", { role: "parent" });
    expect(mockNearbyNative.startNearbyAdvertising).toHaveBeenCalledWith(
      session.serviceUuid,
      expect.any(Number),
    );
    const ms = mockNearbyNative.startNearbyAdvertising.mock.calls[0]?.[1] ?? 0;
    expect(ms).toBeGreaterThan(9 * 60_000);
    expect(hook.result.current.state).toEqual({ kind: "visible", session });
  });

  it("opens a child-device link session with the child id", async () => {
    await startVisible({ circleId: "c-1", childId: "child-1" });
    expect(api.createNearbySession).toHaveBeenCalledWith("tok", "c-1", { childId: "child-1" });
  });

  it("shows a denied prompt as blocked and never advertises", async () => {
    mockNearbyPermissions.checkNearbyPermission.mockResolvedValue("notDetermined");
    mockNearbyPermissions.requestNearbyPermission.mockResolvedValue("blocked");
    const hook = await setup();
    await act(async () => {
      await hook.result.current.start();
      await hook.result.current.grant();
    });
    expect(hook.result.current.state).toEqual({ kind: "blocked", reason: "permissionBlocked" });
    expect(mockNearbyNative.startNearbyAdvertising).not.toHaveBeenCalled();
  });

  it("reports Bluetooth off without opening a session", async () => {
    mockNearbyNative.nearbyRadioState.mockReturnValue("poweredOff");
    const hook = await setup();
    await act(async () => {
      await hook.result.current.start();
    });
    expect(hook.result.current.state).toEqual({ kind: "blocked", reason: "bluetoothOff" });
    expect(api.createNearbySession).not.toHaveBeenCalled();
  });

  it("ends the server session when advertising fails", async () => {
    mockNearbyNative.startNearbyAdvertising.mockRejectedValue(
      nearbyNativeError("ERR_BLUETOOTH_OFF"),
    );
    const hook = await setup();
    await act(async () => {
      await hook.result.current.start();
    });
    expect(hook.result.current.state).toEqual({ kind: "blocked", reason: "bluetoothOff" });
    expect(api.endNearbySession).toHaveBeenCalledWith("tok", "c-1", session.sessionId);
  });

  it("polls 'Asking to join' (pending first) and accepts through the API", async () => {
    jest.mocked(api.listNearbyRequests).mockResolvedValue({
      items: [
        makeNearbyRequest({ id: "old", status: "declined", createdAt: "2026-11-24T09:00:00Z" }),
        makeNearbyRequest({ id: "new" }),
      ],
      active: true,
      expiresAt: session.expiresAt,
    });
    const hook = await startVisible();
    await waitFor(() => expect(hook.result.current.requests).toHaveLength(2));
    expect(hook.result.current.requests.map((r) => r.id)).toEqual(["new", "old"]);
    expect(api.listNearbyRequests).toHaveBeenCalledWith("tok", "c-1", session.sessionId);

    await act(async () => {
      await hook.result.current.decide("new", "accept");
    });
    expect(api.decideNearbyRequest).toHaveBeenCalledWith(
      "tok",
      "c-1",
      session.sessionId,
      "new",
      "accept",
    );
  });

  it("stops and ends the session on Stop", async () => {
    const hook = await startVisible();
    await act(async () => {
      hook.result.current.stop();
    });
    expect(hook.result.current.state).toEqual({ kind: "idle" });
    expect(mockNearbyNative.stopNearbyAdvertising).toHaveBeenCalled();
    expect(api.endNearbySession).toHaveBeenCalledWith("tok", "c-1", session.sessionId);
  });

  it("stops when the app goes to the background", async () => {
    const hook = await startVisible();
    await act(async () => {
      appState.emit("background");
    });
    expect(hook.result.current.state).toEqual({ kind: "stopped", reason: "background" });
    expect(api.endNearbySession).toHaveBeenCalled();
  });

  it("follows the native side when Bluetooth turns off mid-session", async () => {
    const hook = await startVisible();
    await act(async () => {
      emitNearby("onStopped", { role: "advertise", reason: "bluetoothOff" });
    });
    expect(hook.result.current.state).toEqual({ kind: "stopped", reason: "bluetoothOff" });
    expect(api.endNearbySession).toHaveBeenCalled();
  });

  it("stops once a single-use session was used (server reports inactive)", async () => {
    jest
      .mocked(api.listNearbyRequests)
      .mockResolvedValue({ items: [], active: false, expiresAt: session.expiresAt });
    const hook = await startVisible();
    await waitFor(() =>
      expect(hook.result.current.state).toEqual({ kind: "stopped", reason: "used" }),
    );
  });

  it("stops advertising and ends the session on unmount", async () => {
    const hook = await startVisible();
    await act(async () => {
      hook.unmount();
    });
    expect(mockNearbyNative.stopNearbyAdvertising).toHaveBeenCalled();
    expect(api.endNearbySession).toHaveBeenCalledWith("tok", "c-1", session.sessionId);
  });
});

describe("helpers", () => {
  it("sorts pending requests first, oldest first", () => {
    const items = sortRequests([
      makeNearbyRequest({ id: "a", status: "accepted", createdAt: "2026-11-24T08:00:00Z" }),
      makeNearbyRequest({ id: "c", createdAt: "2026-11-24T10:00:00Z" }),
      makeNearbyRequest({ id: "b", createdAt: "2026-11-24T09:00:00Z" }),
    ]);
    expect(items.map((r) => r.id)).toEqual(["b", "c", "a"]);
  });

  it("maps decision failures to copy", () => {
    const err = (status: number) => new ApiError("x", status, {});
    expect(nearbyDecisionErrorKey(err(409))).toBe("nearby.host.errorFull");
    expect(nearbyDecisionErrorKey(err(410))).toBe("nearby.host.errorEnded");
    expect(nearbyDecisionErrorKey(err(403))).toBe("nearby.host.errorForbidden");
    expect(nearbyDecisionErrorKey(new Error("offline"))).toBe("circles.common.offline");
  });
});
