import type { Ayah } from "@munib-tracker/shared/types";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";

import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber } from "@/lib/quran";
import {
  arabicReadingLayout,
  iosInlineAyahMarker,
  toArabicIndicDigits,
} from "@/lib/reading-typography";

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
/** Unicode ARABIC END OF AYAH (۝) — Android/web overlay ornament only; never send this to iOS TextKit. */
const END_OF_AYAH = "\u06DD";

/**
 * Metrics for the gilt end-of-ayah rosette. Numbers are sized to the *inner*
 * diameter of U+06DD (~half the glyph) so 1–3 digits stay inside the ornament
 * instead of spilling over the rim — especially at large reading sizes.
 */
function ayahMarkerMetrics(fontSize: number, digitCount: number) {
  const box = Math.round(fontSize * (digitCount >= 3 ? 1.28 : digitCount === 2 ? 1.12 : 1.02));
  const rosetteSize = box;
  // Usable inner area is ~50% of the glyph; leave a slim rim margin.
  const numberSize = Math.max(
    10,
    Math.round(box * (digitCount >= 3 ? 0.36 : digitCount === 2 ? 0.42 : 0.48)),
  );
  const gutter = Math.max(3, Math.round(fontSize * 0.08));
  return { box, rosetteSize, numberSize, gutter };
}

/**
 * Gilt end-of-ayah rosette with the verse number (Android/web).
 *
 * iOS never uses this: U+06DD is an enclosing mark, and nesting a smaller
 * digit `Text` inside a justified RTL page hangs TextKit when the default
 * `ui-serif` face lacks the glyph. Callers inline {@link iosInlineAyahMarker}
 * into the ayah string instead (same run, no mixed-size nested Text).
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
  const digits = toArabicIndicDigits(ayah);
  const { box, rosetteSize, numberSize, gutter } = ayahMarkerMetrics(fontSize, digits.length);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      style={[
        styles.marker,
        {
          width: box,
          height: box,
          marginHorizontal: gutter,
        },
      ]}
    >
      <Text
        style={[
          styles.markerRosette,
          {
            fontSize: rosetteSize,
            lineHeight: box,
            color,
            width: box,
            height: box,
            fontFamily,
            pointerEvents: "none",
          },
        ]}
      >
        {END_OF_AYAH}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
        style={[
          styles.markerNumber,
          {
            fontSize: numberSize,
            lineHeight: numberSize,
            color,
            fontFamily,
            includeFontPadding: false,
            textAlignVertical: "center",
            maxWidth: Math.round(box * 0.7),
          },
        ]}
      >
        {digits}
      </Text>
    </View>
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

/** iOS: one string run. Android/web: ayah + layered U+06DD rosette. */
function ayahTextWithMarker(ayah: Ayah, marker: ReactNode): ReactNode {
  if (Platform.OS === "ios") {
    return `${ayah.arabic}${iosInlineAyahMarker(ayah.ayah)}`;
  }
  return (
    <>
      {ayah.arabic}
      {marker}
    </>
  );
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

  // Gilt end-of-ayah rosette with the verse number centered inside, sized to
  // the running Arabic so it sits on the baseline like a printed mushaf.
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
                const compositeKey = `${ayah.surah}:${ayah.ayah}`;
                const ayahKey = String(ayah.ayah);
                const translit = showTransliteration
                  ? (transliteration?.[compositeKey] ?? transliteration?.[ayahKey])
                  : undefined;
                const trans = showTranslation
                  ? (translation?.[compositeKey] ?? translation?.[ayahKey])
                  : undefined;
                const second = showTranslation
                  ? (secondTranslation?.[compositeKey] ?? secondTranslation?.[ayahKey])
                  : undefined;
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
                      key={`ar-${ayah.surah}-${ayah.ayah}-${arabicSize}`}
                      type="arabic"
                      style={[styles.blockArabic, { fontSize: arabicSize }]}
                    >
                      {ayahTextWithMarker(ayah, renderMarker(ayah))}
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
                      {ayahTextWithMarker(ayah, renderMarker(ayah))}
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
  marker: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerRosette: {
    position: "absolute",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  markerNumber: {
    textAlign: "center",
    zIndex: 1,
  },
});
