import type { ExcusedReason } from "../types/prayer";
import {
  type MiqatPoint,
  UMRAH_STEPS,
  type UmrahHairChoice,
  type UmrahRoundKind,
  type UmrahSession,
  type UmrahSessionMap,
  type UmrahStep,
  type UmrahTravelMode,
} from "../types/umrah";

/**
 * Pure state machine for Umrah mode (NF-3.4). Every transition returns a new
 * session stamped with `updatedAt = now`; nothing here reads the clock.
 */

/** Circuits of tawaf and courses of sa'i. */
export const UMRAH_ROUNDS = 7;

/** "Approaching miqat" radius for the foreground land check. */
export const MIQAT_ALERT_RADIUS_KM = 20;

export function umrahStepIndex(step: UmrahStep): number {
  return UMRAH_STEPS.indexOf(step);
}

export function isUmrahStep(value: unknown): value is UmrahStep {
  return typeof value === "string" && (UMRAH_STEPS as readonly string[]).includes(value);
}

export function nextUmrahStep(step: UmrahStep): UmrahStep | null {
  return UMRAH_STEPS[umrahStepIndex(step) + 1] ?? null;
}

export function previousUmrahStep(step: UmrahStep): UmrahStep | null {
  const index = umrahStepIndex(step);
  return index > 0 ? (UMRAH_STEPS[index - 1] ?? null) : null;
}

export function createUmrahSession(id: string, now: string): UmrahSession {
  return {
    id,
    startedAt: now,
    updatedAt: now,
    step: "prepare",
    tawafLaps: 0,
    saiLaps: 0,
    log: [{ step: "prepare", at: now }],
  };
}

function lapsOf(session: UmrahSession, kind: UmrahRoundKind): number {
  return kind === "tawaf" ? session.tawafLaps : session.saiLaps;
}

function lapTimesOf(session: UmrahSession, kind: UmrahRoundKind): string[] {
  return (kind === "tawaf" ? session.tawafLapTimes : session.saiLapTimes) ?? [];
}

/** The counted step must reach 7 before moving on; every other step can always advance. */
export function canAdvanceUmrah(session: UmrahSession): boolean {
  if (session.step === "complete") return false;
  if (session.step === "tawaf") return session.tawafLaps >= UMRAH_ROUNDS;
  if (session.step === "sai") return session.saiLaps >= UMRAH_ROUNDS;
  return true;
}

/** Moves to `step` (any step — a pilgrim may open the app already in ihram) and logs it. */
export function goToUmrahStep(session: UmrahSession, step: UmrahStep, now: string): UmrahSession {
  if (session.step === step) return session;
  return {
    ...session,
    step,
    updatedAt: now,
    completedAt: step === "complete" ? (session.completedAt ?? now) : session.completedAt,
    log: [...session.log, { step, at: now }],
  };
}

/** Next step when allowed (7 rounds done on tawaf / sa'i); otherwise unchanged. */
export function advanceUmrahSession(session: UmrahSession, now: string): UmrahSession {
  const next = nextUmrahStep(session.step);
  if (!next || !canAdvanceUmrah(session)) return session;
  return goToUmrahStep(session, next, now);
}

export function backUmrahSession(session: UmrahSession, now: string): UmrahSession {
  const previous = previousUmrahStep(session.step);
  return previous ? goToUmrahStep(session, previous, now) : session;
}

/** Counts one round; capped at 7 (returns the same session at the cap). */
export function countUmrahRound(
  session: UmrahSession,
  kind: UmrahRoundKind,
  now: string,
): UmrahSession {
  const laps = lapsOf(session, kind);
  if (laps >= UMRAH_ROUNDS) return session;
  const times = [...lapTimesOf(session, kind).slice(0, laps), now];
  return kind === "tawaf"
    ? { ...session, tawafLaps: laps + 1, tawafLapTimes: times, updatedAt: now }
    : { ...session, saiLaps: laps + 1, saiLapTimes: times, updatedAt: now };
}

/** Removes the last counted round (no-op at 0). */
export function undoUmrahRound(
  session: UmrahSession,
  kind: UmrahRoundKind,
  now: string,
): UmrahSession {
  const laps = lapsOf(session, kind);
  if (laps <= 0) return session;
  const times = lapTimesOf(session, kind).slice(0, laps - 1);
  return kind === "tawaf"
    ? { ...session, tawafLaps: laps - 1, tawafLapTimes: times, updatedAt: now }
    : { ...session, saiLaps: laps - 1, saiLapTimes: times, updatedAt: now };
}

