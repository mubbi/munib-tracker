import { isAppLocale, resolveIntlLocale } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";

/** Maps app locale codes to BCP 47 tags for `Intl` formatters. */
export function localeToBcp47(locale: string): string {
  if (isAppLocale(locale)) return resolveIntlLocale(locale);
  return "en-US";
}

/** Coerces an i18n language tag to a known `AppLocale` for calendar/formatters. */
export function toAppLocale(raw: string): AppLocale {
  const base = raw.split("-")[0];
  if (isAppLocale(raw)) return raw;
  if (isAppLocale(base)) return base;
  return "en";
}
