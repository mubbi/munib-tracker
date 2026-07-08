import type { AppLocale } from "@munib-tracker/shared/types";

/** Locales that read right-to-left and require an `I18nManager` layout flip. */
export const RTL_LOCALES: ReadonlySet<AppLocale> = new Set(["ar", "ur"]);

export function isRtlLocale(code: AppLocale): boolean {
  return RTL_LOCALES.has(code);
}
