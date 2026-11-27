import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Action } from "expo-quick-actions";
import * as QuickActions from "expo-quick-actions";
import type { TFunction } from "i18next";
import { Platform } from "react-native";

import { ANDROID_QUICK_ACTION_LIMIT, IOS_QUICK_ACTION_LIMIT } from "@/lib/appSurfaces/config";
import {
  getActiveQuickActionDefinitions,
  getQuickActionById,
  type QuickActionDefinition,
} from "@/lib/appSurfaces/quickActions/registry";
import { isTV } from "@/lib/platform/is-tv";
import { buildDueQueue } from "@/lib/quran-companion/due-queue";
import { getRamadanInfo } from "@/lib/ramadan";
import { captureAppException } from "@/lib/sentry";
import { hifzStore } from "@/stores/hifz-store";
import { locationStore } from "@/stores/location-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranMemorizationStore } from "@/stores/quran-memorization-store";

function translatedLabel(t: TFunction, key: string, fallback: string): string {
  const value = t(key, { defaultValue: fallback });
  return typeof value === "string" && value.trim() ? value : fallback;
}

/**
 * Build a native-safe shortcut payload. Android's Expo Record converter NPEs when
 * optional keys are present as `undefined`/`null` (`subtitle` used to be sent that
 * way), so omit those keys instead of passing `undefined`.
 */
export function definitionToAction(
  def: QuickActionDefinition,
  t: TFunction,
  isIos: boolean,
): Action {
  const action: Action = {
    id: def.id,
    title: translatedLabel(t, def.titleKey, def.titleFallback),
    icon: isIos ? def.iosSymbol : def.androidIcon,
    params: { href: def.href },
  };
  if (isIos) {
    action.subtitle = translatedLabel(t, def.subtitleKey, def.subtitleFallback);
  }
  return action;
}

/** Registry id of the "Practise Qur'an" shortcut (href resolved when opened). */
export const PRACTICE_QUICK_ACTION_ID = "quran-practice";

/**
 * "Practise Qur'an": the revision queue while ayahs are due, otherwise the
 * practice hub. Reads the loaded stores only — on a cold start before they load
 * it opens the hub, which shows the due queue itself once ready.
 */
export function practiceQuickActionHref(): string {
  const memorization = quranMemorizationStore.getState();
  if (!memorization.isReady) return "/quran/practice";
  const due = buildDueQueue({
    records: memorization.records,
    hifz: hifzStore.getState().statuses,
    includeHifzReview: quranCompanionPrefsStore.getState().prefs.includeHifzReview,
    today: getLocalDateString(),
  });
  return due.length > 0 ? "/quran/revision" : "/quran/practice";
}

/** Resolve a cold-start / long-press quick action to an Expo Router href. */
export function resolveQuickActionHref(action: Action): string | null {
  if (action.id === PRACTICE_QUICK_ACTION_ID) return practiceQuickActionHref();
  const href = action.params?.href;
  if (typeof href === "string" && href.trim()) return href.trim();
  const def = getQuickActionById(action.id ?? "");
  return def?.href ?? null;
}

export function resolveQuickActionLimit(isIos: boolean, maxCount?: number): number {
  if (isIos) return IOS_QUICK_ACTION_LIMIT;
  if (typeof maxCount === "number" && Number.isFinite(maxCount) && maxCount > 0) {
    return Math.floor(maxCount);
  }
  return ANDROID_QUICK_ACTION_LIMIT;
}

/** Register home-screen shortcuts (iOS Haptic Touch / Android long-press). */
export async function syncAppQuickActions(t: TFunction): Promise<void> {
  if (Platform.OS === "web" || isTV()) return;
  try {
    if (!(await QuickActions.isSupported())) return;

    const isIos = Platform.OS === "ios";
    const location = locationStore.getState().location;
    const isRamadanActive = getRamadanInfo(location).isRamadan;
    const active = getActiveQuickActionDefinitions(isRamadanActive);
    const limit = resolveQuickActionLimit(isIos, QuickActions.maxCount);
    const definitions = active.slice(0, limit);
    const items = definitions.map((def) => definitionToAction(def, t, isIos));
    if (items.length === 0) return;

    await QuickActions.setItems(items);
  } catch (error) {
    // Native `setItems` can still reject (no Activity, OEM ShortcutManager).
    // Swallow so Sentry's GlobalErrorBoundary does not replace the whole app.
    // Skip the known Android Record-cast NPE from store binaries that predate
    // the expo-quick-actions patch (setItems now takes List<ReadableMap>).
    if (!isLegacyAndroidQuickActionCastError(error)) {
      captureAppException(error, { tags: { area: "quick-actions", phase: "setItems" } });
    }
  }
}

/** Production 1.3.0 / unpatched expo-quick-actions Record conversion failure. */
export function isLegacyAndroidQuickActionCastError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("ExpoQuickActions.setItems") &&
    (message.includes("ActionObject") || message.includes("ReadableNativeMap"))
  );
}
