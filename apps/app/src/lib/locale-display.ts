import { SORTED_LOCALE_REGISTRY } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
import { LOCALE_FLAG_DISPLAY } from "@/lib/locale-flag-display";

export type LocaleEntry = {
  code: AppLocale;
  name: string;
  english: string;
  scriptureSupported: boolean;
};

export const APP_LOCALES: LocaleEntry[] = SORTED_LOCALE_REGISTRY.map((entry) => {
  const { native, english } = LOCALE_FLAG_DISPLAY[entry.code];
  return {
    code: entry.code,
    name: native,
    english,
    scriptureSupported: entry.scriptureSupported === true,
  };
});

/** Secondary line under the native language name — mirrors expense-tracker LanguagePicker. */
export function localeSecondaryLabel(code: AppLocale, english: string, name: string): string {
  if (english !== name) return english;
  return code.toUpperCase();
}

export function matchesLocaleSearch(
  query: string,
  { code, name, english }: Pick<LocaleEntry, "code" | "name" | "english">,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    code.toLowerCase().includes(q) ||
    name.toLowerCase().includes(q) ||
    english.toLowerCase().includes(q)
  );
}
