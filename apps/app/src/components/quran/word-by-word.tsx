import type { QuranWord } from "@munib-tracker/shared/types";
import { useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import {
  createContext,
  memo,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  useRootDataNeedsDownload,
  useSurahWordRoots,
} from "@/components/quran/roots/use-word-roots";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { rootToArabic } from "@/lib/quran-roots";
import { arabicReadingLayout, sanitizeArabicText } from "@/lib/reading-typography";

export { activeWordIndexAt } from "@/lib/quran-word-timing";

const EMPTY_WORDS: Record<string, QuranWord[]> = {};
const EMPTY_WORD_LIST: QuranWord[] = [];

type ActiveWordValue = { ayah: number | null; index: number | null };

const QuranActiveWordContext = createContext<ActiveWordValue>({ ayah: null, index: null });

type PlaybackValue = { ayah: number | null; isPlaying: boolean };

const QuranPlaybackContext = createContext<PlaybackValue>({ ayah: null, isPlaying: false });

/** Current recitation track — subscribe from ayah chrome only, never FlatList extraData. */
export function useQuranPlayback(): PlaybackValue {
  return useContext(QuranPlaybackContext);
}

const QuranWordsContext = createContext<Record<string, QuranWord[]>>(EMPTY_WORDS);

/** NF-3.22: the surah being read (root chips) + a deep-linked word to highlight. */
type WordFocusValue = { surah: number | null; focus: { ayah: number; index: number } | null };
const QuranWordFocusContext = createContext<WordFocusValue>({ surah: null, focus: null });

type WordAudioValue = { playUri: (uri: string) => Promise<void> };

const WordAudioContext = createContext<WordAudioValue | null>(null);

function WordAudioProviderLive({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  const playingUriRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // ignore
      }
    };
  }, [player]);

  const playUri = useCallback(
    async (uri: string) => {
      try {
        if (playingUriRef.current === uri) {
          player.seekTo(0);
          player.play();
          return;
        }
        playingUriRef.current = uri;
        await player.replace({ uri });
        player.play();
      } catch {
        playingUriRef.current = null;
      }
    },
    [player],
  );

  const value = useMemo<WordAudioValue>(() => ({ playUri }), [playUri]);
  return <WordAudioContext.Provider value={value}>{children}</WordAudioContext.Provider>;
}

/**
 * Recitation word-highlight + tap-to-play audio for the surah ayah list.
 * Word maps and highlight live in context so FlatList `extraData` does not
 * remount every visible ayah when words load or the recitation cursor moves.
 * One shared expo-audio player avoids mounting a native player per visible ayah.
 */
export function QuranWordStudyProviders({
  wordAudioEnabled,
  playingAyah,
  audioIsPlaying = false,
  activeWordIndex,
  wordsByAyah,
  surah = null,
  focusWord = null,
  children,
}: {
  /** NF-3.22: enables "Root" chips on word tiles for this surah. */
  surah?: number | null;
  /** NF-3.22: word to highlight after a root-search deep link (0-based index). */
  focusWord?: { ayah: number; index: number } | null;
  wordAudioEnabled: boolean;
  playingAyah: number | null;
  audioIsPlaying?: boolean;
  activeWordIndex: number | null;
  wordsByAyah?: Record<string, QuranWord[]>;
  children: ReactNode;
}) {
  const highlight = useMemo<ActiveWordValue>(
    () => ({ ayah: playingAyah, index: activeWordIndex }),
    [playingAyah, activeWordIndex],
  );
  const playback = useMemo<PlaybackValue>(
    () => ({ ayah: playingAyah, isPlaying: audioIsPlaying }),
    [playingAyah, audioIsPlaying],
  );
  const focus = useMemo<WordFocusValue>(() => ({ surah, focus: focusWord }), [surah, focusWord]);
  const tree = (
    <QuranWordFocusContext.Provider value={focus}>
      <QuranPlaybackContext.Provider value={playback}>
        <QuranWordsContext.Provider value={wordsByAyah ?? EMPTY_WORDS}>
          <QuranActiveWordContext.Provider value={highlight}>
            {children}
          </QuranActiveWordContext.Provider>
        </QuranWordsContext.Provider>
      </QuranPlaybackContext.Provider>
    </QuranWordFocusContext.Provider>
  );
  return wordAudioEnabled ? <WordAudioProviderLive>{tree}</WordAudioProviderLive> : tree;
}

type WordByWordProps = {
  /** Ayah number — used to match the recitation highlight from context. */
  ayahNumber: number;
  /** Optional override; defaults to the surah word map from context. */
  words?: QuranWord[];
  arabicSize: number;
  translitSize: number;
  glossSize: number;
};

type WordCardTheme = {
  accent: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accentSoft: string;
  isDark: boolean;
  arabicFontFamily?: string;
  playHint: string;
  noAudioHint: string;
  rootLabel: (root: string) => string;
  noRootLabel: string;
};

