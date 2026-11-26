import { StyleSheet, Text, type TextStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  SURAH_NAME_LINE_HEIGHT_RATIO,
  SURAH_NAME_SIZE,
  SURAH_NAME_SIZE_TV,
  surahNameGlyph,
  useSurahNameFont,
} from "@/lib/surah-name-font";

/**
 * A surah's Arabic name as Thuluth calligraphy (surah-name font glyph), in the
 * accent hue. Until the font is loaded — or if it fails — the plain Arabic name
 * shows in the reading font. Decorative: the row around it must announce the
 * surah (the glyph is a Private Use Area character that would read as nonsense).
 */
export function SurahCalligraphyName({
  number,
  nameArabic,
  size,
  style,
}: {
  number: number;
  /** Fallback text while the calligraphy font loads. */
  nameArabic: string;
  /** Defaults to the shared surah-list size (TV-aware). */
  size?: number;
  style?: TextStyle;
}) {
  const { colors } = useThemeTokens();
  const family = useSurahNameFont();
  const fontSize = size ?? (isTV() ? SURAH_NAME_SIZE_TV : SURAH_NAME_SIZE);

  if (!family) {
    return (
      <ThemedText
        type="arabic"
        accessibilityLanguage="ar"
        numberOfLines={1}
        style={[styles.fallback, { color: colors.accentText }, style]}
      >
        {nameArabic}
      </ThemedText>
    );
  }

  return (
    <Text
      testID={`surah-calligraphy-${number}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      selectable={false}
      numberOfLines={1}
      style={[
        styles.glyph,
        {
          fontFamily: family,
          fontSize,
          lineHeight: Math.round(fontSize * SURAH_NAME_LINE_HEIGHT_RATIO),
          color: colors.accentText,
        },
        style,
      ]}
    >
      {surahNameGlyph(number)}
    </Text>
  );
}

const styles = StyleSheet.create({
  fallback: { writingDirection: "rtl", textAlign: "right" },
  // The glyph carries its own shaping; no bold synthesis or RTL reordering.
  glyph: { textAlign: "right", fontWeight: "normal" },
});
