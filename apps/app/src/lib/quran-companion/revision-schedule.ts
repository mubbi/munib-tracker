import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import type { AyahOutcome, MemorizationRecord, MemorizationStatus } from "./types";

/**
 * Fixed review ladder (§10). Not SM-2: 0 → 1 → 3 → 7 → 14 → 30 days. Dates are
 * the device's local calendar day (`getLocalDateString`), never UTC slices.
 */
export const LADDER_DAYS = [0, 1, 3, 7, 14, 30] as const;

/** Successes needed to reach the top rung (0→30 is five steps), plus two more at 30. */
export const MARK_MEMORIZED_STREAK = LADDER_DAYS.length - 1 + 2;

function nextRung(intervalDays: number): number {
  const idx = LADDER_DAYS.indexOf(intervalDays as (typeof LADDER_DAYS)[number]);
  if (idx < 0) return LADDER_DAYS.find((d) => d > intervalDays) ?? 30;
  return LADDER_DAYS[Math.min(idx + 1, LADDER_DAYS.length - 1)];
}

/** A new ayah: learning, due today. */
export function newRecord(now: Date): MemorizationRecord {
  const today = getLocalDateString(now);
  return {
    status: "learning",
    successStreak: 0,
    intervalDays: 0,
    nextReviewAt: today,
    lastAttemptAt: now.toISOString(),
    lapses: 0,
    updatedAt: now.toISOString(),
  };
}

/**
 * Apply one take's outcome. `success` advances one rung; `lapse` drops to
 * needs-revision due today; `neutral` (all-uncertain, partial, listen-only)
 * neither advances nor lapses but records the attempt.
 */
export function applyOutcome(
  record: MemorizationRecord | undefined,
  outcome: AyahOutcome,
  now: Date,
): MemorizationRecord {
  const base = record ?? newRecord(now);
  const today = getLocalDateString(now);
  const stamp = now.toISOString();
  if (outcome === "success") {
    const intervalDays = nextRung(base.intervalDays);
    return {
      ...base,
      status: "practising",
      successStreak: base.successStreak + 1,
      intervalDays,
      nextReviewAt: addDays(today, intervalDays),
      lastAttemptAt: stamp,
      lastSuccessAt: stamp,
      updatedAt: stamp,
    };
  }
  if (outcome === "lapse") {
    return {
      ...base,
      status: "needs_revision",
      successStreak: 0,
      intervalDays: 0,
      nextReviewAt: today,
      lastAttemptAt: stamp,
      lapses: base.lapses + 1,
      updatedAt: stamp,
    };
  }
  return { ...base, lastAttemptAt: stamp, updatedAt: stamp };
}

/** "Mark memorized" is offered (never automatic) after two advances at 30 days. */
export function shouldOfferMarkMemorized(record: MemorizationRecord | undefined): boolean {
  return !!record && record.intervalDays === 30 && record.successStreak >= MARK_MEMORIZED_STREAK;
}

/** Manual status change from the revision screen. */
export function setManualStatus(
  record: MemorizationRecord | undefined,
  status: MemorizationStatus,
  now: Date,
): MemorizationRecord {
  const base = record ?? newRecord(now);
  const today = getLocalDateString(now);
  const stamp = now.toISOString();
  if (status === "practising") {
    return { ...base, status, updatedAt: stamp };
  }
  return {
    ...base,
    status,
    intervalDays: 0,
    successStreak: status === "needs_revision" ? 0 : base.successStreak,
    nextReviewAt: today,
    updatedAt: stamp,
  };
}

/** "Not now": push to tomorrow without a lapse and without touching hifz. */
export function snoozeToTomorrow(
  record: MemorizationRecord | undefined,
  now: Date,
): MemorizationRecord {
  const base = record ?? newRecord(now);
  return {
    ...base,
    nextReviewAt: addDays(getLocalDateString(now), 1),
    updatedAt: now.toISOString(),
  };
}
