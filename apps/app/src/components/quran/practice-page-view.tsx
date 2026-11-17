import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, type TextStyle, View } from "react-native";

import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getAyahsOnPage, getPageLayout, getSurahByNumber } from "@/lib/quran";
import { type MushafToken, mapMushafTokens } from "@/lib/quran-companion/mushaf-tokens";
import type { PracticeView, WordState } from "@/lib/quran-companion/types";
import { QURAN_TOTAL_PAGES } from "@/lib/quran-meta";
import { iosInlineAyahMarker } from "@/lib/reading-typography";

/**
 * Page and mushaf layouts for a practice session. The page that holds the current
 * ayah is shown; ayahs outside the passage are dimmed and never hidden.
 *
 * In the hide modes the words disappear but the ayah-number markers stay, so the
 * person keeps their place on the page and reveals words as they need them. In
 * the mushaf view each glyph token is mapped to its word (`mushaf-tokens.ts`);
 * hidden words keep their width, so the line never reflows.
 */
type PracticePageViewProps = {
  view: Exclude<PracticeView, "ayah">;
  page: number;
  surah: number;
  /** Ayahs of the passage (one surah). */
  passageAyahs: number[];
  currentAyah: number;
  /** Study words of a passage ayah (page view), or null while loading. */
  wordsOf: (ayah: number) => string[] | null;
  statesOf: (ayah: number) => WordState[];
  hiddenOf: (ayah: number) => Set<number>;
  /** Word the reciter is on in the current ayah, while the mic is live. */
  activeWord: number | null;
  surahWordCounts: Record<number, number> | null;
  arabicSize: number;
  arabicFontFamily?: string;
  /** Jump to a passage ayah (ignored while the mic is live). */
  onAyahPress: (ayah: number) => void;
};

export function PracticePageView(props: PracticePageViewProps) {
  return props.view === "mushaf" ? <MushafView {...props} /> : <TextPageView {...props} />;
}

function useWordStyle(props: PracticePageViewProps) {
  const { colors, tokens } = useThemeTokens();
  const inPassage = useMemo(() => new Set(props.passageAyahs), [props.passageAyahs]);
  return (ayah: number | null, word: number | null, end: boolean): TextStyle | null => {
    if (ayah == null || !inPassage.has(ayah)) {
      return { color: withAlpha(colors.foreground, 0.4) };
    }
    const current = ayah === props.currentAyah;
    if (end) {
      return current ? { color: colors.accent } : null;
    }
    const hidden = props.hiddenOf(ayah);
    const isHidden =
      word == null
        ? hidden.size > 0 &&
          hidden.size >= (props.wordsOf(ayah)?.length ?? Number.POSITIVE_INFINITY)
        : hidden.has(word);
    if (isHidden) {
      return { color: "transparent", backgroundColor: colors.muted };
    }
    if (current && word != null && word === props.activeWord) {
      return { color: colors.accent, backgroundColor: tokens.accentSoft };
    }
    const state = word == null ? "idle" : props.statesOf(ayah)[word];
    switch (state) {
      case "upcoming":
        return { color: colors.mutedForeground };
      case "uncertain":
        return { color: tokens.status.warning.color };
      case "confirmedMismatch":
        return { color: tokens.status.danger.color };
      default:
        return current ? { backgroundColor: withAlpha(colors.accent, 0.08) } : null;
    }
  };
}

/** A word's position is its identity inside a fixed ayah. */
function wordKeys(ayah: number, words: string[]): string[] {
  return words.map((word, index) => `${ayah}:${index}:${word}`);
}

