import { nearbyServiceUuid } from "@munib-tracker/shared/circles/nearby";

import { makeNearbyPreview, makeNearbySession, NEARBY_SESSION_ID } from "@/test-support/nearby";

import {
  activeHostSession,
  blockReasonForError,
  isJoinSettled,
  minutesLeft,
  NEARBY_BEACON_STALE_MS,
  NEARBY_HOST_IDLE,
  NEARBY_JOIN_IDLE,
  type NearbyJoinState,
  nearbyHostReducer,
  nearbyJoinReducer,
  nearbyListItems,
  nearbyPreflight,
  proximityOf,
  pruneBeacons,
  recordBeacon,
  shouldScan,
} from "./machine";

const READY = {
  available: true,
  permission: "granted",
  radio: "poweredOn",
  locationServices: true,
} as const;

describe("nearbyPreflight", () => {
  it.each([
    ["no module / no BLE", { available: false }, { kind: "blocked", reason: "unsupported" }],
    ["radio unsupported", { radio: "unsupported" }, { kind: "blocked", reason: "unsupported" }],
    [
      "permission blocked (iOS denied / never ask again)",
      { permission: "blocked" },
      { kind: "blocked", reason: "permissionBlocked" },
    ],
    [
      "radio unauthorized",
      { radio: "unauthorized" },
      { kind: "blocked", reason: "permissionBlocked" },
    ],
    ["never asked → rationale first", { permission: "notDetermined" }, { kind: "rationale" }],
    ["denied once", { permission: "denied" }, { kind: "blocked", reason: "permissionDenied" }],
    ["Bluetooth off", { radio: "poweredOff" }, { kind: "blocked", reason: "bluetoothOff" }],
    [
      "Android ≤ 11 location off",
      { locationServices: false },
      { kind: "blocked", reason: "locationOff" },
    ],
    ["radio still settling", { radio: "unknown" }, { kind: "ready" }],
    ["everything fine", {}, { kind: "ready" }],
  ] as const)("%s", (_label, overrides, expected) => {
    expect(nearbyPreflight({ ...READY, ...overrides })).toEqual(expected);
  });

  it("maps native rejections to blocked states", () => {
    expect(blockReasonForError("ERR_PERMISSION")).toBe("permissionBlocked");
    expect(blockReasonForError("ERR_BLUETOOTH_OFF")).toBe("bluetoothOff");
    expect(blockReasonForError("ERR_UNSUPPORTED")).toBe("unsupported");
    expect(blockReasonForError("ERR_LOCATION_OFF")).toBe("locationOff");
    expect(blockReasonForError("ERR_ADVERTISE")).toBeNull();
  });
});

describe("nearbyHostReducer", () => {
  const session = makeNearbySession();

  it("goes idle → starting → visible, and only a starting host can become visible", () => {
    const starting = nearbyHostReducer(NEARBY_HOST_IDLE, {
      type: "preflight",
      result: { kind: "ready" },
    });
    expect(starting).toEqual({ kind: "starting" });
    const visible = nearbyHostReducer(starting, { type: "visible", session });
    expect(activeHostSession(visible)).toBe(session);
    expect(nearbyHostReducer(NEARBY_HOST_IDLE, { type: "visible", session })).toBe(
      NEARBY_HOST_IDLE,
    );
  });

  it("shows the rationale or the blocked reason from preflight", () => {
    expect(
      nearbyHostReducer(NEARBY_HOST_IDLE, { type: "preflight", result: { kind: "rationale" } }),
    ).toEqual({ kind: "rationale" });
    expect(
      nearbyHostReducer(NEARBY_HOST_IDLE, {
        type: "preflight",
        result: { kind: "blocked", reason: "bluetoothOff" },
      }),
    ).toEqual({ kind: "blocked", reason: "bluetoothOff" });
  });

  it("ignores a second start while visible", () => {
    const visible = { kind: "visible", session } as const;
    expect(nearbyHostReducer(visible, { type: "preflight", result: { kind: "ready" } })).toBe(
      visible,
    );
  });

  it("records why advertising stopped, but only from a running state", () => {
    const visible = { kind: "visible", session } as const;
    expect(nearbyHostReducer(visible, { type: "stopped", reason: "timeout" })).toEqual({
      kind: "stopped",
      reason: "timeout",
    });
    expect(nearbyHostReducer(NEARBY_HOST_IDLE, { type: "stopped", reason: "timeout" })).toBe(
      NEARBY_HOST_IDLE,
    );
    expect(nearbyHostReducer(visible, { type: "reset" })).toEqual(NEARBY_HOST_IDLE);
  });

  it("rounds minutes left up and never below zero", () => {
    const now = Date.parse("2026-11-24T10:00:00Z");
    expect(minutesLeft("2026-11-24T10:09:01Z", now)).toBe(10);
    expect(minutesLeft("2026-11-24T09:59:00Z", now)).toBe(0);
  });
});

