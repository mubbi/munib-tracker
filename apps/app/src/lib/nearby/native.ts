import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/**
 * JS ↔ native contract for NF-3.25 "Nearby join" (D41), backed by the local Expo
 * module `modules/munib-nearby` (CoreBluetooth on iOS, BluetoothLeAdvertiser /
 * BluetoothLeScanner on Android).
 *
 * The module is `null` on web, Apple TV / Android TV (excluded from TV
 * autolinking), Expo Go and builds without it. Every wrapper is a safe no-op
 * there and the UI keeps the QR / code path only.
 */

export type NearbyRadioState =
  | "poweredOn"
  | "poweredOff"
  | "unauthorized"
  | "unsupported"
  | "resetting"
  | "unknown";

export type NearbyAuthStatus = "granted" | "denied" | "notDetermined";

export type NearbyStopReason = "timeout" | "background" | "bluetoothOff" | "error" | "destroyed";

/** Codes the native side rejects with (`CodedException` / `promise.reject(code, …)`). */
export type NearbyErrorCode =
  | "ERR_PERMISSION"
  | "ERR_BLUETOOTH_OFF"
  | "ERR_UNSUPPORTED"
  | "ERR_LOCATION_OFF"
  | "ERR_ADVERTISE"
  | "ERR_INVALID"
  | "ERR_CANCELLED"
  | "ERR_UNKNOWN";

export type NearbyDiscoveredEvent = { serviceUuid: string; rssi: number };
export type NearbyStoppedEvent = { role: "advertise" | "scan"; reason: NearbyStopReason };
export type NearbyStateEvent = { state: NearbyRadioState };

type NearbyEvents = {
  onDiscovered: NearbyDiscoveredEvent;
  onStopped: NearbyStoppedEvent;
  onStateChange: NearbyStateEvent;
};

interface NearbyNativeModule {
  isSupported(): boolean;
  authorizationStatus(): NearbyAuthStatus;
  getState(): NearbyRadioState;
  locationServicesEnabled(): boolean;
  requestAuthorization(): Promise<"granted" | "denied">;
  startAdvertising(serviceUuid: string, timeoutMs: number): Promise<void>;
  stopAdvertising(): Promise<void>;
  startScanning(prefix: string, timeoutMs: number): Promise<void>;
  stopScanning(): Promise<void>;
  addListener<E extends keyof NearbyEvents>(
    event: E,
    listener: (payload: NearbyEvents[E]) => void,
  ): { remove(): void };
}

function loadModule(): NearbyNativeModule | null {
  if (Platform.OS === "web" || isTV()) return null;
  return requireOptionalNativeModule<NearbyNativeModule>("MunibNearby");
}

const nativeModule = loadModule();

/** True when this build can advertise / scan at all (phone build with the module, BLE hardware). */
export function isNearbyAvailable(): boolean {
  try {
    return nativeModule?.isSupported() === true;
  } catch {
    return false;
  }
}

export function nearbyAuthorizationStatus(): NearbyAuthStatus {
  try {
    return nativeModule?.authorizationStatus() ?? "denied";
  } catch {
    return "denied";
  }
}

export function nearbyRadioState(): NearbyRadioState {
  try {
    return nativeModule?.getState() ?? "unsupported";
  } catch {
    return "unknown";
  }
}

/** Android ≤ 11 scans need location services on; always true elsewhere. */
export function nearbyLocationServicesEnabled(): boolean {
  try {
    return nativeModule?.locationServicesEnabled() ?? true;
  } catch {
    return true;
  }
}

/** iOS: shows the system Bluetooth prompt (call only after the in-app rationale). */
export async function requestNearbyAuthorization(): Promise<"granted" | "denied"> {
  if (!nativeModule) return "denied";
  try {
    return await nativeModule.requestAuthorization();
  } catch {
    return "denied";
  }
}

export async function startNearbyAdvertising(
  serviceUuid: string,
  timeoutMs: number,
): Promise<void> {
  if (!nativeModule) throw nearbyError("ERR_UNSUPPORTED");
  await nativeModule.startAdvertising(serviceUuid, timeoutMs);
}

export async function stopNearbyAdvertising(): Promise<void> {
  try {
    await nativeModule?.stopAdvertising();
  } catch {
    // Already stopped / Bluetooth off — nothing to undo.
  }
}

export async function startNearbyScanning(prefix: string, timeoutMs: number): Promise<void> {
  if (!nativeModule) throw nearbyError("ERR_UNSUPPORTED");
  await nativeModule.startScanning(prefix, timeoutMs);
}

export async function stopNearbyScanning(): Promise<void> {
  try {
    await nativeModule?.stopScanning();
  } catch {
    // Already stopped.
  }
}

/** Subscribe to a native event; returns the unsubscribe function (no-op without the module). */
export function addNearbyListener<E extends keyof NearbyEvents>(
  event: E,
  listener: (payload: NearbyEvents[E]) => void,
): () => void {
  if (!nativeModule) return () => {};
  const subscription = nativeModule.addListener(event, listener);
  return () => subscription.remove();
}

const KNOWN_CODES = new Set<NearbyErrorCode>([
  "ERR_PERMISSION",
  "ERR_BLUETOOTH_OFF",
  "ERR_UNSUPPORTED",
  "ERR_LOCATION_OFF",
  "ERR_ADVERTISE",
  "ERR_INVALID",
  "ERR_CANCELLED",
]);

/** The native rejection code of `error` (`ERR_UNKNOWN` for anything else). */
export function nearbyErrorCode(error: unknown): NearbyErrorCode {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return KNOWN_CODES.has(code as NearbyErrorCode) ? (code as NearbyErrorCode) : "ERR_UNKNOWN";
}

function nearbyError(code: NearbyErrorCode): Error & { code: NearbyErrorCode } {
  return Object.assign(new Error(code), { code });
}
