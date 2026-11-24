/**
 * Pure state machines for NF-3.25 "Nearby join" (D41–D44). The hooks
 * (`use-nearby-host.ts`, `use-nearby-join.ts`) own the side effects (native BLE,
 * API, timers); everything they decide goes through these reducers, so the
 * flows are unit-tested without a radio.
 */
import type { CircleType } from "@munib-tracker/shared/circles";
import {
  type NearbyJoinerStatus,
  type NearbyPurpose,
  nearbySessionIdFromUuid,
} from "@munib-tracker/shared/circles/nearby";

import type { NearbySession, NearbySessionPreview } from "@/lib/circles/api";

import type { NearbyErrorCode, NearbyRadioState } from "./native";
import type { NearbyPermissionState } from "./permissions";

// ---------------------------------------------------------------------------
// Preflight (shared by host + joiner)
// ---------------------------------------------------------------------------

export type NearbyBlockReason =
  | "unsupported"
  | "bluetoothOff"
  | "permissionDenied"
  | "permissionBlocked"
  | "locationOff";

export type NearbyPreflightInput = {
  available: boolean;
  permission: NearbyPermissionState;
  radio: NearbyRadioState;
  /** Android ≤ 11 joiners only; `true` everywhere else. */
  locationServices: boolean;
};

export type NearbyPreflight =
  | { kind: "ready" }
  | { kind: "rationale" }
  | { kind: "blocked"; reason: NearbyBlockReason };

/**
 * What to do when the user taps "Make visible" / opens "Join nearby": explain
 * first when the OS has never asked (the rationale precedes the system prompt),
 * otherwise go, or say exactly what's in the way.
 */
export function nearbyPreflight(input: NearbyPreflightInput): NearbyPreflight {
  if (!input.available || input.radio === "unsupported") {
    return { kind: "blocked", reason: "unsupported" };
  }
  if (input.permission === "blocked" || input.radio === "unauthorized") {
    return { kind: "blocked", reason: "permissionBlocked" };
  }
  if (input.permission === "notDetermined") return { kind: "rationale" };
  if (input.permission === "denied") return { kind: "blocked", reason: "permissionDenied" };
  if (input.radio === "poweredOff") return { kind: "blocked", reason: "bluetoothOff" };
  if (!input.locationServices) return { kind: "blocked", reason: "locationOff" };
  // `unknown` / `resetting`: the native side waits for the radio to settle.
  return { kind: "ready" };
}

/** A native rejection that means "show the blocked state" rather than a generic error. */
export function blockReasonForError(code: NearbyErrorCode): NearbyBlockReason | null {
  switch (code) {
    case "ERR_PERMISSION":
      return "permissionBlocked";
    case "ERR_BLUETOOTH_OFF":
      return "bluetoothOff";
    case "ERR_UNSUPPORTED":
      return "unsupported";
    case "ERR_LOCATION_OFF":
      return "locationOff";
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Host
// ---------------------------------------------------------------------------

export type NearbyHostStopReason = "timeout" | "background" | "bluetoothOff" | "used" | "error";

export type NearbyHostState =
  | { kind: "idle" }
  | { kind: "rationale" }
  | { kind: "starting" }
  | { kind: "blocked"; reason: NearbyBlockReason }
  | { kind: "visible"; session: NearbySession }
  | { kind: "stopped"; reason: NearbyHostStopReason };

export type NearbyHostEvent =
  | { type: "preflight"; result: NearbyPreflight }
  | { type: "visible"; session: NearbySession }
  | { type: "stopped"; reason: NearbyHostStopReason }
  | { type: "blocked"; reason: NearbyBlockReason }
  | { type: "reset" };

export const NEARBY_HOST_IDLE: NearbyHostState = { kind: "idle" };

export function nearbyHostReducer(state: NearbyHostState, event: NearbyHostEvent): NearbyHostState {
  switch (event.type) {
    case "preflight":
      if (state.kind === "starting" || state.kind === "visible") return state;
      if (event.result.kind === "ready") return { kind: "starting" };
      if (event.result.kind === "rationale") return { kind: "rationale" };
      return { kind: "blocked", reason: event.result.reason };
    case "visible":
      return state.kind === "starting" ? { kind: "visible", session: event.session } : state;
    case "stopped":
      return state.kind === "starting" || state.kind === "visible"
        ? { kind: "stopped", reason: event.reason }
        : state;
    case "blocked":
      return { kind: "blocked", reason: event.reason };
    case "reset":
      return NEARBY_HOST_IDLE;
  }
}

/** The session currently being advertised, if any. */
export function activeHostSession(state: NearbyHostState): NearbySession | null {
  return state.kind === "visible" ? state.session : null;
}

/** Whole minutes left (rounded up) — "Stops in 9 min". */
export function minutesLeft(expiresAt: string, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 60_000));
}