export function setUmrahTravel(
  session: UmrahSession,
  patch: { travelMode?: UmrahTravelMode; flightMiqatAt?: string | null },
  now: string,
): UmrahSession {
  const next: UmrahSession = { ...session, updatedAt: now };
  if (patch.travelMode) next.travelMode = patch.travelMode;
  if (patch.flightMiqatAt === null) delete next.flightMiqatAt;
  else if (patch.flightMiqatAt) next.flightMiqatAt = patch.flightMiqatAt;
  return next;
}

export function setUmrahHairChoice(
  session: UmrahSession,
  hairChoice: UmrahHairChoice,
  now: string,
): UmrahSession {
  return session.hairChoice === hairChoice ? session : { ...session, hairChoice, updatedAt: now };
}

/**
 * Sa'i direction of the NEXT course: courses 1, 3, 5, 7 run Safa → Marwah and
 * 2, 4, 6 return; after the 7th the pilgrim is at Marwah (Muslim 1218).
 */
export function saiDirection(saiLaps: number): "safa_to_marwah" | "marwah_to_safa" | "done" {
  if (saiLaps >= UMRAH_ROUNDS) return "done";
  return saiLaps % 2 === 0 ? "safa_to_marwah" : "marwah_to_safa";
}

/** When the user entered `step` most recently (the per-lap timer's start for lap 1). */
export function stepEnteredAt(session: UmrahSession, step: UmrahStep): string | undefined {
  for (let i = session.log.length - 1; i >= 0; i -= 1) {
    const entry = session.log[i];
    if (entry?.step === step) return entry.at;
  }
  return undefined;
}

/** Duration of each counted round in ms (lap 1 is measured from entering the step). */
export function umrahLapDurations(session: UmrahSession, kind: UmrahRoundKind): number[] {
  const times = lapTimesOf(session, kind);
  const start = stepEnteredAt(session, kind);
  const out: number[] = [];
  let previous = start ? Date.parse(start) : Number.NaN;
  for (const time of times) {
    const at = Date.parse(time);
    out.push(Number.isFinite(previous) && Number.isFinite(at) ? Math.max(0, at - previous) : 0);
    previous = at;
  }
  return out;
}

export type UmrahLockReason = "tawaf_purity" | "salah_purity" | "sai_after_tawaf";

/**
 * Steps that wait during hayd or nifas: tawaf ("do everything the pilgrim does
 * except tawaf of the House until you are pure" — Bukhari 305), the two rakahs
 * after it (no salah during hayd), and sa'i while tawaf is not yet done (in
 * Umrah sa'i follows tawaf — Bukhari 1650). Once tawaf is complete, sa'i is not
 * locked: purity is not a condition for sa'i (proof log). Other rites continue.
 */
export function umrahStepLockReason(
  step: UmrahStep,
  excused: ExcusedReason | null | undefined,
  tawafLaps = 0,
): UmrahLockReason | null {
  if (excused !== "hayd" && excused !== "nifas") return null;
  if (step === "tawaf" && tawafLaps < UMRAH_ROUNDS) return "tawaf_purity";
  if (step === "two_rakah_behind_maqam") return "salah_purity";
  if (step === "sai" && tawafLaps < UMRAH_ROUNDS) return "sai_after_tawaf";
  return null;
}

/** The session in progress: not completed, not deleted, most recently updated. */
export function activeUmrahSession(sessions: UmrahSessionMap): UmrahSession | null {
  let best: UmrahSession | null = null;
  for (const session of Object.values(sessions)) {
    if (session.deleted || session.step === "complete") continue;
    if (!best || session.updatedAt > best.updatedAt) best = session;
  }
  return best;
}

/** Completed sessions, newest first. */
export function completedUmrahSessions(sessions: UmrahSessionMap): UmrahSession[] {
  return Object.values(sessions)
    .filter((session) => !session.deleted && session.step === "complete")
    .sort((a, b) => (b.completedAt ?? b.updatedAt).localeCompare(a.completedAt ?? a.updatedAt));
}

/** How long a just-completed session stays on screen (the congratulations view). */
export const UMRAH_COMPLETE_VISIBLE_MS = 12 * 60 * 60 * 1000;

/** The session the screen shows: the active one, else one completed in the last 12 h. */
export function currentUmrahSession(sessions: UmrahSessionMap, now: Date): UmrahSession | null {
  const active = activeUmrahSession(sessions);
  if (active) return active;
  const [latest] = completedUmrahSessions(sessions);
  if (!latest) return null;
  const doneAt = Date.parse(latest.completedAt ?? latest.updatedAt);
  return now.getTime() - doneAt < UMRAH_COMPLETE_VISIBLE_MS ? latest : null;
}

// ── Miqat proximity ────────────────────────────────────────────────────────────

const EARTH_RADIUS_KM = 6371.0088;

