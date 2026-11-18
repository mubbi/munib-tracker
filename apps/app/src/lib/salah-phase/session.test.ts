import { buildSalahTrackingSession } from "@/test-support/fixtures/salah-phase";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

import {
  createSalahTrackingSession,
  endSalahTrackingSession,
  shouldPromoteSession,
} from "./session";

jest.mock("expo-crypto", () => ({ randomUUID: () => "uuid-1" }));

const NOW = new Date("2026-07-03T12:00:00.000Z");
const MIN = 60_000;

/** Snapshot with the next Salah `minutesUntil` away and the current one `minutesAgo`. */
function snapshotAt(minutesUntil: number, minutesAgo: number | null, currentDone = false) {
  return buildWidgetSnapshot({
    nextPrayer: {
      prayerId: "asr",
      prayerName: "Asr",
      targetTimeMs: NOW.getTime() + minutesUntil * MIN,
      currentPrayerId: "dhuhr",
      currentPrayerName: "Dhuhr",
      currentPrayerAtMs: minutesAgo == null ? 0 : NOW.getTime() - minutesAgo * MIN,
    },
    schedule: {
      rows: [
        {
          id: "dhuhr",
          name: "Dhuhr",
          time: "12",
          status: currentDone ? "completed" : "active",
          statusLabel: "",
        },
      ],
    },
  });
}

describe("createSalahTrackingSession", () => {
  it("tracks the upcoming Salah and defers promotion until 30 minutes before", () => {
    const session = createSalahTrackingSession(snapshotAt(120, null), NOW);
    expect(session).toMatchObject({
      sessionId: "salah-uuid-1",
      prayerId: "asr",
      prayerName: "Asr",
      startedAt: NOW.toISOString(),
      promoteAt: new Date(NOW.getTime() + 90 * MIN).toISOString(),
      endsAt: new Date(NOW.getTime() + 150 * MIN).toISOString(),
      status: "active",
      dismissed: false,
    });
  });

  it("promotes immediately when the Salah is imminent", () => {
    expect(createSalahTrackingSession(snapshotAt(10, null), NOW).promoteAt).toBe(NOW.toISOString());
  });

  it("tracks the current Salah while it is being marked", () => {
    const session = createSalahTrackingSession(snapshotAt(120, 5), NOW);
    expect(session).toMatchObject({
      prayerId: "dhuhr",
      prayerName: "Dhuhr",
      promoteAt: NOW.toISOString(),
    });
    expect(session.endsAt).toBe(new Date(NOW.getTime() + 25 * MIN).toISOString());
  });

  it("always lasts at least a minute", () => {
    const session = createSalahTrackingSession(snapshotAt(120, 29.99), NOW);
    expect(Date.parse(session.endsAt)).toBe(NOW.getTime() + MIN);
  });
});

describe("endSalahTrackingSession", () => {
  it("ends without dismissing by default", () => {
    expect(endSalahTrackingSession(buildSalahTrackingSession())).toMatchObject({
      status: "ended",
      dismissed: false,
    });
  });

  it("marks a dismissal", () => {
    expect(endSalahTrackingSession(buildSalahTrackingSession(), "dismissed")).toMatchObject({
      status: "dismissed",
      dismissed: true,
    });
  });
});

describe("shouldPromoteSession", () => {
  const active = buildSalahTrackingSession({
    promoteAt: new Date(NOW.getTime() - MIN).toISOString(),
    endsAt: new Date(NOW.getTime() + 60 * MIN).toISOString(),
  });

  it.each([
    ["no session", null],
    ["an ended session", { ...active, status: "ended" as const }],
    ["a dismissed session", { ...active, dismissed: true }],
    ["an expired session", { ...active, endsAt: new Date(NOW.getTime() - 1).toISOString() }],
    ["a deferred session", { ...active, promoteAt: new Date(NOW.getTime() + MIN).toISOString() }],
  ])("is false for %s", (_label, session) => {
    expect(shouldPromoteSession(session, snapshotAt(10, null), NOW)).toBe(false);
  });

  it.each([
    ["imminent", snapshotAt(10, null), true],
    ["after the current Salah was marked", snapshotAt(120, 5, true), true],
    ["far away", snapshotAt(120, null), false],
  ])("when the Salah is %s", (_label, snapshot, expected) => {
    expect(shouldPromoteSession(active, snapshot, NOW)).toBe(expected);
  });
});
