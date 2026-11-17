import { getLocalDateString, msUntilNextLocalMidnight } from "@munib-tracker/shared/utils";
import { useEffect, useMemo } from "react";
import { AppState } from "react-native";

import { QuranMemorizationRepository } from "@/db/repositories/quran-memorization-repository";
import { buildDueQueue, type DueItem } from "@/lib/quran-companion/due-queue";
import {
  applyOutcome,
  setManualStatus,
  shouldOfferMarkMemorized,
  snoozeToTomorrow,
} from "@/lib/quran-companion/revision-schedule";
import type {
  AyahOutcome,
  MemorizationRecord,
  MemorizationRecords,
  MemorizationStatus,
} from "@/lib/quran-companion/types";

import { createStore, useStore } from "./create-store";
import { hifzKey, useHifzMap } from "./hifz-store";
import { useCompanionPrefs } from "./quran-companion-prefs-store";

/**
 * Revision ladder state (§10). Writes only from Check, Hide, and Revision takes
 * with a listener (D8, D9). Never writes hifz — "Mark memorized" is a separate,
 * explicit action on the summary.
 */
interface MemorizationState {
  records: MemorizationRecords;
  isReady: boolean;
  /** Local day the due count was last computed for (day-rollover refresh). */
  day: string;
  load: () => Promise<void>;
  applyOutcomes: (
    outcomes: { surah: number; ayah: number; outcome: AyahOutcome }[],
  ) => Promise<void>;
  setStatus: (surah: number, ayah: number, status: MemorizationStatus) => Promise<void>;
  snooze: (surah: number, ayah: number) => Promise<void>;
  /** Recompute "today" (called on foreground / midnight). */
  refreshDay: () => void;
}

export const quranMemorizationStore = createStore<MemorizationState>((set, get) => ({
  records: {},
  isReady: false,
  day: getLocalDateString(),

  async load() {
    const records = await QuranMemorizationRepository.getAll();
    set({ records, isReady: true, day: getLocalDateString() });
    armDayRollover();
  },

  async applyOutcomes(outcomes) {
    if (!outcomes.length) return;
    const now = new Date();
    const changed: Record<string, MemorizationRecord> = {};
    const records = { ...get().records };
    for (const { surah, ayah, outcome } of outcomes) {
      const key = hifzKey(surah, ayah);
      const next = applyOutcome(records[key], outcome, now);
      records[key] = next;
      changed[key] = next;
    }
    set({ records });
    await QuranMemorizationRepository.upsert(changed);
  },

  async setStatus(surah, ayah, status) {
    const key = hifzKey(surah, ayah);
    const next = setManualStatus(get().records[key], status, new Date());
    set({ records: { ...get().records, [key]: next } });
    await QuranMemorizationRepository.upsert({ [key]: next });
  },

  async snooze(surah, ayah) {
    const key = hifzKey(surah, ayah);
    const next = snoozeToTomorrow(get().records[key], new Date());
    set({ records: { ...get().records, [key]: next } });
    await QuranMemorizationRepository.upsert({ [key]: next });
  },

  refreshDay() {
    const day = getLocalDateString();
    if (day !== get().day) set({ day });
  },
}));

let rolloverArmed = false;

/**
 * Keep "today" current while the app is open: at local midnight and on every
 * return to the foreground (§11 Phase 4). Armed once, on first load — the store
 * stays lazy until a practice surface needs it.
 */
function armDayRollover(): void {
  if (rolloverArmed) return;
  rolloverArmed = true;
  const scheduleMidnight = () => {
    setTimeout(() => {
      quranMemorizationStore.getState().refreshDay();
      scheduleMidnight();
    }, msUntilNextLocalMidnight());
  };
  scheduleMidnight();
  AppState.addEventListener("change", (next) => {
    if (next === "active") quranMemorizationStore.getState().refreshDay();
  });
}

export function useEnsureMemorizationLoaded(): void {
  useEffect(() => {
    if (!quranMemorizationStore.getState().isReady) void quranMemorizationStore.getState().load();
  }, []);
}

export function useMemorizationRecords(): MemorizationRecords {
  return useStore(quranMemorizationStore, (s) => s.records);
}

export function useMemorizationRecord(surah: number, ayah: number): MemorizationRecord | undefined {
  return useStore(quranMemorizationStore, (s) => s.records[hifzKey(surah, ayah)]);
}

/** The due queue for today (§10), combining the ladder and hifz "review" marks. */
export function useDueQueue(): DueItem[] {
  const records = useMemorizationRecords();
  const hifz = useHifzMap();
  const prefs = useCompanionPrefs();
  const day = useStore(quranMemorizationStore, (s) => s.day);
  return useMemo(
    () =>
      buildDueQueue({
        records,
        hifz,
        includeHifzReview: prefs.includeHifzReview,
        today: day,
      }),
    [records, hifz, prefs.includeHifzReview, day],
  );
}

export function canOfferMarkMemorized(record: MemorizationRecord | undefined): boolean {
  return shouldOfferMarkMemorized(record);
}

const actions = {
  applyOutcomes: (o: Parameters<MemorizationState["applyOutcomes"]>[0]) =>
    quranMemorizationStore.getState().applyOutcomes(o),
  setStatus: (s: number, a: number, st: MemorizationStatus) =>
    quranMemorizationStore.getState().setStatus(s, a, st),
  snooze: (s: number, a: number) => quranMemorizationStore.getState().snooze(s, a),
} as const;

export function useMemorizationActions() {
  return actions;
}
