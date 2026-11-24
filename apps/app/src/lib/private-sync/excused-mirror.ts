import type { ExcusedReason } from "@munib-tracker/shared/types";

import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

import { UNKNOWN_LOCAL, type VaultMirror } from "./vault-mirror";

/**
 * D46 vault document `excused`: the excused period syncs only here (ciphertext).
 *
 * - `active` → `{ reason }`: `preferences.activeExcusedReason` (`null` = explicitly
 *   resumed; never set = no item).
 * - `day:<YYYY-MM-DD>` → `{ reason }`: the reason on that day's excused prayer
 *   logs. The logs themselves still sync with `isExcused`, without the reason.
 *   A day whose logs arrived without a reason reads as unknown, so the doc's
 *   reason is applied instead of being treated as a local delete.
 */
export interface ExcusedItem {
  reason: ExcusedReason | null;
}

export const EXCUSED_ACTIVE_ID = "active";
const DAY_PREFIX = "day:";

export function excusedDayId(date: string): string {
  return `${DAY_PREFIX}${date}`;
}

async function readLocal(): Promise<Record<string, ExcusedItem | typeof UNKNOWN_LOCAL>> {
  const [prefs, logs] = await Promise.all([PreferencesRepository.get(), PrayerRepository.getAll()]);
  const items: Record<string, ExcusedItem | typeof UNKNOWN_LOCAL> = {};
  if (prefs.activeExcusedReason !== undefined) {
    items[EXCUSED_ACTIVE_ID] = { reason: prefs.activeExcusedReason };
  }
  for (const log of logs) {
    if (!log.isExcused) continue;
    const id = excusedDayId(log.date);
    if (log.excusedReason) items[id] = { reason: log.excusedReason };
    else if (items[id] === undefined) items[id] = UNKNOWN_LOCAL;
  }
  return items;
}

async function applyToLocal(changes: Record<string, ExcusedItem | null>): Promise<void> {
  let prefsChanged = false;
  const dayReasons: Record<string, ExcusedReason> = {};
  for (const [id, item] of Object.entries(changes)) {
    if (id === EXCUSED_ACTIVE_ID) {
      await PreferencesRepository.patchLocal({ activeExcusedReason: item?.reason ?? null });
      prefsChanged = true;
    } else if (id.startsWith(DAY_PREFIX) && item?.reason) {
      dayReasons[id.slice(DAY_PREFIX.length)] = item.reason;
    }
    // A day the other device no longer marks excused arrives through the
    // prayer log itself (`isExcused: false`), so there's nothing to undo here.
  }
  const daysChanged =
    Object.keys(dayReasons).length > 0
      ? await PrayerRepository.setExcusedReasonsLocal(dayReasons)
      : 0;
  if (prefsChanged && preferencesStore.getState().isReady) {
    await preferencesStore.getState().refreshFromDb();
  }
  if ((prefsChanged || daysChanged > 0) && trackerStore.getState().isReady) {
    await trackerStore.getState().refresh();
  }
}

export const excusedMirror: VaultMirror<ExcusedItem> = {
  docId: "excused",
  readLocal,
  applyToLocal,
};