type WordCardProps = {
  word: QuranWord;
  index: number;
  isActive: boolean;
  tv: boolean;
  wordArabicSize: number;
  wordTranslitSize: number;
  wordGlossSize: number;
  theme: WordCardTheme;
  onPlay: (index: number, uri: string | undefined) => void;
  /** NF-3.22: roots from the dataset; [] = rootless; undefined = no chip. */
  roots?: string[];
  onOpenRoot?: (root: string) => void;
};

const WordCard = memo(function WordCard({
  word,
  index,
  isActive,
  tv,
  wordArabicSize,
  wordTranslitSize,
  wordGlossSize,
  theme,
  onPlay,
  roots,
  onOpenRoot,
}: WordCardProps) {
  const handlePress = useCallback(() => {
    if (!word.audioUrl) return;
    triggerHaptic("selection");
    onPlay(index, word.audioUrl);
  }, [index, onPlay, word.audioUrl]);

  // TV: the surrounding ayah card is the single D-pad target (Select opens the
  // ayah sheet), so word tiles render as non-focusable display + follow-along
  // highlight. A raw Pressable here would be an invisible nested focus stop.
  const Host = tv ? View : Pressable;
  const hostProps = tv
    ? { accessibilityLabel: `${word.arabic}. ${word.translit}. ${word.gloss}` }
    : {
        accessibilityRole: "button" as const,
        accessibilityLabel: `${word.arabic}. ${word.translit}. ${word.gloss}`,
        accessibilityHint: word.audioUrl ? theme.playHint : theme.noAudioHint,
        disabled: !word.audioUrl,
        onPress: handlePress,
      };

  return (
    <View style={[styles.wordCardShell, tv && styles.wordCardShellTv]}>
      <Host
        {...hostProps}
        style={[
          styles.wordCard,
          tv && styles.wordCardTv,
          {
            backgroundColor: isActive
              ? withAlpha(theme.accent, theme.isDark ? 0.22 : 0.12)
              : theme.muted,
            borderColor: isActive ? theme.accent : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.arabic,
            arabicReadingLayout(wordArabicSize, "center"),
            {
              color: isActive ? theme.accent : theme.foreground,
              fontFamily: theme.arabicFontFamily,
            },
          ]}
        >
          {sanitizeArabicText(word.arabic)}
        </Text>
        {word.translit ? (
          <Text style={[styles.meta, { color: theme.accent, fontSize: wordTranslitSize }]}>
            {word.translit}
          </Text>
        ) : null}
        {word.gloss ? (
          <Text style={[styles.meta, { color: theme.mutedForeground, fontSize: wordGlossSize }]}>
            {word.gloss}
          </Text>
        ) : null}
        {word.audioUrl && !tv ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.playIconWell,
              tv && styles.playIconWellTv,
              { backgroundColor: theme.accentSoft, pointerEvents: "none" },
            ]}
          >
            <Text style={[styles.playGlyph, tv && styles.playGlyphTv, { color: theme.accent }]}>
              ▶
            </Text>
          </View>
        ) : null}
      </Host>
      {roots && !tv ? (
        roots.length ? (
          roots.map((root) => (
            <Pressable
              key={root}
              accessibilityRole="link"
              accessibilityLabel={theme.rootLabel(rootToArabic(root))}
              onPress={() => onOpenRoot?.(root)}
              style={[styles.rootChip, { backgroundColor: theme.accentSoft }]}
            >
              <Text style={[styles.rootChipText, { color: theme.accent }]}>
                {theme.rootLabel(rootToArabic(root))}
              </Text>
            </Pressable>
          ))
        ) : (
          <Text style={[styles.rootChipText, styles.noRoot, { color: theme.mutedForeground }]}>
            {theme.noRootLabel}
          </Text>
        )
      ) : null}
    </View>
  );
});

/**
 * Word-by-word breakdown for ayah study. Tap a word to hear its audio; the
 * active word is highlighted while the full ayah recitation plays (when
 * timing segments are available).
 */
