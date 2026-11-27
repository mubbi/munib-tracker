import { khatmPercentComplete } from "@/lib/khatm";
import { khatmPracticeCreditedAyahs, khatmStore } from "@/stores/khatm-store";
import { quranReadingLogStore } from "@/stores/quran-reading-log-store";

import {
  planKhatmCredit,
  type ReadingCreditPlan,
  type ReadingCreditResult,
} from "./reading-credit";

/**
 * D68: writes a planned reading credit through the normal stores — the D40
 * reading log (blob entity `quran_reading_log`) and the personal khatm (blob
 * entity `khatm`) — so both sync and back up like any other edit. Best-effort:
 * a failed write never fails saving the practice session.
 *
 * D72: khatm only counts ayahs practice hasn't credited in the running cycle.
 * Group khatm (`/khatm-groups`) parts are never marked from practice.
 */
export async function applyReadingCredit(plan: ReadingCreditPlan): Promise<ReadingCreditResult> {
  let ayahs = 0;
  try {
    await quranReadingLogStore
      .getState()
      .record(plan.date, { seconds: plan.seconds, ayahs: plan.ayahs.length, pages: 0 });
    ayahs = plan.ayahs.length;
  } catch {
    // The reading log is a convenience signal; never fail a practice save on it.
  }
  let khatm: ReadingCreditResult["khatm"] = null;
  if (plan.khatmAyahs.length > 0) {
    try {
      khatm = await creditPersonalKhatm(plan);
    } catch {
      khatm = null;
    }
  }
  return { sessionId: plan.sessionId, ayahs, khatm };
}

/**
 * Moves an active personal khatm plan forward by the units the session's
 * not-yet-credited ayahs add, and records those ayahs for the cycle (D72).
 */
async function creditPersonalKhatm(plan: ReadingCreditPlan): Promise<ReadingCreditResult["khatm"]> {
  const store = khatmStore.getState();
  if (!store.isReady) await store.load();
  const state = khatmStore.getState();
  if (!state.plan) return null;
  const unit = state.unit ?? state.plan.unit ?? "ayah";
  const before = state.ayahsRead;
  const { fresh, units } = planKhatmCredit({
    surah: plan.surah,
    ayahs: plan.khatmAyahs,
    credited: khatmPracticeCreditedAyahs(state),
    unit,
  });
  if (fresh.length === 0) {
    return { added: 0, unit, percent: khatmPercentComplete(before, unit), alreadyCounted: true };
  }
  await khatmStore.getState().creditPractice(fresh, units);
  const read = khatmStore.getState().ayahsRead;
  const added = read - before;
  if (added <= 0) return null;
  return { added, unit, percent: khatmPercentComplete(read, unit) };
}

/**
 * D73: kids recite-along → the device's daily reading log only (never khatm,
 * never practice history). `ayahs` is the count of newly completed ayahs; the
 * caller keeps them unique per kids session. Best-effort.
 */
export async function applyKidsReadingCredit(date: string, ayahs: number): Promise<boolean> {
  if (!(ayahs > 0)) return false;
  try {
    await quranReadingLogStore.getState().record(date, { ayahs, seconds: 0, pages: 0 });
    return true;
  } catch {
    return false;
  }
}