describe("nearbyJoinReducer", () => {
  const confirming: NearbyJoinState = { kind: "confirming", sessionId: NEARBY_SESSION_ID };

  function run(...events: Parameters<typeof nearbyJoinReducer>[1][]): NearbyJoinState {
    return events.reduce(nearbyJoinReducer, NEARBY_JOIN_IDLE);
  }

  it("scans, confirms, asks and waits", () => {
    const state = run(
      { type: "preflight", result: { kind: "ready" } },
      { type: "select", sessionId: NEARBY_SESSION_ID },
      { type: "requesting" },
      { type: "waiting", requestId: "r-1", requestToken: "mtn_x" },
    );
    expect(state).toEqual({
      kind: "waiting",
      sessionId: NEARBY_SESSION_ID,
      requestId: "r-1",
      requestToken: "mtn_x",
    });
    expect(shouldScan(state)).toBe(false);
    expect(shouldScan(confirming)).toBe(true);
  });

  it("'They don't match' goes back to the list", () => {
    expect(nearbyJoinReducer(confirming, { type: "back" })).toEqual({ kind: "scanning" });
  });

  it("returns to the confirm step with the reason when asking fails", () => {
    const requesting = nearbyJoinReducer(confirming, { type: "requesting" });
    expect(nearbyJoinReducer(requesting, { type: "failed", error: "mismatch" })).toEqual({
      ...confirming,
      error: "mismatch",
    });
    expect(nearbyJoinReducer(requesting, { type: "failed", error: "gone" })).toEqual({
      kind: "expired",
    });
  });

  it.each([
    [
      "member accepted → joined",
      { status: "accepted", circleType: "khatm_group", circleId: "c-1" },
      { kind: "joined", circleId: "c-1", circleType: "khatm_group", childLinked: false },
    ],
    [
      "child link accepted, not yet picked up → keep waiting",
      { status: "accepted", circleType: "family", circleId: null },
      "waiting",
    ],
    [
      "child session stored → joined",
      { status: "completed", circleType: "family", circleId: null, childLinked: true },
      { kind: "joined", circleId: null, circleType: "family", childLinked: true },
    ],
    [
      "completed without a token → expired",
      { status: "completed", circleType: "family", circleId: null },
      { kind: "expired" },
    ],
    [
      "declined",
      { status: "declined", circleType: "partner", circleId: null },
      { kind: "declined" },
    ],
    [
      "session ended",
      { status: "expired", circleType: "partner", circleId: null },
      { kind: "expired" },
    ],
    ["still pending", { status: "pending", circleType: "partner", circleId: null }, "waiting"],
  ] as const)("%s", (_label, answer, expected) => {
    const waiting = run(
      { type: "scanning" },
      { type: "select", sessionId: NEARBY_SESSION_ID },
      { type: "requesting" },
      { type: "waiting", requestId: "r-1", requestToken: "mtn_x" },
    );
    const next = nearbyJoinReducer(waiting, { type: "answer", answer });
    if (expected === "waiting") expect(next).toBe(waiting);
    else {
      expect(next).toEqual(expected);
      expect(isJoinSettled(next)).toBe(true);
    }
  });

  it("pauses only while scanning, and ignores answers outside the waiting step", () => {
    expect(nearbyJoinReducer(NEARBY_JOIN_IDLE, { type: "paused", reason: "timeout" })).toBe(
      NEARBY_JOIN_IDLE,
    );
    expect(nearbyJoinReducer({ kind: "scanning" }, { type: "paused", reason: "timeout" })).toEqual({
      kind: "paused",
      reason: "timeout",
    });
    expect(
      nearbyJoinReducer(confirming, {
        type: "answer",
        answer: { status: "accepted", circleType: "family", circleId: "c" },
      }),
    ).toBe(confirming);
  });
});

describe("beacons", () => {
  const uuid = nearbyServiceUuid(NEARBY_SESSION_ID);

  it("records only nearby-session UUIDs and forgets stale ones", () => {
    let beacons = recordBeacon({}, { serviceUuid: uuid.toUpperCase(), rssi: -55 }, 1000);
    beacons = recordBeacon(
      beacons,
      { serviceUuid: "0000180f-0000-1000-8000-00805f9b34fb", rssi: -40 },
      1000,
    );
    expect(Object.keys(beacons)).toEqual([NEARBY_SESSION_ID]);
    expect(pruneBeacons(beacons, 1000 + NEARBY_BEACON_STALE_MS)).toBe(beacons);
    expect(pruneBeacons(beacons, 1001 + NEARBY_BEACON_STALE_MS)).toEqual({});
  });

  it("treats CoreBluetooth's 127 (no RSSI) as far away", () => {
    const beacons = recordBeacon({}, { serviceUuid: uuid, rssi: 127 }, 0);
    expect(beacons[NEARBY_SESSION_ID]?.rssi).toBe(-100);
    expect(proximityOf(-100)).toBe("far");
    expect(proximityOf(-70)).toBe("near");
    expect(proximityOf(-50)).toBe("veryClose");
  });

  it("lists previewed circles of the wanted purpose, closest first", () => {
    const a = "aaaaaaaaaaaaaaaa";
    const b = "bbbbbbbbbbbbbbbb";
    const c = "cccccccccccccccc";
    let beacons = recordBeacon({}, { serviceUuid: nearbyServiceUuid(a), rssi: -85 }, 0);
    beacons = recordBeacon(beacons, { serviceUuid: nearbyServiceUuid(b), rssi: -50 }, 0);
    beacons = recordBeacon(beacons, { serviceUuid: nearbyServiceUuid(c), rssi: -40 }, 0);
    const previews = {
      [a]: makeNearbyPreview({ circleName: "A" }),
      [b]: makeNearbyPreview({ circleName: "B" }),
      [c]: makeNearbyPreview({ circleName: "Child", purpose: "child_link" }),
    };
    expect(nearbyListItems(beacons, previews, "member").map((i) => i.preview.circleName)).toEqual([
      "B",
      "A",
    ]);
    expect(nearbyListItems(beacons, previews, "child_link").map((i) => i.sessionId)).toEqual([c]);
    expect(nearbyListItems(beacons, {}, "member")).toEqual([]);
  });
});