export const WordByWord = memo(function WordByWord({
  ayahNumber,
  words: wordsProp,
  arabicSize,
  translitSize,
  glossSize,
}: WordByWordProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arabicFontFamily = useArabicFontFamily();
  const tv = isTV();
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const activeWord = useContext(QuranActiveWordContext);
  const wordsFromContext = useContext(QuranWordsContext);
  const wordAudio = useContext(WordAudioContext);
  const words = wordsProp ?? wordsFromContext[String(ayahNumber)] ?? EMPTY_WORD_LIST;
  const activeWordIndex = activeWord.ayah === ayahNumber ? activeWord.index : null;
  const router = useRouter();
  const wordFocus = useContext(QuranWordFocusContext);
  const focusIndex = wordFocus.focus?.ayah === ayahNumber ? wordFocus.focus.index : null;
  const surahRoots = useSurahWordRoots(wordFocus.surah, !tv && words.length > 0);
  const rootsNeedDownload = useRootDataNeedsDownload();
  // Chips only when Quran.com's word split matches the bundled split for this ayah.
  const rootsAligned =
    surahRoots != null && surahRoots.bundledCounts.get(ayahNumber) === words.length;
  const openRoot = useCallback(
    (root: string) => router.push({ pathname: "/quran/roots/[root]", params: { root } }),
    [router],
  );

  const theme = useMemo<WordCardTheme>(
    () => ({
      accent: colors.accent,
      foreground: colors.foreground,
      muted: colors.muted,
      mutedForeground: colors.mutedForeground,
      accentSoft: tokens.accentSoft,
      isDark: tokens.isDark,
      arabicFontFamily,
      playHint: t("quran.wordByWord.playWord"),
      noAudioHint: t("quran.wordByWord.noAudio"),
      rootLabel: (root: string) => t("quranRoots.chip", { root }),
      noRootLabel: t("quranRoots.noRoot"),
    }),
    [
      arabicFontFamily,
      colors.accent,
      colors.foreground,
      colors.muted,
      colors.mutedForeground,
      t,
      tokens.accentSoft,
      tokens.isDark,
    ],
  );

  // Audio-driven highlight wins over a prior tap once recitation is progressing.
  useEffect(() => {
    if (activeWordIndex != null) setTappedIndex(null);
  }, [activeWordIndex]);

  const playWord = useCallback(
    async (index: number, uri: string | undefined) => {
      if (!uri) return;
      setTappedIndex(index);
      await wordAudio?.playUri(uri);
    },
    [wordAudio],
  );

  if (words.length === 0) return null;

  const wordArabicSize = Math.max(tv ? 22 : 18, arabicSize - (tv ? 2 : 4));
  const wordTranslitSize = Math.max(
    tv ? TvLayout.bodyFontSize - 2 : 12,
    translitSize - (tv ? 0 : 2),
  );
  const wordGlossSize = Math.max(tv ? 14 : 11, glossSize - (tv ? 0 : 2));

  // RTL reading order: render words right-to-left via row-reverse.
  return (
    <View style={[styles.section, tv && styles.sectionTv]}>
      <ThemedText
        type="caption"
        style={[
          styles.heading,
          { color: colors.mutedForeground, fontSize: tv ? TvLayout.bodyFontSize - 2 : undefined },
        ]}
      >
        {t("quran.wordByWord.title")}
      </ThemedText>
      {rootsNeedDownload && !tv && wordFocus.surah != null ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push({ pathname: "/quran/search", params: { mode: "root" } })}
          style={styles.rootsLink}
        >
          <Text style={[styles.rootChipText, { color: colors.accent }]}>
            {t("quranRoots.showRoots")}
          </Text>
        </Pressable>
      ) : null}
      <View style={[styles.grid, tv && styles.gridTv]}>
        {words.map((word, index) => (
          <WordCard
            // biome-ignore lint/suspicious/noArrayIndexKey: ayah word order is fixed; arabic can repeat
            key={`${word.arabic}-${index}`}
            word={word}
            index={index}
            isActive={activeWordIndex === index || tappedIndex === index || focusIndex === index}
            roots={
              rootsAligned ? (surahRoots?.roots.get(`${ayahNumber}:${index}`) ?? []) : undefined
            }
            onOpenRoot={openRoot}
            tv={tv}
            wordArabicSize={wordArabicSize}
            wordTranslitSize={wordTranslitSize}
            wordGlossSize={wordGlossSize}
            theme={theme}
            onPlay={playWord}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  rootChip: {
    alignSelf: "center",
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  rootChipText: { fontSize: 12, textAlign: "center" },
  noRoot: { marginTop: Spacing.one },
  rootsLink: { alignSelf: "flex-start" },
  section: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  sectionTv: {
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  /**
   * Content-height wrap: `alignItems`/`alignContent: flex-start` stops Yoga from
   * stretching wrapped `%`-width shells to the nearest flex:1 ancestor.
   */
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: Spacing.two,
    justifyContent: "flex-start",
  },
  gridTv: {
    gap: Spacing.three,
  },
  /**
   * Definite column width lives on this shell — not on PressableScale. Percentage
   * width + `alignSelf: "flex-start"` on PressableScale's inner wrapper collapses
   * tiles to the play-icon width and wraps gloss one letter per line.
   */
  wordCardShell: {
    width: "47%",
    maxWidth: 200,
    flexGrow: 0,
    flexShrink: 0,
  },
  wordCardShellTv: {
    width: "22%",
    maxWidth: 220,
  },
  wordCard: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  wordCardTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    borderRadius: Radius.lg,
  },
  arabic: {
    width: "100%",
    textAlign: "center",
  },
  meta: {
    width: "100%",
    textAlign: "center",
  },
  playIconWell: {
    marginTop: Spacing.half,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconWellTv: {
    marginTop: Spacing.one,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  playGlyph: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
  },
  playGlyphTv: {
    fontSize: 14,
    lineHeight: 16,
  },
});
