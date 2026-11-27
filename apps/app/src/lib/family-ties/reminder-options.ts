import type { FamilyTiesItem, Relative } from "@munib-tracker/shared/types";

import { vault } from "@/lib/vault";
import { preferencesStore } from "@/stores/preferences-store";

import {
  type FamilyTiesReminderInput,
  familyTiesReminderInput,
  isFamilyTiesSettings,
  isRelative,
  normalizeFamilyTiesSettings,
} from "./model";

/**
 * `buildReminders` inputs for family ties, read straight from the vault (the
 * store is lazy). Names and numbers never leave this function — only due
 * dates. `undefined` when the toggle is off, nobody is tracked, or the vault
 * can't be opened on this device. Never throws.
 */
export async function familyTiesReminderOptions(): Promise<FamilyTiesReminderInput | undefined> {
  if (preferencesStore.getState().prefs.notificationPrefs.familyTies === false) return undefined;
  try {
    const doc = await vault.read<FamilyTiesItem>("relatives");
    const items = Object.values(doc.items).filter((item) => !item.deletedAt);
    const relatives = items.filter(isRelative) as Relative[];
    if (relatives.length === 0) return undefined;
    return familyTiesReminderInput(
      relatives,
      normalizeFamilyTiesSettings(items.find(isFamilyTiesSettings)),
    );
  } catch {
    return undefined;
  }
}
