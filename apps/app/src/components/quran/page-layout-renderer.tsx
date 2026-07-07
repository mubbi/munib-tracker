import type { Ayah } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran";
import { arabicReadingLayout } from "@/lib/reading-typography";

type PageLayoutRendererProps = {
  ayahs: Ayah[];
  arabicSize: number;
  page?: number;
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

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Renders a Western number as Arabic-Indic digits for the in-line ayah marker. */
function toArabicDigits(value: number): string {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Groups consecutive ayahs on the page by surah so each surah gets its own header. */
function groupBySurah(ayahs: Ayah[]): Array<{ surah: number; ayahs: Ayah[] }> {
  const groups: Array<{ surah: number; ayahs: Ayah[] }> = [];
  for (const ayah of ayahs) {
    const last = groups[groups.length - 1];
    if (last && last.surah === ayah.surah) last.ayahs.push(ayah);
    else groups.push({ surah: ayah.surah, ayahs: [ayah] });
  }
  return groups;
}

/**
 * Level A — flowing Uthmani Arabic for a mushaf page. Ayahs run continuously as
 * one justified RTL paragraph per surah (mirroring a printed page) with an ornate
 * end-of-ayah marker after each verse, so the text always wraps inside the page
 * frame instead of overflowing. Optional study lines (transliteration /
 * translation) follow beneath.
 */
export function PageLayoutRenderer({
  ayahs,
  arabicSize,
  page,
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
  const groups = useMemo(() => groupBySurah(ayahs), [ayahs]);

  return (
    <MushafPageFrame page={page}>
      {groups.map((group) => {
        const meta = getSurahByNumber(group.surah);
        const startsSurah = group.ayahs[0]?.ayah === 1;
        return (
          <View key={`surah-${group.surah}`} style={styles.surahGroup}>
            {startsSurah && meta ? (
              <SurahBanner nameArabic={meta.nameArabic} nameEnglish={meta.nameEnglish} />
            ) : null}
            {startsSurah && meta?.bismillahPre ? (
              <ThemedText
                type="arabic"
                style={[arabicReadingLayout(arabicSize - 4, "center"), styles.bismillah]}
              >
                {BISMILLAH}
              </ThemedText>
            ) : null}
            <ThemedText type="arabic" style={[styles.flow, { fontSize: arabicSize }]}>
              {group.ayahs.map((ayah) => {
                const highlighted = highlightAyah === ayah.ayah && ayahs.length !== 1;
                return (
                  <ThemedText
                    key={`${ayah.surah}:${ayah.ayah}`}
                    type="arabic"
                    accessibilityRole="button"
                    accessibilityLabel={t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah })}
                    onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                    style={[
                      { fontSize: arabicSize },
                      highlighted ? { backgroundColor: tokens.accentSoft } : null,
                    ]}
                  >
                    {ayah.arabic}
                    <ThemedText
                      type="arabic"
                      style={{ fontSize: arabicSize, color: colors.accent }}
                    >
                      {` \u06DD${toArabicDigits(ayah.ayah)} `}
                    </ThemedText>
                  </ThemedText>
                );
              })}
            </ThemedText>
          </View>
        );
      })}

      {showTransliteration || showTranslation ? (
        <View style={[styles.studyBlock, { borderTopColor: tokens.hairline }]}>
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
                accessibilityRole="button"
                accessibilityLabel={t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah })}
                onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                style={styles.studyRow}
              >
                <View style={[styles.studyBadge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="caption" style={{ color: colors.accent }}>
                    {ayah.ayah}
                  </ThemedText>
                </View>
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
    </MushafPageFrame>
  );
}

const styles = StyleSheet.create({
  surahGroup: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  bismillah: {
    marginTop: Spacing.one,
  },
  flow: {
    textAlign: "justify",
    writingDirection: "rtl",
  },
  studyBlock: {
    marginTop: Spacing.four,
    gap: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  studyRow: { gap: Spacing.one, alignItems: "flex-start" },
  studyBadge: {
    minWidth: 26,
    height: 22,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});
