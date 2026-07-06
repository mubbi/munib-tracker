import type { Action } from "expo-quick-actions";
import * as QuickActions from "expo-quick-actions";
import type { TFunction } from "i18next";
import { Platform } from "react-native";

import { IOS_QUICK_ACTION_LIMIT } from "@/lib/appSurfaces/config";
import {
  getQuickActionById,
  QUICK_ACTION_REGISTRY,
  type QuickActionDefinition,
} from "@/lib/appSurfaces/quickActions/registry";

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
  if (Platform.OS === "web") return;
  if (!(await QuickActions.isSupported())) return;

  const isIos = Platform.OS === "ios";
  const definitions = isIos
    ? QUICK_ACTION_REGISTRY.slice(0, IOS_QUICK_ACTION_LIMIT)
    : QUICK_ACTION_REGISTRY;

  await QuickActions.setItems(definitions.map((def) => definitionToAction(def, t, isIos)));
}