// ---------------------------------------------------------------------------
// Joiner
// ---------------------------------------------------------------------------

/** Answers the joiner can get back while asking (mapped from the API error). */
export type NearbyJoinError =
  | "mismatch"
  | "alreadyMember"
  | "needsAccount"
  | "gone"
  | "busy"
  | "offline";

export type NearbyJoinState =
  | { kind: "idle" }
  | { kind: "rationale" }
  | { kind: "blocked"; reason: NearbyBlockReason }
  | { kind: "scanning" }
  | { kind: "paused"; reason: "timeout" | "background" | "error" | "bluetoothOff" }
  | { kind: "confirming"; sessionId: string; error?: NearbyJoinError }
  | { kind: "requesting"; sessionId: string }
  | { kind: "waiting"; sessionId: string; requestId: string; requestToken: string }
  | { kind: "joined"; circleId: string | null; circleType: CircleType; childLinked: boolean }
  | { kind: "declined" }
  | { kind: "expired" };

export type NearbyStatusAnswer = {
  status: NearbyJoinerStatus;
  circleType: CircleType;
  circleId: string | null;
  /** True when the child session arrived with this answer (and was stored). */
  childLinked?: boolean;
};

export type NearbyJoinEvent =
  | { type: "preflight"; result: NearbyPreflight }
  | { type: "scanning" }
  | { type: "paused"; reason: "timeout" | "background" | "error" | "bluetoothOff" }
  | { type: "blocked"; reason: NearbyBlockReason }
  | { type: "select"; sessionId: string }
  | { type: "back" }
  | { type: "requesting" }
  | { type: "failed"; error: NearbyJoinError }
  | { type: "waiting"; requestId: string; requestToken: string }
  | { type: "answer"; answer: NearbyStatusAnswer }
  | { type: "reset" };

export const NEARBY_JOIN_IDLE: NearbyJoinState = { kind: "idle" };

/** States in which the radio should be scanning. */
export function shouldScan(state: NearbyJoinState): boolean {
  return state.kind === "scanning" || state.kind === "confirming";
}

export function nearbyJoinReducer(state: NearbyJoinState, event: NearbyJoinEvent): NearbyJoinState {
  switch (event.type) {
    case "preflight":
      if (event.result.kind === "ready") return { kind: "scanning" };
      if (event.result.kind === "rationale") return { kind: "rationale" };
      return { kind: "blocked", reason: event.result.reason };
    case "scanning":
      return { kind: "scanning" };
    case "paused":
      return shouldScan(state) ? { kind: "paused", reason: event.reason } : state;
    case "blocked":
      return { kind: "blocked", reason: event.reason };
    case "select":
      return state.kind === "scanning" || state.kind === "confirming"
        ? { kind: "confirming", sessionId: event.sessionId }
        : state;
    case "back":
      return state.kind === "confirming" ? { kind: "scanning" } : state;
    case "requesting":
      return state.kind === "confirming"
        ? { kind: "requesting", sessionId: state.sessionId }
        : state;
    case "failed":
      if (state.kind !== "requesting") return state;
      // The session ended meanwhile — nothing left to confirm.
      if (event.error === "gone") return { kind: "expired" };
      return { kind: "confirming", sessionId: state.sessionId, error: event.error };
    case "waiting":
      return state.kind === "requesting"
        ? {
            kind: "waiting",
            sessionId: state.sessionId,
            requestId: event.requestId,
            requestToken: event.requestToken,
          }
        : state;
    case "answer":
      return state.kind === "waiting" ? applyAnswer(state, event.answer) : state;
    case "reset":
      return NEARBY_JOIN_IDLE;
  }
}

