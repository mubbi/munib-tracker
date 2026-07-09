import { SORTED_LOCALE_REGISTRY } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";

/** ISO 3166-1 alpha-2 region → regional-indicator emoji (native fallback). */
const REGION_EMOJI: Record<string, string> = {
  us: "🇺🇸",
  sa: "🇸🇦",
  pk: "🇵🇰",
  id: "🇮🇩",
  tr: "🇹🇷",
  bd: "🇧🇩",
  my: "🇲🇾",
  ir: "🇮🇷",
  fr: "🇫🇷",
  ng: "🇳🇬",
  tz: "🇹🇿",
  ru: "🇷🇺",
  az: "🇦🇿",
  af: "🇦🇫",
  so: "🇸🇴",
  uz: "🇺🇿",
  kz: "🇰🇿",
  ku: "🏴",
  ba: "🇧🇦",
  al: "🇦🇱",
  kg: "🇰🇬",
  tj: "🇹🇯",
  tm: "🇹🇲",
};

function regionEmoji(regionCode: string): string {
  return REGION_EMOJI[regionCode] ?? "🏳️";
}

/** Locale → flag metadata derived from the central registry. */
export const LOCALE_FLAG_DISPLAY: Record<
  AppLocale,
  { regionCode: string; flag: string; english: string; native: string }
> = Object.fromEntries(
  SORTED_LOCALE_REGISTRY.map((entry) => [
    entry.code,
    {
      regionCode: entry.regionCode.toUpperCase(),
      flag: regionEmoji(entry.regionCode),
      english: entry.englishName,
      native: entry.nativeName,
    },
  ]),
) as Record<AppLocale, { regionCode: string; flag: string; english: string; native: string }>;
