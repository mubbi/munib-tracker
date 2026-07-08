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
  transliterationSize?: number;
  translationSize?: number;
  page?: number;
  transliteration?: Record<string, string>;
  translation?: Record<string, string>;
  secondTranslation?: Record<string, string>;
  showTransliteration: boolean;
  showTranslation: boolean;
  translationDir: "ltr" | "rtl";
  secondTranslationDir: "ltr" | "rtl";
  highlightAyah?: { surah: number; ayah: number };
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

function ayahMatchesHighlight(
  ayah: Ayah,
  highlightAyah?: { surah: number; ayah: number },
): boolean {
  return highlightAyah?.surah === ayah.surah && highlightAyah?.ayah === ayah.ayah;
}

/**
 * Level A — a mushaf page. With translations/transliteration off it renders as
 * one continuous justified RTL paragraph per surah (a printed page, verses joined
 * by a gilt end-of-ayah rosette). With either on, it switches to the familiar
 * translated-mushaf layout: each ayah is a stacked block — Arabic, then
 * transliteration, then translation(s) — read top to bottom, verse by verse.
 */
export function PageLayoutRenderer({
  ayahs,
  arabicSize,
  transliterationSize,
  translationSize,
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
  const { mushaf } = tokens;
  const groups = useMemo(() => groupBySurah(ayahs), [ayahs]);
  const interleaved = showTransliteration || showTranslation;

  // The gilt end-of-ayah rosette (۝) carrying the verse number, sized to the
  // running Arabic so it sits on the baseline like a printed mushaf.
  const renderMarker = (ayah: Ayah) => (
    <ThemedText type="arabic" style={{ fontSize: arabicSize * 0.92, color: mushaf.ink }}>
      {` ۝${toArabicDigits(ayah.ayah)} `}
    </ThemedText>
  );

  return (
    <MushafPageFrame page={page}>
      {groups.map((group) => {
        const meta = getSurahByNumber(group.surah);
        const startsSurah = group.ayahs[0]?.ayah === 1;
        return (
          <View key={`surah-${group.surah}`} style={styles.surahGroup}>
            {startsSurah && meta ? (
              <SurahBanner
                nameArabic={meta.nameArabic}
                nameEnglish={meta.nameEnglish}
                revelationPlace={meta.revelationPlace}
                ayahCount={meta.ayahCount}
              />
            ) : null}
            {startsSurah && meta?.bismillahPre ? (
              <ThemedText
                type="arabic"
                style={[arabicReadingLayout(arabicSize - 4, "center"), styles.bismillah]}
              >
                {BISMILLAH}
              </ThemedText>
            ) : null}

            {interleaved ? (
              group.ayahs.map((ayah) => {
                const key = String(ayah.ayah);
                const translit = showTransliteration ? transliteration?.[key] : undefined;
                const trans = showTranslation ? translation?.[key] : undefined;
                const second = showTranslation ? secondTranslation?.[key] : undefined;
                const highlighted = ayahMatchesHighlight(ayah, highlightAyah);
                return (
                  <PressableScale
                    key={`${ayah.surah}:${ayah.ayah}`}
                    haptic="light"
                    scaleTo={0.995}
                    accessibilityRole="button"
                    accessibilityLabel={t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah })}
                    onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                    style={[
                      styles.ayahBlock,
                      { borderBottomColor: mushaf.bandBorder },
                      highlighted
                        ? { backgroundColor: mushaf.highlight, borderRadius: Radius.sm }
                        : null,
                    ]}
                  >
                    <ThemedText
                      type="arabic"
                      style={[styles.blockArabic, { fontSize: arabicSize }]}
                    >
                      {ayah.arabic}
                      {renderMarker(ayah)}
                    </ThemedText>
                    {translit ? (
                      <ThemedText
                        type="small"
                        style={[
                          styles.translit,
                          { color: colors.accent },
                          transliterationSize ? { fontSize: transliterationSize } : null,
                        ]}
                      >
                        {translit}
                      </ThemedText>
                    ) : null}
                    {trans ? (
                      <ThemedText
                        type="small"
                        style={[
                          translationSize
                            ? { fontSize: translationSize, lineHeight: translationSize * 1.5 }
                            : null,
                          translationDir === "rtl" ? styles.rtl : null,
                        ]}
                      >
                        {trans}
                      </ThemedText>
                    ) : null}
                    {second ? (
                      <ThemedText
                        type="small"
                        themeColor="mutedForeground"
                        style={[
                          translationSize
                            ? { fontSize: translationSize, lineHeight: translationSize * 1.5 }
                            : null,
                          secondTranslationDir === "rtl" ? styles.rtl : null,
                        ]}
                      >
                        {second}
                      </ThemedText>
                    ) : null}
                  </PressableScale>
                );
              })
            ) : (
              <ThemedText type="arabic" style={[styles.flow, { fontSize: arabicSize }]}>
                {group.ayahs.map((ayah) => {
                  const highlighted = ayahMatchesHighlight(ayah, highlightAyah);
                  return (
                    <ThemedText
                      key={`${ayah.surah}:${ayah.ayah}`}
                      type="arabic"
                      accessibilityRole="button"
                      accessibilityLabel={t("quran.ayahRef", {
                        surah: ayah.surah,
                        ayah: ayah.ayah,
                      })}
                      onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                      style={[
                        { fontSize: arabicSize },
                        highlighted ? { backgroundColor: mushaf.highlight } : null,
                      ]}
                    >
                      {ayah.arabic}
                      {renderMarker(ayah)}
                    </ThemedText>
                  );
                })}
              </ThemedText>
            )}
          </View>
        );
      })}
    </MushafPageFrame>
  );
}

const styles = StyleSheet.create({
  surahGroup: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  bismillah: {
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  flow: {
    textAlign: "justify",
    writingDirection: "rtl",
  },
  ayahBlock: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  blockArabic: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  translit: { fontStyle: "italic" },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});
