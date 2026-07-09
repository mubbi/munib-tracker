import { matchDeviceLocale } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
import * as Localization from "expo-localization";

/**
 * Best-guess `AppLocale` from the device's language settings (most-preferred
 * first), or `null` when none of the device's languages match a supported
 * locale. Only meant to be consulted on first run — see `preferences-store`'s
 * `load()`, which applies it once when no locale preference has ever been saved.
 */
export function detectDeviceLocale(): AppLocale | null {
  try {
    const tags = Localization.getLocales().map((locale) => locale.languageTag);
    return matchDeviceLocale(tags);
  } catch {
    return null;
  }
}
