import { type AppLocale, isAppLocale } from "@munib-tracker/shared/i18n";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { changeAppLocale } from "@/i18n";
import { MUNIB_LOCALE_BOOT_KEY, stripLocalePrefix } from "@/lib/locale-path";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Web-only: apply locale from a locale-prefixed entry URL. The inline boot script
 * in +html.tsx stores the locale and normalizes the pathname for expo-router.
 */
export function LocalePathBootstrap() {
  const router = useRouter();
  const applied = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "web" || applied.current || typeof window === "undefined") return;
    applied.current = true;

    const bootLocale = sessionStorage.getItem(MUNIB_LOCALE_BOOT_KEY);
    sessionStorage.removeItem(MUNIB_LOCALE_BOOT_KEY);

    const fromPath = stripLocalePrefix(window.location.pathname).locale;
    const localeCode = (
      bootLocale && isAppLocale(bootLocale) ? bootLocale : fromPath
    ) as AppLocale | null;

    if (!localeCode) return;

    const { path } = stripLocalePrefix(window.location.pathname);
    const prefs = preferencesStore.getState().prefs;
    if (prefs.locale !== localeCode || prefs.translationLocale !== localeCode) {
      void preferencesStore.getState().update({
        locale: localeCode,
        translationLocale: localeCode,
      });
      void changeAppLocale(localeCode);
    }

    if (path && path !== window.location.pathname) {
      router.replace(path as `/`);
    }
  }, [router]);

  return null;
}
