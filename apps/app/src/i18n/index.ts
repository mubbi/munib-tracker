import type { AppLocale } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyRtlForLocale, willRequireNativeReloadForLocale } from "@/lib/i18n/rtl";
import { completeAllStaggerEntrances } from "@/lib/stagger-entrances";

import ar from "./ar.json";
import en from "./en.json";
import ur from "./ur.json";

const SUPPORTED = ["en", "ar", "ur"] as const satisfies readonly AppLocale[];

/** Stashed before a native RTL reload so the next boot applies strings + layout together. */
export const PENDING_APP_LOCALE_KEY = "@munib-tracker/pending-app-locale";

const I18N_RESOURCES = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
} as const;

function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (SUPPORTED as readonly string[]).includes(value);
}

function ensureI18nInit(lng: AppLocale): Promise<void> {
  if (i18n.isInitialized) {
    if (i18n.language === lng) return Promise.resolve();
    return i18n.changeLanguage(lng).then(() => undefined);
  }
  return i18n
    .use(initReactI18next)
    .init({
      resources: I18N_RESOURCES,
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      returnNull: false,
      react: { useSuspense: false },
    })
    .then(() => undefined);
}

// Placeholder init only — the saved locale is applied in preferences hydration
// before the first screen paints (see MunibThemeProvider).
if (!i18n.isInitialized) {
  void ensureI18nInit("en");
}

/**
 * Switch language and layout direction for the effective app locale.
 * Returns true when layout direction changed and the native app is reloading.
 *
 * When direction will flip, reload immediately — do not call `changeLanguage`
 * first, or the UI re-renders while the runtime is tearing down.
 */
export async function changeAppLocale(code: AppLocale): Promise<boolean> {
  if (willRequireNativeReloadForLocale(code)) {
    // Remember the target locale across the native reload — do not call
    // changeLanguage first or the UI re-renders while the runtime tears down.
    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, code);
    return applyRtlForLocale(code);
  }

  await AsyncStorage.removeItem(PENDING_APP_LOCALE_KEY);
  await ensureI18nInit(code);
  if (i18n.language !== code) {
    await i18n.changeLanguage(code);
    completeAllStaggerEntrances();
  }
  return applyRtlForLocale(code);
}

/**
 * Applies the user's saved locale (or a pending post-reload locale) before the
 * first screen paints. Returns true when a native reload was triggered.
 */
export async function bootstrapAppLocale(code: AppLocale): Promise<boolean> {
  const pending = await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY);
  const effective = isSupportedLocale(pending) ? pending : code;
  return changeAppLocale(effective);
}

export default i18n;