function applyAnswer(state: NearbyJoinState, answer: NearbyStatusAnswer): NearbyJoinState {
  switch (answer.status) {
    case "pending":
      return state;
    case "accepted":
      return answer.circleId
        ? {
            kind: "joined",
            circleId: answer.circleId,
            circleType: answer.circleType,
            childLinked: false,
          }
        : state; // a child link is "accepted" until the device picks its session up
    case "completed":
      return answer.childLinked
        ? { kind: "joined", circleId: null, circleType: answer.circleType, childLinked: true }
        : { kind: "expired" };
    case "declined":
      return { kind: "declined" };
    default:
      return { kind: "expired" };
  }
}

/** True once the joiner flow is over (the poll stops). */
export function isJoinSettled(state: NearbyJoinState): boolean {
  return state.kind === "joined" || state.kind === "declined" || state.kind === "expired";
}

// ---------------------------------------------------------------------------
// Discovered beacons
// ---------------------------------------------------------------------------

export type NearbyBeacon = { sessionId: string; rssi: number; lastSeen: number };
export type NearbyBeacons = Readonly<Record<string, NearbyBeacon>>;

/** A beacon not heard for this long has walked away (or the host closed the screen). */
export const NEARBY_BEACON_STALE_MS = 8_000;
/** CoreBluetooth reports 127 when RSSI isn't available. */
const RSSI_UNAVAILABLE = 127;

/** Records a sighting; ignores UUIDs that aren't nearby-session beacons. */
export function recordBeacon(
  beacons: NearbyBeacons,
  sighting: { serviceUuid: string; rssi: number },
  now: number,
): NearbyBeacons {
  const sessionId = nearbySessionIdFromUuid(sighting.serviceUuid);
  if (!sessionId) return beacons;
  const rssi = sighting.rssi === RSSI_UNAVAILABLE ? -100 : sighting.rssi;
  return { ...beacons, [sessionId]: { sessionId, rssi, lastSeen: now } };
}

export function pruneBeacons(beacons: NearbyBeacons, now: number): NearbyBeacons {
  const kept = Object.values(beacons).filter((b) => now - b.lastSeen <= NEARBY_BEACON_STALE_MS);
  if (kept.length === Object.keys(beacons).length) return beacons;
  return Object.fromEntries(kept.map((b) => [b.sessionId, b]));
}

export type NearbyProximity = "veryClose" | "near" | "far";

/** Coarse distance hint from signal strength (never a number in the UI). */
export function proximityOf(rssi: number): NearbyProximity {
  if (rssi >= -60) return "veryClose";
  if (rssi >= -80) return "near";
  return "far";
}

export type NearbyListItem = {
  sessionId: string;
  rssi: number;
  proximity: NearbyProximity;
  preview: NearbySessionPreview;
};

/**
 * Discovered circles to list: previewed, of the wanted purpose (the circles hub
 * lists member sessions, the kids link screen child-device sessions), closest
 * first.
 */
export function nearbyListItems(
  beacons: NearbyBeacons,
  previews: Readonly<Record<string, NearbySessionPreview | null | undefined>>,
  purpose: NearbyPurpose,
): NearbyListItem[] {
  return Object.values(beacons)
    .flatMap((beacon) => {
      const preview = previews[beacon.sessionId];
      if (!preview || preview.purpose !== purpose) return [];
      return [
        {
          sessionId: beacon.sessionId,
          rssi: beacon.rssi,
          proximity: proximityOf(beacon.rssi),
          preview,
        },
      ];
    })
    .sort((a, b) => b.rssi - a.rssi || a.sessionId.localeCompare(b.sessionId));
}
