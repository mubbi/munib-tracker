import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
  buildMarketingSiteUrl,
  OFFICIAL_APP_WEB_ORIGIN,
} from "@munib-tracker/shared/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

function resolveWebAppUrl(): string {
  const fromEnv = typeof process !== "undefined" ? process.env.EXPO_PUBLIC_APP_URL?.trim() : "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return OFFICIAL_APP_WEB_ORIGIN;
}

/** Locale-aware external URLs using the language selected in the app. */
export function useLocalizedSiteUrls() {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useMemo(
    () => ({
      locale,
      marketingHomeUrl: buildMarketingSiteUrl(locale),
      webAppUrl: resolveWebAppUrl(),
      iosAppStoreUrl: buildLocalizedIosAppStoreUrl(locale),
      androidPlayStoreUrl: buildLocalizedAndroidPlayStoreUrl(locale),
    }),
    [locale],
  );
}
