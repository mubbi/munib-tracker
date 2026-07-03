import { type ReactNode, useEffect } from "react";
import { I18nManager } from "react-native";

import i18n from "@/i18n";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Keeps the active i18n language in sync with the user's preference and toggles
 * right-to-left layout for Arabic. On native, a full RTL flip takes effect after
 * the next app reload — expected behaviour for React Native's `I18nManager`.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = usePreferences();

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    const shouldRTL = locale === "ar";
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
    }
  }, [locale]);

  return <>{children}</>;
}
