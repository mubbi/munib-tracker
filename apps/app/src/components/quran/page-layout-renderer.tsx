import type { Ayah } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";

type PageLayoutRendererProps = {
  ayahs: Ayah[];
  arabicSize: number;
  transliteration?: Record<string, string>;
  translation?: Record<string, string>;
  secondTranslation?: Record<string, string>;
  showTransliteration: boolean;
  showTranslation: boolean;
  translationDir: "ltr" | "rtl";
  secondTranslationDir: "ltr" | "rtl";
  highlightAyah?: number;
  onAyahPress?: (surah: number, ayah: number) => void;
};

/** Level A — flowing Uthmani Arabic for all ayahs on one mushaf page. */
export function PageLayoutRenderer({
  ayahs,
  arabicSize,
  transliteration,
  translation,
  secondTranslation,
  showTransliteration,
  showTranslation,
  translationDir,
  secondTranslationDir,
  highlightAyah,
  onAyahPress,
}: PageLayoutRendererProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arabicFont = useArabicFontFamily();

  return (
    <Card padding="four" style={styles.card}>
      <View style={styles.arabicBlock}>
        {ayahs.map((ayah) => {
          const highlighted =
            highlightAyah === ayah.ayah && ayahs.length === 1 ? false : highlightAyah === ayah.ayah;
          return (
            <PressableScale
              key={`${ayah.surah}:${ayah.ayah}`}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah })}
              onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
              style={[
                styles.ayahInline,
                highlighted ? { backgroundColor: tokens.accentSoft, borderRadius: 8 } : null,
              ]}
            >
              <ThemedText
                type="arabic"
                style={[
                  arabicReadingLayout(arabicSize),
                  arabicFont ? { fontFamily: arabicFont } : null,
                  { color: colors.foreground },
                ]}
              >
                {ayah.arabic}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>

      {showTransliteration || showTranslation ? (
        <View style={styles.studyBlock}>
          {ayahs.map((ayah) => {
            const key = String(ayah.ayah);
            const translit = showTransliteration ? transliteration?.[key] : undefined;
            const trans = showTranslation ? translation?.[key] : undefined;
            const second = showTranslation ? secondTranslation?.[key] : undefined;
            if (!translit && !trans && !second) return null;
            return (
              <PressableScale
                key={`study-${ayah.surah}:${ayah.ayah}`}
                haptic="light"
                onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                style={styles.studyRow}
              >
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah })}
                </ThemedText>
                {translit ? (
                  <ThemedText type="small" style={{ color: colors.accent }}>
                    {translit}
                  </ThemedText>
                ) : null}
                {trans ? (
                  <ThemedText
                    type="small"
                    style={translationDir === "rtl" ? styles.rtl : undefined}
                  >
                    {trans}
                  </ThemedText>
                ) : null}
                {second ? (
                  <ThemedText
                    type="small"
                    themeColor="mutedForeground"
                    style={secondTranslationDir === "rtl" ? styles.rtl : undefined}
                  >
                    {second}
                  </ThemedText>
                ) : null}
              </PressableScale>
            );
          })}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  arabicBlock: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.two,
  },
  ayahInline: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  studyBlock: {
    marginTop: Spacing.four,
    gap: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  studyRow: { gap: Spacing.one },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});
