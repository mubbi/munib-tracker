import { describe, expect, it } from "vitest";

import { UMRAH_STEPS, type UmrahSession } from "../types/umrah";
import {
  activeUmrahSession,
  advanceUmrahSession,
  asUmrahSessionMap,
  backUmrahSession,
  canAdvanceUmrah,
  completedUmrahSessions,
  countUmrahRound,
  createUmrahSession,
  currentUmrahSession,
  goToUmrahStep,
  haversineKm,
  MIQAT_ALERT_RADIUS_KM,
  mergeUmrahSessions,
  minutesUntilFlightMiqat,
  nearestMiqat,
  nextLocalTime,
  saiDirection,
  setUmrahHairChoice,
  setUmrahTravel,
  UMRAH_ROUNDS,
  umrahLapDurations,
  umrahStepLockReason,
  undoUmrahRound,
} from "./umrah-session";

const T0 = "2026-11-23T08:00:00.000Z";
const at = (minutes: number) => new Date(Date.parse(T0) + minutes * 60_000).toISOString();

function countTimes(session: UmrahSession, kind: "tawaf" | "sai", n: number, from = 1) {
  let next = session;
  for (let i = 0; i < n; i += 1) next = countUmrahRound(next, kind, at(from + i));
  return next;
}

const MIQATS = [
  { id: "dhul_hulayfah", wikidata: "Q6783320", latitude: 24.41361, longitude: 39.54278 },
  { id: "yalamlam", wikidata: "Q3595659", latitude: 20.5179, longitude: 39.8702 },
] as const;

describe.concurrent("Umrah session state machine", () => {
  it("starts at prepare with a log entry and no rounds", () => {
    const session = createUmrahSession("u1", T0);
    expect(session).toMatchObject({ step: "prepare", tawafLaps: 0, saiLaps: 0, startedAt: T0 });
    expect(session.log).toEqual([{ step: "prepare", at: T0 }]);
  });

  it("walks the plan's step order and logs each step", () => {
    let session = createUmrahSession("u1", T0);
    const visited: string[] = [session.step];
    for (let i = 1; i < 40 && session.step !== "complete"; i += 1) {
      if (session.step === "tawaf" || session.step === "sai") {
        session = countTimes(session, session.step, UMRAH_ROUNDS, i * 10);
      }
      session = advanceUmrahSession(session, at(i * 10 + 9));
      visited.push(session.step);
    }
    expect(visited).toEqual([...UMRAH_STEPS]);
    expect(session.completedAt).toBeDefined();
    expect(session.log.map((entry) => entry.step)).toEqual([...UMRAH_STEPS]);
  });

  it("does not leave tawaf or sa'i before seven rounds", () => {
    const tawaf = goToUmrahStep(createUmrahSession("u1", T0), "tawaf", at(1));
    expect(canAdvanceUmrah(tawaf)).toBe(false);
    expect(advanceUmrahSession(tawaf, at(2))).toBe(tawaf);
    const six = countTimes(tawaf, "tawaf", 6);
    expect(advanceUmrahSession(six, at(9)).step).toBe("tawaf");
    expect(advanceUmrahSession(countUmrahRound(six, "tawaf", at(8)), at(9)).step).toBe(
      "two_rakah_behind_maqam",
    );
  });

  it("caps rounds at seven and undo removes the last round and its time", () => {
    const tawaf = goToUmrahStep(createUmrahSession("u1", T0), "tawaf", at(1));
    const nine = countTimes(tawaf, "tawaf", 9);
    expect(nine.tawafLaps).toBe(UMRAH_ROUNDS);
    expect(nine.tawafLapTimes).toHaveLength(UMRAH_ROUNDS);
    const undone = undoUmrahRound(nine, "tawaf", at(20));
    expect(undone.tawafLaps).toBe(6);
    expect(undone.tawafLapTimes).toHaveLength(6);
    const empty = createUmrahSession("u2", T0);
    expect(undoUmrahRound(empty, "sai", at(1))).toBe(empty);
  });

  it("measures each lap from entering the step, then from the previous lap", () => {
    const tawaf = goToUmrahStep(createUmrahSession("u1", T0), "tawaf", at(10));
    const two = countUmrahRound(countUmrahRound(tawaf, "tawaf", at(16)), "tawaf", at(21));
    expect(umrahLapDurations(two, "tawaf")).toEqual([6 * 60_000, 5 * 60_000]);
  });

  it("goes back one step, and can jump to any step (already in ihram)", () => {
    const session = createUmrahSession("u1", T0);
    expect(backUmrahSession(session, at(1))).toBe(session);
    const ihram = goToUmrahStep(session, "talbiyah", at(1));
    expect(ihram.step).toBe("talbiyah");
    expect(backUmrahSession(ihram, at(2)).step).toBe("ihram");
    expect(goToUmrahStep(ihram, "talbiyah", at(3))).toBe(ihram);
  });

  it("shows the sa'i direction: odd courses Safa → Marwah, ending at Marwah", () => {
    expect(saiDirection(0)).toBe("safa_to_marwah");
    expect(saiDirection(1)).toBe("marwah_to_safa");
    expect(saiDirection(6)).toBe("safa_to_marwah");
    expect(saiDirection(7)).toBe("done");
  });

  it("stores travel and hair choices", () => {
    const session = createUmrahSession("u1", T0);
    const air = setUmrahTravel(session, { travelMode: "air", flightMiqatAt: at(90) }, at(1));
    expect(air).toMatchObject({ travelMode: "air", flightMiqatAt: at(90) });
    expect(setUmrahTravel(air, { flightMiqatAt: null }, at(2)).flightMiqatAt).toBeUndefined();
    const halq = setUmrahHairChoice(session, "halq", at(3));
    expect(halq.hairChoice).toBe("halq");
    expect(setUmrahHairChoice(halq, "halq", at(4))).toBe(halq);
  });
});

