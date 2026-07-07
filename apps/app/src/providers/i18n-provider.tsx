import { type ReactNode, useEffect, useRef } from "react";
import { I18nManager, Platform } from "react-native";

import i18n from "@/i18n";
import { RTL_LOCALES, reloadForLayoutDirectionChange } from "@/lib/reload-for-layout-change";
import { usePreferences } from "@/stores/preferences-store";

const RESTART_HINT =
  "[i18n] Layout direction changed. Restart the app to apply the right-to-left flip.";

function applyWebLayoutDirection(shouldRTL: boolean, locale: string): void {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  document.documentElement.dir = shouldRTL ? "rtl" : "ltr";
  document.documentElement.lang = locale;
}

/**
 * Keeps the active i18n language in sync with the user's preference and toggles
 * right-to-left layout for Arabic and Urdu. Native RTL only applies after a
 * full reload, so when the direction changes we reload automatically via
 * `reloadAppAsync` (works in dev client and release builds).
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = usePreferences();
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    const shouldRTL = RTL_LOCALES.has(locale);
    applyWebLayoutDirection(shouldRTL, locale);

    if (I18nManager.isRTL === shouldRTL || reloadingRef.current) return;

    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
    reloadingRef.current = true;

    void reloadForLayoutDirectionChange("Locale layout direction changed").then((reloaded) => {
      if (!reloaded) console.warn(RESTART_HINT);
    });
  }, [locale]);

  return <>{children}</>;
}
