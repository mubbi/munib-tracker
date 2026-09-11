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
import { getRamadanInfo } from "@/lib/ramadan";
import { captureAppException } from "@/lib/sentry";
import { locationStore } from "@/stores/location-store";

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

/** Resolve a cold-start / long-press quick action to an Expo Router href. */
export function resolveQuickActionHref(action: Action): string | null {
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
    // Native `setItems` can reject on Android (Record conversion / no Activity).
    // Swallow so Sentry's GlobalErrorBoundary does not replace the whole app.
    captureAppException(error, { tags: { area: "quick-actions", phase: "setItems" } });
  }
}
