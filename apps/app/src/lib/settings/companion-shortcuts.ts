/**
 * Qur'an practice shortcuts (§4.5.2): the practice hub, session toolbar and the
 * practice settings screen patch companion prefs through the registered
 * settings (`quran.practice.*`, the revision reminder under Notifications), so
 * every place shares one write path and its side effects. Non-setting state
 * (resume passage, coach dismissal, consent timestamp) is written directly.
 */
import type { QuranCompanionPrefs } from "@/lib/quran-companion/types";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";

import { getSetting } from "./registry";
import { setSetting } from "./shortcuts";

type CompanionKey = keyof QuranCompanionPrefs;

/** Companion fields that are app state, not settings (`INTERNAL_FIELDS`). */
const INTERNAL_KEYS = new Set<CompanionKey>([
  "schemaVersion",
  "coachDismissed",
  "lastPassage",
  "pronunciationConsentAt",
]);

function settingIdFor(key: CompanionKey): string {
  if (key === "revisionReminder") return "notifications.quran.revisionReminder";
  return `quran.practice.${String(key)}`;
}

/** Drop-in for `useCompanionPrefsActions().update` in practice UI. */
export async function updateCompanionPrefs(patch: Partial<QuranCompanionPrefs>): Promise<void> {
  const internal: Partial<QuranCompanionPrefs> = {};
  for (const key of Object.keys(patch) as CompanionKey[]) {
    if (INTERNAL_KEYS.has(key)) {
      (internal as Record<string, unknown>)[key] = patch[key];
      continue;
    }
    const id = settingIdFor(key);
    if (!getSetting(id))
      throw new Error(`Practice pref "${String(key)}" has no registered setting`);
    await setSetting(id, patch[key]);
  }
  if (Object.keys(internal).length > 0) {
    await quranCompanionPrefsStore.getState().update(internal);
  }
}
