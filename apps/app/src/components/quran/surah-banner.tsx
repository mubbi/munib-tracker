import type { RevelationPlace } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SurahBannerProps = {
  /** Arabic surah name (e.g. ٱلْبَقَرَة). Rendered in the app's Arabic naskh, gilt. */
  nameArabic: string;
  /** Optional English name shown in the sub-line (e.g. "The Cow"). */
  nameEnglish?: string;
  /** Optional revelation place → "Makki"/"Madani" pill text in the sub-line. */
  revelationPlace?: RevelationPlace;
  /** Optional ayah count for the sub-line. */
  ayahCount?: number;
};

/**
 * The illuminated header that opens each surah in a printed mushaf: an ornate
 * gilt cartouche — a double-keyline gold band on a soft parchment-gold wash, the
 * Arabic surah name centered in gilt ink and flanked by lozenge ornaments, with
 * a fine sub-line naming the surah (English · revelation · ayah count).
 */
export function SurahBanner({
  nameArabic,
  nameEnglish,
  revelationPlace,
  ayahCount,
}: SurahBannerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { mushaf } = tokens;

  const subParts = [
    nameEnglish,
    revelationPlace ? (revelationPlace === "makkah" ? t("quran.makki") : t("quran.madani")) : null,
    ayahCount != null ? t("quran.ayahCount", { count: ayahCount }) : null,
  ].filter(Boolean);

  return (
    <View style={[styles.band, { backgroundColor: mushaf.bandFill, borderColor: mushaf.frame }]}>
      <View style={[styles.keyline, { borderColor: mushaf.bandBorder }]}>
        <View style={styles.nameRow}>
          <View style={[styles.rule, { backgroundColor: mushaf.bandBorder }]} />
          <View style={[styles.ornament, { backgroundColor: mushaf.ink }]} />
          <ThemedText type="arabic" style={[styles.name, { color: mushaf.ink }]}>
            {nameArabic}
          </ThemedText>
          <View style={[styles.ornament, { backgroundColor: mushaf.ink }]} />
          <View style={[styles.rule, { backgroundColor: mushaf.bandBorder }]} />
        </View>
        {subParts.length ? (
          <ThemedText type="caption" style={[styles.sub, { color: colors.mutedForeground }]}>
            {subParts.join("  ·  ")}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    alignSelf: "stretch",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    padding: Spacing.one,
  },
  keyline: {
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    maxWidth: 48,
  },
  ornament: {
    width: 6,
    height: 6,
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
  },
  name: {
    fontSize: 26,
    lineHeight: 42,
    textAlign: "center",
    fontWeight: "600",
  },
  sub: {
    textAlign: "center",
  },
});
