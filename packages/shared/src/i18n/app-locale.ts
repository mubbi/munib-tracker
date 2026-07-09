/** Every locale code the app can ship. Keep in sync with `LOCALE_REGISTRY`. */
export const APP_LOCALE_CODES = [
  "en",
  "ar",
  "ur",
  "id",
  "tr",
  "bn",
  "ms",
  "fa",
  "fr",
  "ha",
  "sw",
  "ru",
  "az",
  "ps",
  "so",
  "uz",
  "kk",
  "ku",
  "bs",
  "sq",
  "ky",
  "tg",
  "tk",
] as const;

export type AppLocale = (typeof APP_LOCALE_CODES)[number];

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (APP_LOCALE_CODES as readonly string[]).includes(value);
}
