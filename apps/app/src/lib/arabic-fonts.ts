import { Amiri_400Regular } from "@expo-google-fonts/amiri";
import { NotoNaskhArabic_400Regular } from "@expo-google-fonts/noto-naskh-arabic";
import { ScheherazadeNew_400Regular } from "@expo-google-fonts/scheherazade-new";

/**
 * Font files for the Settings → Fonts Arabic typeface picker (NF-1.31).
 * Keys must match the `fontFamily` values in `ARABIC_FONT_OPTIONS`.
 */
export const ARABIC_FONT_FILES = {
  Amiri: Amiri_400Regular,
  ScheherazadeNew: ScheherazadeNew_400Regular,
  NotoNaskhArabic: NotoNaskhArabic_400Regular,
} as const;