/** Level A page: the page's ayahs as one justified right-to-left paragraph per surah. */
function TextPageView(props: PracticePageViewProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const styleFor = useWordStyle(props);
  const ayahs = useMemo(() => getAyahsOnPage(props.page), [props.page]);
  const inPassage = new Set(props.passageAyahs);

  const groups: Array<{ surah: number; ayahs: typeof ayahs }> = [];
  for (const a of ayahs) {
    const last = groups.at(-1);
    if (last && last.surah === a.surah) last.ayahs.push(a);
    else groups.push({ surah: a.surah, ayahs: [a] });
  }

  return (
    <MushafPageFrame page={props.page}>
      {groups.map((group) => {
        const meta = getSurahByNumber(group.surah);
        return (
          <View key={group.surah} style={styles.group}>
            {group.ayahs[0]?.ayah === 1 && meta ? (
              <SurahBanner
                nameArabic={meta.nameArabic}
                nameEnglish={meta.nameEnglish}
                revelationPlace={meta.revelationPlace}
                ayahCount={meta.ayahCount}
              />
            ) : null}
            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: props.arabicSize,
                  lineHeight: props.arabicSize * 2,
                  color: colors.foreground,
                  ...(props.arabicFontFamily ? { fontFamily: props.arabicFontFamily } : null),
                },
              ]}
            >
              {group.ayahs.map((a) => {
                const practised = a.surah === props.surah && inPassage.has(a.ayah);
                const words = practised ? props.wordsOf(a.ayah) : null;
                const press = practised ? () => props.onAyahPress(a.ayah) : undefined;
                return (
                  <Text
                    key={`${a.surah}:${a.ayah}`}
                    onPress={press}
                    accessibilityLabel={t("quran.ayahRef", { surah: a.surah, ayah: a.ayah })}
                  >
                    {words ? (
                      wordKeys(a.ayah, words).map((key, i) => (
                        <Text key={key} style={styleFor(a.ayah, i, false)}>
                          {i > 0 ? " " : ""}
                          {words[i]}
                        </Text>
                      ))
                    ) : (
                      <Text style={styleFor(practised ? a.ayah : null, null, false)}>
                        {a.arabic}
                      </Text>
                    )}
                    <Text
                      style={[
                        { color: colors.accent },
                        styleFor(practised ? a.ayah : null, null, true),
                      ]}
                    >
                      {iosInlineAyahMarker(a.ayah)}
                    </Text>
                  </Text>
                );
              })}
            </Text>
          </View>
        );
      })}
    </MushafPageFrame>
  );
}

/** Level B: the 15-line Madani page, one glyph token per word or ayah marker. */
function MushafView(props: PracticePageViewProps) {
  const { t } = useTranslation();
  const styleFor = useWordStyle(props);
  const layout = useMemo(() => getPageLayout(props.page), [props.page]);
  const mapped = useMemo(() => {
    const prev = props.page > 1 ? getPageLayout(props.page - 1) : null;
    const next = props.page < QURAN_TOTAL_PAGES ? getPageLayout(props.page + 1) : null;
    return mapMushafTokens(layout, props.surah, props.surahWordCounts, prev, next);
  }, [layout, props.page, props.surah, props.surahWordCounts]);

  const renderToken = (token: MushafToken, i: number, lineIndex: number) => {
    const style = styleFor(token.ayah, token.word, token.end);
    const press =
      token.ayah != null && props.passageAyahs.includes(token.ayah)
        ? () => props.onAyahPress(token.ayah as number)
        : undefined;
    return (
      <Text key={`${lineIndex}:${i}`} style={style} onPress={press}>
        {i > 0 ? " " : ""}
        {token.text}
      </Text>
    );
  };

  return (
    <View>
      <MushafLineRenderer
        layout={layout}
        page={props.page}
        arabicSize={props.arabicSize}
        renderLineGlyphs={(lineIndex) => {
          const tokens = mapped.lines[lineIndex];
          return tokens ? tokens.map((token, i) => renderToken(token, i, lineIndex)) : null;
        }}
      />
      {!mapped.mapped ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("quranCompanion.view.mushafCoarse")}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  paragraph: { writingDirection: "rtl", textAlign: "justify" },
  note: { textAlign: "center", marginTop: Spacing.two },
});
