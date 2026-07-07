import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SurahBannerProps = {
  /** Arabic surah name (e.g. ٱلْبَقَرَة). */
  nameArabic: string;
  /** Optional English name shown beneath, small (e.g. "The Cow"). */
  nameEnglish?: string;
  /** Optional font family for the Arabic name (mushaf pages pass the QCF glyph font). */
  fontFamily?: string;
};

/**
 * An ornamental surah title bar mirroring the illuminated header that opens each
 * surah in a printed mushaf: the Arabic name centered between two rules on a soft
 * accent panel, with the English name beneath.
 */
export function SurahBanner({ nameArabic, nameEnglish, fontFamily }: SurahBannerProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
      ]}
    >
      <View style={styles.ruleRow}>
        <View style={[styles.rule, { backgroundColor: tokens.accentBorder }]} />
        <ThemedText
          type="arabic"
          style={[styles.name, { color: colors.accent }, fontFamily ? { fontFamily } : null]}
        >
          {nameArabic}
        </ThemedText>
        <View style={[styles.rule, { backgroundColor: tokens.accentBorder }]} />
      </View>
      {nameEnglish ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.english}>
          {nameEnglish}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    maxWidth: 56,
  },
  name: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "center",
  },
  english: {
    textAlign: "center",
  },
});
