import {
  isRtlLocale as isRtlLocaleFromRegistry,
  RTL_LOCALE_CODES,
} from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";

/** Locales that read right-to-left and require an `I18nManager` layout flip. */
export const RTL_LOCALES: ReadonlySet<AppLocale> = RTL_LOCALE_CODES;

export function isRtlLocale(code: AppLocale): boolean {
  return isRtlLocaleFromRegistry(code);
}
