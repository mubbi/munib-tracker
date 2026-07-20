import type { Ayah } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
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
/** Unicode ARABIC END OF AYAH (۝) — ornament; digits follow in the same text run. */
const END_OF_AYAH = "\u06DD";
/** Hair space so the rosette stays clear of the preceding / following word. */
const MARKER_PAD = "\u200A";

/** Renders a Western number as Arabic-Indic digits for the in-line ayah marker. */
function toArabicDigits(value: number): string {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/**
 * Metrics for the gilt end-of-ayah rosette. Digits scale with reading size so
 * A−/A+ keeps the marker proportional to the ayah text.
 */
function ayahMarkerMetrics(fontSize: number, digitCount: number) {
  const rosetteSize = Math.round(fontSize * (digitCount >= 3 ? 1.05 : 0.95));
  const lineHeight = Math.round(rosetteSize * 1.25);
  // Slightly smaller than the ornament so 1–3 digits read clearly beside (or
  // inside, when the face shapes U+06DD as an enclosing mark).
  const numberSize = Math.max(
    8,
    Math.round(fontSize * (digitCount >= 3 ? 0.42 : digitCount === 2 ? 0.48 : 0.52)),
  );
  return { rosetteSize, lineHeight, numberSize };
}

/**
 * Gilt end-of-ayah rosette with the verse number in the same text run.
 *
 * Must be nested `Text` only — `View`-in-`Text` under RTL + `textAlign:
 * "justify"` does not reserve / reflow advance when the reading size changes,
 * so markers drift and paint over ayah words. Nested `Text` participates in the
 * paragraph run and reflows with A−/A+.
 */
function AyahEndMarker({
  ayah,
  fontSize,
  color,
  fontFamily,
}: {
  ayah: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
}) {
  const digits = toArabicDigits(ayah);
  const { rosetteSize, lineHeight, numberSize } = ayahMarkerMetrics(fontSize, digits.length);

  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        fontSize: rosetteSize,
        lineHeight,
        color,
        fontFamily,
      }}
    >
      {MARKER_PAD}
      {END_OF_AYAH}
      <Text
        style={{
          fontSize: numberSize,
          lineHeight,
          color,
          fontFamily,
        }}
      >
        {digits}
      </Text>
      {MARKER_PAD}
    </Text>
  );
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
  const arabicFontFamily = useArabicFontFamily();
  const groups = useMemo(() => groupBySurah(ayahs), [ayahs]);
  const interleaved = showTransliteration || showTranslation;

  // Gilt end-of-ayah rosette + verse number in the text run, sized to the
  // running Arabic so A−/A+ keeps markers aligned with ayah words.
  const renderMarker = (ayah: Ayah) => (
    <AyahEndMarker
      ayah={ayah.ayah}
      fontSize={arabicSize}
      color={mushaf.ink}
      fontFamily={arabicFontFamily}
    />
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
              // Remount when reading size changes so justified RTL layout
              // recomputes glyph advances (avoids stale inline runs after A±).
              <ThemedText
                key={`flow-${group.surah}-${arabicSize}`}
                type="arabic"
                style={[styles.flow, { fontSize: arabicSize }]}
              >
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
    writingDirection: "rtl",
  },
  translit: { fontStyle: "italic" },
  rtl: { writingDirection: "rtl" },
});
