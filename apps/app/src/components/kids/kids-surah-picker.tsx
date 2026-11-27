import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran-meta";

/**
 * Big, friendly tiles for the curated short surahs (D27). Names come from the
 * bundled surah meta (Arabic name + transliteration) — nothing typed here.
 */
export function KidsSurahPicker({
  surahs,
  onPick,
}: {
  surahs: readonly number[];
  onPick: (surah: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.grid}>
      {surahs.map((n) => {
        const meta = getSurahByNumber(n);
        const name = meta?.nameTransliteration ?? String(n);
        const ayahs = meta?.ayahCount ?? 0;
        return (
          <PressableScale
            key={n}
            accessibilityRole="button"
            accessibilityLabel={t("kids.recite.pickA11y", { surah: name })}
            onPress={() => onPick(n)}
            style={[
              styles.tile,
              { backgroundColor: tokens.accentSoft, borderColor: tokens.hairline },
            ]}
          >
            {meta?.nameArabic ? (
              <ThemedText type="arabic" style={[styles.arabic, { color: colors.accentText }]}>
                {meta.nameArabic}
              </ThemedText>
            ) : null}
            <ThemedText type="smallBold" style={styles.center} numberOfLines={1}>
              {name}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
              {t("quran.ayahCount", { count: ayahs })}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.three },
  tile: {
    flexGrow: 1,
    flexBasis: 140,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  arabic: { fontSize: 28, lineHeight: 48, writingDirection: "rtl", textAlign: "center" },
  center: { textAlign: "center" },
});