/** Great-circle distance in km (haversine). */
export function haversineKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface MiqatProximity {
  miqat: MiqatPoint;
  distanceKm: number;
  /** Within {@link MIQAT_ALERT_RADIUS_KM}. */
  approaching: boolean;
}

/** The nearest miqat to `position`, or null for an empty dataset. */
export function nearestMiqat(
  position: { latitude: number; longitude: number },
  miqats: readonly MiqatPoint[],
  radiusKm = MIQAT_ALERT_RADIUS_KM,
): MiqatProximity | null {
  let best: MiqatProximity | null = null;
  for (const miqat of miqats) {
    const distanceKm = haversineKm(position, miqat);
    if (!best || distanceKm < best.distanceKm) {
      best = { miqat, distanceKm, approaching: distanceKm <= radiusKm };
    }
  }
  return best;
}

/** Whole minutes until the user's flight-crossing estimate (negative once passed; null if unset/invalid). */
export function minutesUntilFlightMiqat(
  flightMiqatAt: string | undefined,
  now: Date,
): number | null {
  if (!flightMiqatAt) return null;
  const at = Date.parse(flightMiqatAt);
  if (!Number.isFinite(at)) return null;
  return Math.floor((at - now.getTime()) / 60_000);
}

/**
 * Next occurrence of a local "HH:MM" (today, or tomorrow when already passed by
 * more than an hour — an overnight flight). Returns null for a malformed time.
 */
export function nextLocalTime(hhmm: string, now: Date): Date | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  const at = new Date(now);
  at.setHours(hours, minutes, 0, 0);
  if (at.getTime() < now.getTime() - 60 * 60_000) at.setDate(at.getDate() + 1);
  return at;
}

// ── Sync ───────────────────────────────────────────────────────────────────────

const ISO_LIKE = /^\d{4}-\d{2}-\d{2}T/;

function isIso(value: unknown): value is string {
  return typeof value === "string" && ISO_LIKE.test(value);
}

function clampLaps(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 0;
  return Math.min(UMRAH_ROUNDS, Math.max(0, n));
}

function cleanTimes(value: unknown, laps: number): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const times = value.filter(isIso).slice(0, laps);
  return times.length ? times : undefined;
}

/** Coerces a stored / remote value into a clean session map, dropping malformed rows. */
export function asUmrahSessionMap(value: unknown): UmrahSessionMap {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return {};
  const out: UmrahSessionMap = {};
  for (const [id, raw] of Object.entries(value as Record<string, unknown>)) {
    if (raw == null || typeof raw !== "object") continue;
    const row = raw as Partial<UmrahSession>;
    if (!isIso(row.startedAt) || !isIso(row.updatedAt) || !isUmrahStep(row.step)) continue;
    const tawafLaps = clampLaps(row.tawafLaps);
    const saiLaps = clampLaps(row.saiLaps);
    const log = Array.isArray(row.log)
      ? row.log
          .filter((entry) => entry && isUmrahStep(entry.step) && isIso(entry.at))
          .slice(-200)
          .map((entry) => ({ step: entry.step, at: entry.at }))
      : [];
    const session: UmrahSession = {
      id,
      startedAt: row.startedAt,
      updatedAt: row.updatedAt,
      step: row.step,
      tawafLaps,
      saiLaps,
      log,
    };
    const tawafLapTimes = cleanTimes(row.tawafLapTimes, tawafLaps);
    const saiLapTimes = cleanTimes(row.saiLapTimes, saiLaps);
    if (tawafLapTimes) session.tawafLapTimes = tawafLapTimes;
    if (saiLapTimes) session.saiLapTimes = saiLapTimes;
    if (row.travelMode === "land" || row.travelMode === "air") session.travelMode = row.travelMode;
    if (isIso(row.flightMiqatAt)) session.flightMiqatAt = row.flightMiqatAt;
    if (row.hairChoice === "halq" || row.hairChoice === "taqsir") {
      session.hairChoice = row.hairChoice;
    }
    if (isIso(row.completedAt)) session.completedAt = row.completedAt;
    if (row.deleted === true) session.deleted = true;
    out[id] = session;
  }
  return out;
}

/**
 * Per-session last-write-wins merge for the `umrah_sessions` sync blob: union of
 * ids; on a clash the later `updatedAt` wins (ties keep local). Tombstones merge
 * like any session, so a removal propagates. Pure.
 */
export function mergeUmrahSessions(local: unknown, remote: unknown): UmrahSessionMap {
  const merged: UmrahSessionMap = { ...asUmrahSessionMap(local) };
  for (const [id, remoteSession] of Object.entries(asUmrahSessionMap(remote))) {
    const localSession = merged[id];
    if (!localSession || remoteSession.updatedAt > localSession.updatedAt) {
      merged[id] = remoteSession;
    }
  }
  return merged;
}
