import type {
  ExcusedReason,
  VoluntaryFastEntry,
  VoluntaryFastStatus,
} from "@munib-tracker/shared/types";
import {
  excusedReasonForDate,
  getLocalDateString,
  isLiveFastEntry,
} from "@munib-tracker/shared/utils";

import { PrayerRepository, QazaRepository } from "@/db";
import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";

import { classifyDate, fastingCalendarContext } from "./calendar";

/**
 * Voluntary fasting mutations (NF-3.2). Every write goes through here so the
 * blocking rules (Eid / Tashriq, hayd) and the qaza roza link stay in one place.
 */

export type MarkFastBlockReason = "eid_tashriq" | "hayd" | "nifas" | "ramadan";

export type MarkFastResult =
  | { ok: true; entry: VoluntaryFastEntry | null }
  | { ok: false; reason: MarkFastBlockReason };

/**
 * Excused reason for a day: the ongoing period for today/future days, the
 * day's own prayer-log flag for the past.
 */
export async function excusedReasonForFastDate(
  date: string,
  today = getLocalDateString(),
): Promise<ExcusedReason | null> {
  if (date >= today) return preferencesStore.getState().prefs.activeExcusedReason ?? null;
  const logs = await PrayerRepository.getByDate(date);
  return excusedReasonForDate(logs, date);
}

/**
 * Pure gate for `fasted`: Eid / Tashriq are prohibited outright, hayd and
 * nifas days can't be fasted (same ruling; sick / travel days may be), Ramadan
 * belongs to its own log.
 */
export function blockReasonFor(
  status: VoluntaryFastStatus,
  classification: { blocking: boolean; isRamadan: boolean },
  excused: ExcusedReason | null,
): MarkFastBlockReason | null {
  if (classification.isRamadan) return "ramadan";
  if (status === "broken") return null;
  if (classification.blocking) return "eid_tashriq";
  if (status === "fasted" && (excused === "hayd" || excused === "nifas")) return excused;
  return null;
}

async function restoreRozaDay(): Promise<void> {
  const tracker = trackerStore.getState();
  const roza = await QazaRepository.getRoza();
  const restored = {
    remaining: roza.remaining + 1,
    completed: Math.max(0, roza.completed - 1),
    estimatedMissed: roza.estimatedMissed,
  };
  if (tracker.isReady) await tracker.setRoza(restored);
  else await QazaRepository.setRoza(restored);
}

/** Apply or undo the roza qaza decrement so the counter matches a live entry (idempotent). */
async function reconcileQaza(date: string): Promise<VoluntaryFastEntry | null> {
  const entry = voluntaryFastingStore.getState().entries[date];
  if (!isLiveFastEntry(entry)) return null;
  const wantCounted = entry.status === "fasted" && entry.asQaza === true;
  const counted = entry.qazaCounted === true;
  if (wantCounted === counted) return entry;

  if (wantCounted) {
    const roza = await QazaRepository.getRoza();
    // No debt left: the fast is still logged as qaza, just nothing to decrement.
    if (roza.remaining <= 0) return entry;
    const tracker = trackerStore.getState();
    if (tracker.isReady) await tracker.performRoza(1);
    else await QazaRepository.performRoza(1);
    return voluntaryFastingStore.getState().writeEntry(date, { qazaCounted: true });
  }

  await restoreRozaDay();
  return voluntaryFastingStore.getState().writeEntry(date, { qazaCounted: false });
}

/** Serialises mutations so a double tap can't decrement the roza counter twice. */
let tail: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = tail.then(task, task);
  tail = run.catch(() => undefined);
  return run;
}

async function ensureLoaded(): Promise<void> {
  if (!voluntaryFastingStore.getState().isReady) await voluntaryFastingStore.getState().load();
}

/**
 * Logs a voluntary fast (`intended` / `fasted` / `broken`). Pass `asQaza` to
 * count a kept fast against the roza qaza debt; `note` for a private note.
 */
export function markFast(
  date: string,
  status: VoluntaryFastStatus,
  options: { asQaza?: boolean; note?: string; today?: string } = {},
): Promise<MarkFastResult> {
  return enqueue(async () => {
    await ensureLoaded();
    const classification = classifyDate(date, fastingCalendarContext());
    const excused = await excusedReasonForFastDate(date, options.today);
    const blocked = blockReasonFor(status, classification, excused);
    if (blocked) return { ok: false, reason: blocked };
    await voluntaryFastingStore.getState().writeEntry(date, {
      status,
      ...(options.asQaza !== undefined ? { asQaza: options.asQaza } : {}),
      ...(options.note !== undefined ? { note: options.note } : {}),
    });
    const entry = await reconcileQaza(date);
    return { ok: true, entry };
  });
}

/** Switches the qaza flag on an existing entry (decrements / restores roza debt as needed). */
export function setFastAsQaza(date: string, asQaza: boolean): Promise<MarkFastResult> {
  return enqueue(async () => {
    await ensureLoaded();
    const current = voluntaryFastingStore.getState().entries[date];
    if (!isLiveFastEntry(current)) return { ok: true, entry: null };
    await voluntaryFastingStore.getState().writeEntry(date, { asQaza });
    return { ok: true, entry: await reconcileQaza(date) };
  });
}

/** Clears a day (tombstoned for sync); a counted qaza fast gives its day back to the debt. */
export function clearFast(date: string): Promise<void> {
  return enqueue(async () => {
    await ensureLoaded();
    const entry = voluntaryFastingStore.getState().entries[date];
    if (!isLiveFastEntry(entry)) return;
    if (entry.qazaCounted) await restoreRozaDay();
    await voluntaryFastingStore.getState().writeEntry(date, null);
  });
}
