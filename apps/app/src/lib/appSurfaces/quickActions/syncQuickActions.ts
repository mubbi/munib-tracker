import type { Action } from "expo-quick-actions";
import * as QuickActions from "expo-quick-actions";
import type { TFunction } from "i18next";
import { Platform } from "react-native";

import { IOS_QUICK_ACTION_LIMIT } from "@/lib/appSurfaces/config";
import {
  getActiveQuickActionDefinitions,
  getQuickActionById,
  type QuickActionDefinition,
} from "@/lib/appSurfaces/quickActions/registry";
import { isTV } from "@/lib/platform/is-tv";
import { getRamadanInfo } from "@/lib/ramadan";
import { locationStore } from "@/stores/location-store";

function definitionToAction(def: QuickActionDefinition, t: TFunction, isIos: boolean): Action {
  return {
    id: def.id,
    title: t(def.titleKey, def.titleFallback),
    subtitle: isIos ? t(def.subtitleKey, def.subtitleFallback) : undefined,
    icon: isIos ? def.iosSymbol : def.androidIcon,
    params: { href: def.href },
  };
}

/** Resolve a cold-start / long-press quick action to an Expo Router href. */
export function resolveQuickActionHref(action: Action): string | null {
  const href = action.params?.href;
  if (typeof href === "string" && href.trim()) return href.trim();
  const def = getQuickActionById(action.id ?? "");
  return def?.href ?? null;
}

/** Register home-screen shortcuts (iOS Haptic Touch / Android long-press). */
export async function syncAppQuickActions(t: TFunction): Promise<void> {
  if (Platform.OS === "web" || isTV()) return;
  if (!(await QuickActions.isSupported())) return;

  const isIos = Platform.OS === "ios";
  const location = locationStore.getState().location;
  const isRamadanActive = getRamadanInfo(location).isRamadan;
  const active = getActiveQuickActionDefinitions(isRamadanActive);
  const definitions = isIos ? active.slice(0, IOS_QUICK_ACTION_LIMIT) : active;

  await QuickActions.setItems(definitions.map((def) => definitionToAction(def, t, isIos)));
}
