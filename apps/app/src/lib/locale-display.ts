import type { AppLocale } from "@munib-tracker/shared/types";
import { LOCALE_FLAG_DISPLAY } from "@/components/locale-flag";

export type LocaleEntry = {
  code: AppLocale;
  name: string;
  english: string;
};

export const APP_LOCALES: LocaleEntry[] = (["en", "ar", "ur"] as const).map((code) => {
  const { native, english } = LOCALE_FLAG_DISPLAY[code];
  return { code, name: native, english };
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