describe.concurrent("Umrah excused-period locks (hayd / nifas)", () => {
  it("locks tawaf and the two rakahs during hayd or nifas", () => {
    for (const reason of ["hayd", "nifas"] as const) {
      expect(umrahStepLockReason("tawaf", reason)).toBe("tawaf_purity");
      expect(umrahStepLockReason("two_rakah_behind_maqam", reason)).toBe("salah_purity");
    }
  });

  it("locks sa'i only while tawaf is not done", () => {
    expect(umrahStepLockReason("sai", "hayd", 3)).toBe("sai_after_tawaf");
    expect(umrahStepLockReason("sai", "hayd", UMRAH_ROUNDS)).toBeNull();
  });

  it("never locks other steps, other excuses, or no excuse", () => {
    expect(umrahStepLockReason("talbiyah", "hayd")).toBeNull();
    expect(umrahStepLockReason("halq_taqsir", "nifas")).toBeNull();
    expect(umrahStepLockReason("tawaf", "travel")).toBeNull();
    expect(umrahStepLockReason("tawaf", "sick")).toBeNull();
    expect(umrahStepLockReason("tawaf", null)).toBeNull();
  });
});

describe.concurrent("Umrah session selectors and sync", () => {
  const active = createUmrahSession("a", T0);
  const done = { ...goToUmrahStep(createUmrahSession("b", T0), "complete", at(60)) };
  const gone = { ...createUmrahSession("c", at(5)), deleted: true };

  it("finds the active session and lists completed ones", () => {
    expect(activeUmrahSession({ a: active, b: done, c: gone })?.id).toBe("a");
    expect(activeUmrahSession({ b: done, c: gone })).toBeNull();
    expect(completedUmrahSessions({ a: active, b: done }).map((s) => s.id)).toEqual(["b"]);
  });

  it("keeps a just-completed session on screen for 12 hours", () => {
    expect(currentUmrahSession({ b: done }, new Date(at(60 + 60)))?.id).toBe("b");
    expect(currentUmrahSession({ b: done }, new Date(at(60 + 13 * 60)))).toBeNull();
  });

  it("merges per session by updatedAt (ties keep local) and keeps tombstones", () => {
    const local = { a: active, c: createUmrahSession("c", T0) };
    const remoteA = countUmrahRound(goToUmrahStep(active, "tawaf", at(10)), "tawaf", at(11));
    const merged = mergeUmrahSessions(local, { a: remoteA, c: gone });
    expect(merged.a?.tawafLaps).toBe(1);
    expect(merged.c?.deleted).toBe(true);
    expect(
      mergeUmrahSessions({ a: remoteA }, { a: { ...remoteA, tawafLaps: 5 } }).a?.tawafLaps,
    ).toBe(1);
  });

  it("drops malformed rows and clamps counts when reading stored / remote data", () => {
    const map = asUmrahSessionMap({
      ok: { ...active, tawafLaps: 99, saiLaps: -3, tawafLapTimes: ["bad", T0] },
      badStep: { ...active, step: "jumping" },
      badDate: { ...active, updatedAt: "yesterday" },
      notObject: 5,
    });
    expect(Object.keys(map)).toEqual(["ok"]);
    expect(map.ok).toMatchObject({ tawafLaps: 7, saiLaps: 0, tawafLapTimes: [T0] });
    expect(asUmrahSessionMap(null)).toEqual({});
    expect(asUmrahSessionMap([1, 2])).toEqual({});
  });
});

describe.concurrent("Miqat proximity and the flight timer", () => {
  it("computes great-circle distance", () => {
    // Madinah (Masjid an-Nabawi) to Dhul-Hulayfah is roughly 9–10 km.
    const km = haversineKm({ latitude: 24.4672, longitude: 39.6111 }, MIQATS[0]);
    expect(km).toBeGreaterThan(7);
    expect(km).toBeLessThan(12);
  });

  it("flags 'approaching' within 20 km of the nearest miqat", () => {
    const near = nearestMiqat({ latitude: 24.5, longitude: 39.6 }, MIQATS);
    expect(near?.miqat.id).toBe("dhul_hulayfah");
    expect(near?.approaching).toBe(true);
    const far = nearestMiqat({ latitude: 21.4225, longitude: 39.8262 }, MIQATS);
    expect(far?.miqat.id).toBe("yalamlam");
    expect(far?.distanceKm).toBeGreaterThan(MIQAT_ALERT_RADIUS_KM);
    expect(far?.approaching).toBe(false);
    expect(nearestMiqat({ latitude: 0, longitude: 0 }, [])).toBeNull();
  });

  it("parses HH:MM to the next occurrence and counts down", () => {
    const now = new Date(2026, 10, 23, 13, 0);
    const later = nextLocalTime("14:30", now);
    expect(later?.getHours()).toBe(14);
    expect(later?.getDate()).toBe(23);
    // Two hours ago → assume an overnight flight (tomorrow).
    expect(nextLocalTime("11:00", now)?.getDate()).toBe(24);
    expect(nextLocalTime("25:00", now)).toBeNull();
    expect(nextLocalTime("soon", now)).toBeNull();
    expect(minutesUntilFlightMiqat(later?.toISOString(), now)).toBe(90);
    expect(minutesUntilFlightMiqat(undefined, now)).toBeNull();
    expect(minutesUntilFlightMiqat("nope", now)).toBeNull();
  });
});
