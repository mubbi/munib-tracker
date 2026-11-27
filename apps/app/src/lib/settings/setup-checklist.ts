import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { createStore, useStore } from "@/stores/create-store";
import { setDevicePreferences } from "@/stores/device-preferences-store";

import type { PlatformCtx, SettingId, SettingsSnapshot } from "./types";

export type SetupItemId = "location" | "notifications" | "madhhab" | "language" | "method";

/** Items cleared by a stored "reviewed" marker (device preferences, ISO date). */
export type ReviewedSetupItem = "language" | "method";

export interface SetupItem {
  id: SetupItemId;
  /** Deep-link target (`settingHref(settingId)`). */
  settingId: SettingId;
  titleKey: string;
}

/**
 * "Finish setting up" (§4.5.3): important things still unset — location still
 * the Makkah default, reminders off, madhhab undecided (NF-3.0a), language not
 * yet confirmed, calculation method never reviewed. The last two clear once the
 * setting is written or the item is opened from the card ({@link markSetupReviewed}).
 */
export function pendingSetupItems(snapshot: SettingsSnapshot, ctx: PlatformCtx): SetupItem[] {
  const items: SetupItem[] = [];
  if (snapshot.location.source === "default") {
    items.push({
      id: "location",
      settingId: "prayer-times.location",
      titleKey: "settingsPanel.setup.location",
    });
  }
  if (!ctx.tv && !snapshot.prefs.notificationPrefs.masterEnabled) {
    items.push({
      id: "notifications",
      settingId: "notifications.master",
      titleKey: "settingsPanel.setup.notifications",
    });
  }
  if (snapshot.prefs.madhhab === undefined) {
    items.push({
      id: "madhhab",
      settingId: "fiqh.madhhab",
      titleKey: "settingsStep4.setup.madhhab",
    });
  }
  if (!snapshot.device.languageConfirmedAt) {
    items.push({
      id: "language",
      settingId: "language.app",
      titleKey: "settingsStep4.setup.language",
    });
  }
  if (!snapshot.device.methodReviewedAt) {
    items.push({
      id: "method",
      settingId: "prayer-times.method",
      titleKey: "settingsStep4.setup.method",
    });
  }
  return items;
}

/** Record that the user confirmed their language / reviewed the calculation method. */
export function markSetupReviewed(
  item: ReviewedSetupItem,
  nowIso: string = new Date().toISOString(),
): Promise<void> {
  return setDevicePreferences(
    item === "language" ? { languageConfirmedAt: nowIso } : { methodReviewedAt: nowIso },
  );
}

/** Opening an item from the card counts as reviewing it (the row shows the current value). */
export async function openSetupItem(id: SetupItemId): Promise<void> {
  if (id === "language" || id === "method") await markSetupReviewed(id);
}

/** One-time "Settings has a new layout — search for anything" tip on the hub. */
export const LAYOUT_TIP_ID = "layoutTip";

export function dismissLayoutTip(): Promise<void> {
  return dismissSetupIds([LAYOUT_TIP_ID]);
}

interface DismissState {
  dismissed: string[];
  isReady: boolean;
}

/** Device-local dismissals (`DB_KEYS.settingsSetupDismissed`, never synced). */
export const setupDismissStore = createStore<DismissState>(() => ({
  dismissed: [],
  isReady: false,
}));

export async function loadSetupDismissed(): Promise<void> {
  if (setupDismissStore.getState().isReady) return;
  const dismissed = await readJSON<string[]>(DB_KEYS.settingsSetupDismissed, []);
  setupDismissStore.setState({ dismissed, isReady: true });
}

/** Dismiss the card for the items currently showing (a new missing item re-shows it). */
export function dismissSetupItems(ids: readonly SetupItemId[]): Promise<void> {
  return dismissSetupIds(ids);
}

async function dismissSetupIds(ids: readonly string[]): Promise<void> {
  const dismissed = [...new Set([...setupDismissStore.getState().dismissed, ...ids])];
  setupDismissStore.setState({ dismissed });
  await writeJSON(DB_KEYS.settingsSetupDismissed, dismissed);
}

export function useDismissedSetupItems(): string[] {
  return useStore(setupDismissStore, (s) => s.dismissed);
}
