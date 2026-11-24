import type { FocusLockUnlockMode } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import type { FocusWindow } from "./plan";

/**
 * NF-3.13 focus-lock session state machine (pure). The native side (iOS
 * shield action, Android overlay) applies the same rules; the JS copy drives
 * the soft in-app prompt (web, iOS without the entitlement — D17) and decides
 * what JS asks the native module to do.
 *
 *   idle ──window starts──▶ locked ──unlock (allowed by mode)──▶ unlocked
 *     ▲                        │                                    │
 *     └──────────window ends───┴────────────────────────────────────┘
 */

export type FocusUnlockAction = "markedPrayed" | "holdPrayNow" | "emergency";
export type FocusUnlockReason = "prayed" | "gentle" | "emergency";

export type FocusSession =
  | { phase: "idle" }
  | { phase: "locked"; windowId: string; endsAt: number }
  | { phase: "unlocked"; windowId: string; endsAt: number; reason: FocusUnlockReason };

export type FocusSessionEvent =
  | { type: "tick"; active: FocusWindow | null }
  | {
      type: "unlock";
      action: FocusUnlockAction;
      mode: FocusLockUnlockMode;
      emergencyLeft: number;
    };

export const IDLE_SESSION: FocusSession = { phase: "idle" };

/**
 * Whether `action` may end the lock under `mode`:
 * - marking the salah completed ends it in every mode (strict: "ends it early");
 * - the 10 s "I'll pray now" hold works only in `gentle`;
 * - an emergency unlock needs one left today (any mode).
 */
export function canUnlock(
  mode: FocusLockUnlockMode,
  action: FocusUnlockAction,
  emergencyLeft: number,
): boolean {
  switch (action) {
    case "markedPrayed":
      return true;
    case "holdPrayNow":
      return mode === "gentle";
    case "emergency":
      return emergencyLeft > 0;
  }
}

const REASON: Record<FocusUnlockAction, FocusUnlockReason> = {
  markedPrayed: "prayed",
  holdPrayNow: "gentle",
  emergency: "emergency",
};

export function reduceFocusSession(session: FocusSession, event: FocusSessionEvent): FocusSession {
  if (event.type === "tick") {
    const w = event.active;
    if (!w) return session.phase === "idle" ? session : IDLE_SESSION;
    if (session.phase !== "idle" && session.windowId === w.id) {
      // Same window: keep the phase, follow a re-plan that moved its end.
      const endsAt = w.end.getTime();
      return session.endsAt === endsAt ? session : { ...session, endsAt };
    }
    return { phase: "locked", windowId: w.id, endsAt: w.end.getTime() };
  }
  if (session.phase !== "locked") return session;
  if (!canUnlock(event.mode, event.action, event.emergencyLeft)) return session;
  return { ...session, phase: "unlocked", reason: REASON[event.action] };
}

/** Emergency unlocks recorded on `today` (local date of each ISO timestamp). */
export function emergencyUsedOn(log: readonly string[], today: string): number {
  return log.filter((iso) => {
    const d = new Date(iso);
    return !Number.isNaN(d.getTime()) && getLocalDateString(d) === today;
  }).length;
}

export function emergencyLeftToday(log: readonly string[], perDay: number, today: string): number {
  return Math.max(0, perDay - emergencyUsedOn(log, today));
}

/** Neutral count for the weekly coach: emergency unlocks in the 7 days ending `now`. */
export function emergencyCountLastWeek(log: readonly string[], now: Date): number {
  const from = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  return log.filter((iso) => {
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && t > from && t <= now.getTime();
  }).length;
}

/** Merges native-reported unlock times into the local log (dedup, sorted, last 35 days). */
export function mergeEmergencyLog(
  current: readonly string[],
  incoming: readonly string[],
  now: Date,
): string[] {
  const keepFrom = now.getTime() - 35 * 24 * 60 * 60 * 1000;
  const byTime = new Map<number, string>();
  for (const iso of [...current, ...incoming]) {
    const t = new Date(iso).getTime();
    if (Number.isFinite(t) && t >= keepFrom) byTime.set(t, new Date(t).toISOString());
  }
  return [...byTime.entries()].sort((a, b) => a[0] - b[0]).map(([, iso]) => iso);
}
