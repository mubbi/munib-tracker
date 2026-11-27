import type { CoachContext } from "@munib-tracker/shared/types";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import {
  PrayerRepository,
  QazaRepository,
  QuranPracticeRepository,
  QuranRepository,
  ZikrRepository,
} from "@/db";
import { zikrCountsByDate } from "@/lib/adhkar-history";
import { readFamilyTiesSummary } from "@/lib/family-ties/family-ties-store";
import { readMuhasabahWeekSummary } from "@/lib/muhasabah/muhasabah-store";
import { focusLockStore } from "@/stores/focus-lock-store";
import { khatmStore } from "@/stores/khatm-store";
import { khushuStore } from "@/stores/khushu-store";
import { preferencesStore } from "@/stores/preferences-store";
import { getQuranReadingLog } from "@/stores/quran-reading-log-store";
import { sadaqahStore } from "@/stores/sadaqah-store";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";

import { buildCoachContext } from "./context";

async function ensureLoaded(store: {
  getState: () => { isReady: boolean; load: () => Promise<void> };
}): Promise<void> {
  if (!store.getState().isReady) await store.getState().load();
}

/**
 * Reads every tracker through its public API (repositories, stores and the
 * vault summary functions — counts only) and builds the coach context for the
 * week starting `weekStart`. Runs entirely on the device (D3).
 */
export async function loadCoachContext(
  weekStart: string,
  today: string = getLocalDateString(),
): Promise<CoachContext> {
  await Promise.all([
    ensureLoaded(khatmStore),
    ensureLoaded(khushuStore),
    ensureLoaded(sadaqahStore),
    ensureLoaded(sunnahHabitsStore),
    ensureLoaded(voluntaryFastingStore),
    ensureLoaded(focusLockStore),
  ]);
  const weekEnd = addDays(weekStart, 6);
  const [
    prayerLogs,
    zikrProgress,
    qazaCounters,
    qazaDailyProgress,
    qazaSchedule,
    quranReadingProgress,
    quranReadingLog,
    practice,
    muhasabah,
    family,
  ] = await Promise.all([
    PrayerRepository.getAll(),
    ZikrRepository.getAll(),
    QazaRepository.getCounters(),
    QazaRepository.getAllDailyProgress(),
    QazaRepository.getSchedule(),
    QuranRepository.getReadingProgress(),
    getQuranReadingLog(),
    QuranPracticeRepository.get(),
    // Vault: counts only; null when it can't be opened (those rules are skipped).
    readMuhasabahWeekSummary(weekStart),
    readFamilyTiesSummary(weekEnd),
  ]);

  const byDate = zikrCountsByDate(zikrProgress);
  const sadaqahDates = new Set(
    sadaqahStore.getState().log.map((entry) => getLocalDateString(new Date(entry.at))),
  );
  const khatm = khatmStore.getState();
  const prefs = preferencesStore.getState().prefs;
  const focusLock = focusLockStore.getState();

  return buildCoachContext({
    today,
    weekStart,
    prayerLogs,
    zikrProgress,
    qazaCounters,
    qazaDailyProgress,
    qazaSchedule,
    khatm: { plan: khatm.plan, read: khatm.ayahsRead },
    khushu: khushuStore.getState().items,
    quranReadingProgress,
    quranReadingLog,
    practiceSessionEnds: practice.items.map((item) => item.endedAt),
    habits: sunnahHabitsStore.getState().data,
    habitContext: { zikrCountsFor: (date) => byDate.get(date), sadaqahDates },
    voluntaryFasting: voluntaryFastingStore.getState().entries,
    prefs,
    muhasabah,
    family,
    focusLock: focusLock.setupDone ? { emergencyLog: focusLock.emergencyLog } : null,
  });
}
