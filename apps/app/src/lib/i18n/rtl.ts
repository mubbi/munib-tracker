import type { AppLocale } from "@munib-tracker/shared/types";
import { reloadAppAsync } from "expo";
import { I18nManager, Platform } from "react-native";

import { prepareForNativeAppReload } from "@/lib/i18n/prepare-native-app-reload";
import { isRtlLocale } from "@/lib/i18n/rtl-locale";

export { isRtlLocale, RTL_LOCALES } from "@/lib/i18n/rtl-locale";

/** True when switching to this locale will force a native reload for layout direction. */
export function willRequireNativeReloadForLocale(code: AppLocale): boolean {
  if (Platform.OS === "web") return false;
  return I18nManager.isRTL !== isRtlLocale(code);
}

/**
 * Applies RTL layout direction for Arabic and Urdu.
 * Returns true when a full reload was triggered (direction changed on native).
 *
 * Must only be called with the user's effective locale (saved preference) —
 * never from device locale while a saved preference exists, or direction flips
 * back and forth across reloads.
 */
export async function applyRtlForLocale(code: AppLocale): Promise<boolean> {
  const shouldRtl = isRtlLocale(code);
  I18nManager.allowRTL(true);

  if (Platform.OS === "web") {
    if (typeof document !== "undefined") {
      document.documentElement.dir = shouldRtl ? "rtl" : "ltr";
      document.documentElement.lang = code;
    }
    return false;
  }

  if (I18nManager.isRTL === shouldRtl) return false;

  I18nManager.forceRTL(shouldRtl);
  await prepareForNativeAppReload();
  // Never await — reloadAppAsync can hang for the remainder of the JS session
  // when invoked during startup hydration, which bricks the splash screen.
  void reloadAppAsync("Locale layout direction changed");
  return true;
}
