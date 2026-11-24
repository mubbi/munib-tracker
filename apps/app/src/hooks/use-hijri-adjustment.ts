import type { HijriAdjustment } from "@munib-tracker/shared/types";

import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * The stored Hijri adjustment (D14). Its identity changes on every edit, so it
 * doubles as a memo key for screens that cache Hijri-derived values.
 */
export function useHijriAdjustment(): HijriAdjustment | undefined {
  return useStore(preferencesStore, (s) => s.prefs.hijriAdjustment);
}
