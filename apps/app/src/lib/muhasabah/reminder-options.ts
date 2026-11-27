import type { MuhasabahConfig, MuhasabahItem } from "@munib-tracker/shared/types";

import { vault } from "@/lib/vault";
import { preferencesStore } from "@/stores/preferences-store";

import { isMuhasabahConfig, isMuhasabahEntry, normalizeMuhasabahConfig } from "./model";
import type { MuhasabahReminderInput } from "./reminders";

/**
 * `buildReminders` inputs for the nightly muhasabah, read straight from the
 * vault (the store is lazy and usually not loaded at launch). Only the chosen
 * time and the reviewed dates leave this function — never text. `undefined`
 * when the toggle is off. Never throws: a locked vault falls back to bedtime.
 */
export async function muhasabahReminderOptions(): Promise<MuhasabahReminderInput | undefined> {
  if (preferencesStore.getState().prefs.notificationPrefs.muhasabah !== true) return undefined;
  try {
    const doc = await vault.read<MuhasabahItem>("muhasabah");
    const items = Object.values(doc.items).filter((item) => !item.deletedAt);
    const config = normalizeMuhasabahConfig(
      items.find(isMuhasabahConfig) as Partial<MuhasabahConfig> | undefined,
    );
    return {
      time: config.prefs.time,
      reviewedDates: items.filter(isMuhasabahEntry).map((entry) => entry.date),
    };
  } catch {
    return { time: "bedtime", reviewedDates: [] };
  }
}
