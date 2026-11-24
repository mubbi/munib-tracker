/**
 * NF-3.25 "Nearby join" test support — no real BLE, no network.
 *
 *   jest.mock("@/lib/nearby/native", () => require("@/test-support/nearby").nearbyNativeMock);
 *   jest.mock("@/lib/nearby/permissions", () => require("@/test-support/nearby").nearbyPermissionsMock);
 *   import { emitNearby, mockNearbyNative, mockNearbyPermissions, resetNearbyMocks } from "@/test-support/nearby";
 *
 * `emitNearby("onDiscovered", { serviceUuid, rssi })` reaches every live
 * `addNearbyListener` subscriber, like the native module's events.
 */
import { nearbyServiceUuid } from "@munib-tracker/shared/circles/nearby";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import type { NearbyRequest, NearbySession, NearbySessionPreview } from "@/lib/circles/api";

type Listener = (payload: unknown) => void;
const listeners = new Map<string, Set<Listener>>();

export const mockNearbyNative = {
  isNearbyAvailable: jest.fn(() => true),
  nearbyAuthorizationStatus: jest.fn(() => "granted"),
  nearbyRadioState: jest.fn(() => "poweredOn"),
  nearbyLocationServicesEnabled: jest.fn(() => true),
  requestNearbyAuthorization: jest.fn(async () => "granted"),
  startNearbyAdvertising: jest.fn(async (_uuid: string, _ms: number) => undefined),
  stopNearbyAdvertising: jest.fn(async () => undefined),
  startNearbyScanning: jest.fn(async (_prefix: string, _ms: number) => undefined),
  stopNearbyScanning: jest.fn(async () => undefined),
};

export const nearbyNativeMock = {
  __esModule: true,
  ...mockNearbyNative,
  addNearbyListener: (event: string, listener: Listener) => {
    const set = listeners.get(event) ?? new Set<Listener>();
    set.add(listener);
    listeners.set(event, set);
    return () => set.delete(listener);
  },
  nearbyErrorCode: (error: unknown) =>
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "ERR_UNKNOWN",
};

/** Native event → every live subscriber. */
export function emitNearby(
  event: "onDiscovered" | "onStopped" | "onStateChange",
  payload: unknown,
) {
  for (const listener of [...(listeners.get(event) ?? [])]) listener(payload);
}

export function nearbyListenerCount(event: string): number {
  return listeners.get(event)?.size ?? 0;
}

/** A rejection shaped like the native module's (`code` = `ERR_*`). */
export function nearbyNativeError(code: string): Error & { code: string } {
  return Object.assign(new Error(code), { code });
}

export const mockNearbyPermissions = {
  checkNearbyPermission: jest.fn(async (_role: "advertise" | "scan") => "granted"),
  requestNearbyPermission: jest.fn(async (_role: "advertise" | "scan") => "granted"),
  nearbyScanNeedsLocationServices: jest.fn(() => false),
  openNearbyPermissionSettings: jest.fn(async () => undefined),
  openBluetoothSettings: jest.fn(async () => true),
  openLocationSettings: jest.fn(async () => undefined),
};

export const nearbyPermissionsMock = { __esModule: true, ...mockNearbyPermissions };

export function resetNearbyMocks(): void {
  listeners.clear();
  for (const fn of [...Object.values(mockNearbyNative), ...Object.values(mockNearbyPermissions)]) {
    fn.mockClear();
  }
  mockNearbyNative.isNearbyAvailable.mockImplementation(() => true);
  mockNearbyNative.nearbyRadioState.mockImplementation(() => "poweredOn");
  mockNearbyNative.nearbyLocationServicesEnabled.mockImplementation(() => true);
  mockNearbyNative.startNearbyAdvertising.mockImplementation(async () => undefined);
  mockNearbyNative.startNearbyScanning.mockImplementation(async () => undefined);
  mockNearbyPermissions.checkNearbyPermission.mockImplementation(async () => "granted");
  mockNearbyPermissions.requestNearbyPermission.mockImplementation(async () => "granted");
  mockNearbyPermissions.nearbyScanNeedsLocationServices.mockImplementation(() => false);
}

// ---------------------------------------------------------------------------
// Fixtures (API shapes from lib/circles/api.ts)
// ---------------------------------------------------------------------------

export const NEARBY_SESSION_ID = "0123456789abcdef";

export function makeNearbySession(overrides: Partial<NearbySession> = {}): NearbySession {
  const sessionId = overrides.sessionId ?? NEARBY_SESSION_ID;
  return {
    sessionId,
    serviceUuid: nearbyServiceUuid(sessionId),
    matchCode: "0472",
    purpose: "member",
    role: "member",
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    ...overrides,
  };
}

export function makeNearbyPreview(
  overrides: Partial<NearbySessionPreview> = {},
): NearbySessionPreview {
  return {
    circleType: "khatm_group",
    circleName: "Ramadan khatm",
    memberCount: 3,
    matchCode: "0472",
    purpose: "member",
    needsAccount: false,
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    ...overrides,
  };
}

export function makeNearbyRequest(overrides: Partial<NearbyRequest> = {}): NearbyRequest {
  return {
    id: "r-1",
    displayName: "Yusuf",
    requester: "account",
    status: "pending",
    createdAt: "2026-11-24T10:00:00.000Z",
    ...overrides,
  };
}

/** A fresh QueryClient wrapper (no retries, no cache between tests) for query-backed hooks. */
export function createQueryWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      // A settled mutation otherwise arms TanStack's default 5-min GC timer, which
      // keeps the Jest worker alive after the suite. Infinity schedules none; the
      // client is per-test anyway.
      mutations: { retry: false, gcTime: Number.POSITIVE_INFINITY },
    },
  });
  // biome-ignore lint/correctness/noComponentHookFactories: per-test wrapper bound to a fresh client (renderHook `wrapper`).
  function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return { client, QueryWrapper };
}
