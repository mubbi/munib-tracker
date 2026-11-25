import type { UserPreferences } from "@munib-tracker/shared/types";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, type TextStyle, useWindowDimensions, View } from "react-native";
import { JannahCallout } from "@/components/jannah/primitives";
import { ReciteToFindPanel } from "@/components/quran/recite-to-find-panel";
import { RootSearchPanel } from "@/components/quran/roots/root-search-panel";
import {
  ReadingTypographyBar,
  ReadingTypographyProvider,
  useReadingTypography,
} from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { BorderWidth, Breakpoints, Control, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useReciteToFindAvailability } from "@/hooks/use-recite-to-find";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import i18n from "@/i18n";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  detectQuranVerses,
  segmentHighlightedText,
  type VerseDetectionHit,
  type VerseDetectorLang,
} from "@/lib/quran-verse-detector";
import {
  arabicReadingLayout,
  compactArabicTextStyle,
  resolveArabicFontFamily,
} from "@/lib/reading-typography";
import { RECITE_MODE_PARAM } from "@/lib/recite-to-find/links";
import { useChevronForward } from "@/lib/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import { clearAyahIndex } from "@/lib/search";
import { buildAyahSharePayload } from "@/lib/share";
import type { SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

/**
 * "Find an ayah" (C-08): one finder behind two entry points. `/quran/search`
 * (Qur'an hub: Text · Root · Recite) and `/verse-detector` (Library: Type ·
 * Recite) both render `FindAyahScreen`; the routes, their deep-link params
 * (`?mode=root&q=…`, `?mode=recite`) and SEO stay as they were. The two text
 * bodies keep their own tuning (quick list vs. best-match detector) but share
 * the result card, the no-results state, the language default and STT errors.
 */
export type FindAyahEntry = "search" | "detector";

// ── Shared pieces ────────────────────────────────────────────────────────────

/** UI / translation languages written in Arabic script (they type Arabic letters). */
const ARABIC_SCRIPT_LOCALES = new Set(["ar", "ur", "fa", "ps", "ku"]);

/**
 * Default search language (G-10). The verse index covers the Arabic text and
 * the English translation, so the reader's translation language wins when it
 * is indexed; an Arabic-script reader starts on the Arabic index (closest to
 * what they type); everyone else starts on English.
 */
export function defaultFindAyahLang({
  translationLocale,
  locale,
}: {
  translationLocale?: UserPreferences["translationLocale"] | string | null;
  locale?: UserPreferences["locale"] | string | null;
}): VerseDetectorLang {
  const translation = (translationLocale ?? "").split("-")[0];
  const ui = (locale ?? "").split("-")[0];
  if (translation === "en") return "en";
  if (translation === "ar") return "ar";
  if (ARABIC_SCRIPT_LOCALES.has(translation) || ARABIC_SCRIPT_LOCALES.has(ui)) return "ar";
  return "en";
}

function useDefaultFindAyahLang(): VerseDetectorLang {
  const { translationLocale, locale } = usePreferences();
  return defaultFindAyahLang({ translationLocale, locale: locale || i18n.language });
}

/** Mic / dictation failures → one toast vocabulary for both entry points. */
function useSttErrorToast() {
  const { t } = useTranslation();
  const toast = useToast();
  return useCallback(
    (kind: SttErrorKind) => {
      switch (kind) {
        case "permission":
          toast.warning(t("search.stt.permissionDenied"));
          break;
        case "noSpeech":
          toast.info(t("search.stt.couldNotHear"));
          break;
        case "unavailable":
          toast.warning(t("search.stt.unavailable"));
          break;
        default:
          toast.error(t("search.stt.errorGeneric"));
      }
    },
    [t, toast],
  );
}

/** Presets use well-known names so alias detection resolves the exact ayah. */
const EXAMPLE_SNIPPETS: Record<string, { lang: VerseDetectorLang; text: string }> = {
  kursi: {
    lang: "en",
    text: "Ayat al-Kursi",
  },
  fatiha: {
    lang: "ar",
    text: "بسم الله الرحمن الرحيم",
  },
  ikhlas: {
    lang: "en",
    text: "Al-Ikhlas",
  },
};

function useExamples() {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { id: "kursi", label: t("quran.detector.exampleKursi") },
      { id: "fatiha", label: t("quran.detector.exampleFatiha") },
      { id: "ikhlas", label: t("quran.detector.exampleIkhlas") },
    ],
    [t],
  );
}

function confidencePercent(confidence: number): number {
  return Math.round(confidence * 100);
}

function HighlightedText({
  text,
  query,
  style,
  numberOfLines,
  arabic,
}: {
  text: string;
  query: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
  arabic?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const segments = useMemo(() => segmentHighlightedText(text, query), [text, query]);
  const arabicFamily = arabic ? resolveArabicFontFamily(fontPrefs.arabic.family) : undefined;
  const hasMatch = segments.some((segment) => segment.matched);
  const flatStyle = StyleSheet.flatten(style);
  const baseColor = flatStyle?.color ?? colors.mutedForeground;
  const language = arabic ? "ar" : undefined;

  if (!hasMatch) {
    return (
      <Text
        style={[flatStyle, arabicFamily ? { fontFamily: arabicFamily } : null]}
        numberOfLines={numberOfLines}
        accessibilityLanguage={language}
      >
        {text}
      </Text>
    );
  }

  return (
    <Text
      style={[flatStyle, arabicFamily ? { fontFamily: arabicFamily } : null]}
      numberOfLines={numberOfLines}
      accessibilityLanguage={language}
    >
      {segments.map((segment) => (
        <Text
          key={`${segment.start}-${segment.matched ? "m" : "u"}`}
          style={
            segment.matched
              ? {
                  backgroundColor: tokens.status.warning.soft,
                  color: colors.foreground,
                }
              : { color: baseColor }
          }
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}

type ResultCardProps = {
  hit: VerseDetectionHit;
  onOpen: () => void;
  /** Omit on TV (no system share sheet). */
  onShare?: () => void;
  isSharing?: boolean;
  isGesturePending?: boolean;
  /** Detector: the top hit gets the accent surface and a "Best match" label. */
  featured?: boolean;
  /** Detector: read-full toggle (undefined hides it). */
  expanded?: boolean;
  onToggleExpanded?: () => void;
  /** Detector: confidence pill + highlighted query + reading-size text. */
  detailed?: boolean;
};

/**
 * One result. The whole card body (name, reference, Arabic, translation) is a
 * single pressable that opens the ayah (G-09); read-full and share sit beside
 * it as siblings, never nested (RN Web renders each pressable as a <button>).
 * No `accessibilityLabel` on the body: screen readers read the surah, the
 * reference, the Arabic (tagged `ar`) and the translation in order.
 */
export function FindAyahResultCard({
  hit,
  onOpen,
  onShare,
  isSharing = false,
  isGesturePending = false,
  featured = false,
  expanded = false,
  onToggleExpanded,
  detailed = false,
}: ResultCardProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const chevronForward = useChevronForward();
  const tv = isTV();
  const lines = expanded ? undefined : featured ? 4 : 2;
  const ref = t("quran.ayahRef", { surah: hit.surah, ayah: hit.ayah });
  const hasActions = Boolean(onToggleExpanded || onShare);

  return (
    <View
      testID={`find-ayah-result-${hit.surah}:${hit.ayah}`}
      style={[
        styles.resultCard,
        {
          backgroundColor: featured ? tokens.accentSoft : colors.muted,
          borderColor: featured ? colors.accent : detailed ? "transparent" : colors.muted,
        },
        featured && styles.resultCardFeatured,
      ]}
    >
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityHint={t("quran.find.openHint")}
        onPress={onOpen}
        scaleTo={0.99}
        style={[styles.resultBody, tv && styles.resultBodyTv]}
      >
        {featured ? (
          <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
            {t("quran.detector.bestMatch")}
          </ThemedText>
        ) : null}
        <View style={styles.resultHeader}>
          <View style={styles.resultTitleBlock}>
            {hit.popularName ? (
              <ThemedText type="smallBold" numberOfLines={1} style={{ color: tokens.accentOnSoft }}>
                {hit.popularName}
              </ThemedText>
            ) : null}
            <ThemedText type={hit.popularName ? "caption" : "smallBold"} numberOfLines={1}>
              {hit.surahName}
            </ThemedText>
            {detailed ? (
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {hit.surahNameEnglish}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.resultBadges}>
            <Pill
              label={ref}
              color={colors.accent}
              background={featured ? colors.card : tokens.accentSoft}
              compact={detailed}
            />
            {detailed ? (
              <Pill
                label={t("quran.detector.confidence", {
                  percent: `${confidencePercent(hit.confidence)}%`,
                })}
                tone="success"
                compact
              />
            ) : null}
          </View>
        </View>

        {hit.arabic ? (
          detailed ? (
            <HighlightedText
              arabic
              text={hit.arabic}
              query={hit.query}
              numberOfLines={lines}
              style={[
                arabicReadingLayout(sizes.arabic),
                { lineHeight: sizes.arabic * 1.75, color: colors.foreground },
                styles.arabicLine,
              ]}
            />
          ) : (
            <ThemedText
              type="arabic"
              numberOfLines={2}
              style={compactArabicTextStyle()}
              accessibilityLanguage="ar"
            >
              {hit.arabic}
            </ThemedText>
          )
        ) : null}

        {detailed ? (
          <HighlightedText
            text={hit.translation}
            query={hit.query}
            numberOfLines={lines}
            style={{
              fontSize: sizes.translation,
              lineHeight: sizes.translation * 1.45,
              color: colors.mutedForeground,
            }}
          />
        ) : (
          <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
            {hit.translation}
          </ThemedText>
        )}

        {expanded && hit.transliteration ? (
          <HighlightedText
            text={hit.transliteration}
            query={hit.query}
            style={{
              fontSize: sizes.transliteration,
              lineHeight: sizes.transliteration * 1.4,
              color: colors.mutedForeground,
            }}
          />
        ) : null}

        {detailed ? (
          // Visual cue only — the whole body is the "open" target.
          <View style={styles.openCue}>
            <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
              {t("quran.detector.openInQuran")}
            </ThemedText>
            <SymbolView name={chevronForward} size={14} tintColor={tokens.accentOnSoft} />
          </View>
        ) : null}
      </PressableScale>

      {hasActions ? (
        <View style={styles.resultActions}>
          {onToggleExpanded ? (
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={
                expanded ? t("quran.detector.showLess") : t("quran.detector.readFull")
              }
              accessibilityState={{ expanded }}
              onPress={onToggleExpanded}
              style={styles.textAction}
            >
              <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
                {expanded ? t("quran.detector.showLess") : t("quran.detector.readFull")}
              </ThemedText>
            </PressableScale>
          ) : (
            <View style={styles.flex} />
          )}
          {onShare ? (
            <IconButton
              name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              size={18}
              tintColor={colors.mutedForeground}
              haptic="light"
              loading={isSharing}
              accessibilityLabel={
                isGesturePending
                  ? tTv(t, "share.tapToShare", "share.selectToShare")
                  : t("quran.shareAyah")
              }
              onPress={onShare}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/**
 * No-results (C-36): one sentence + two next steps — search every category in
 * the app for the same words, or try one of the example queries.
 */
export function FindAyahNoResults({
  query,
  onExample,
}: {
  query: string;
  onExample: (id: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const examples = useExamples();
  return (
    <View style={styles.noResults}>
      <EmptyState
        icon={{ ios: "text.magnifyingglass", android: "manage_search", web: "manage_search" }}
        title={t("quran.find.noResultsTitle")}
        description={t("quran.find.noResultsBody")}
        actionLabel={t("quran.find.searchEverywhere")}
        onAction={() => router.push({ pathname: "/search", params: { q: query } } as Href)}
      />
      <View style={styles.examplesBlock}>
        <ThemedText type="smallBold" style={styles.centerText}>
          {t("quran.detector.examples")}
        </ThemedText>
        <View style={styles.examplesWrap}>
          {examples.map((example) => (
            <Chip
              key={example.id}
              label={example.label}
              selected={false}
              onPress={() => onExample(example.id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

/** Debounce → idle-deferred verse detection, shared by both text bodies. */
function useVerseDetection({
  query,
  lang,
  debounceMs,
  minLength,
  limit,
  onResults,
}: {
  query: string;
  lang: VerseDetectorLang;
  debounceMs: number;
  minLength: number;
  limit: number;
  onResults?: (hits: VerseDetectionHit[]) => void;
}) {
  const [debounced, setDebounced] = useState("");
  const [pending, setPending] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<VerseDetectionHit[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultsRef = useRef(onResults);
  onResultsRef.current = onResults;

  // Reclaim the multi-MB ayah Fuse heap when leaving the screen.
  useEffect(() => () => clearAyahIndex(), []);

  useEffect(() => {
    if (query.trim() === debounced) {
      setPending(false);
      return;
    }
    setPending(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebounced(query.trim());
      setPending(false);
    }, debounceMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, debounced, debounceMs]);

  // Verse-detector pipeline: aliases, surah:ayah refs, substring, and fuzzy Fuse
  // over Arabic + translation + transliteration. Deferred off the interaction thread.
  useEffect(() => {
    if (debounced.length < minLength) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      void detectQuranVerses(debounced, { lang, limit }).then((hits) => {
        if (cancelled) return;
        setResults(hits);
        setSearching(false);
        onResultsRef.current?.(hits);
      });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, lang, limit, minLength]);

  return { debounced, setDebounced, busy: pending || searching, results };
}

/**
 * One tuning for both text bodies (P5-30): same debounce, minimum query and
 * result cap, so a query finds the same ayahs from either entry point. Only the
 * presentation differs (quick grid vs. best match + other matches).
 */
const FIND_DEBOUNCE_MS = 300;
const FIND_MIN_QUERY_LENGTH = 2;
const FIND_MAX_RESULTS = 20;

/** Inline "Searching…" placeholder: result-shaped skeleton rows (no spinner). */
function FindAyahSearching({ label }: { label: string }) {
  return (
    <SkeletonPlaceholder
      preset="rows"
      count={3}
      accessibilityLabel={label}
      style={styles.searchingSkeleton}
    />
  );
}

function readerHref(hit: VerseDetectionHit): Href {
  return {
    pathname: "/quran/[surah]",
    params: { surah: String(hit.surah), ayah: String(hit.ayah) },
  };
}

// ── Qur'an hub entry: Text · Root · Recite ──────────────────────────────────

/** Desktop: language switch sits beside the query field instead of above it. */
const WIDE_CONTROLS_MIN_WIDTH = 1024;

function SearchEntry() {
  const router = useRouter();
  const { t } = useTranslation();
  // NF-3.22: Text | Root toggle (`?mode=root` deep-links straight to root search).
  // D68: + Recite (on-device listener, `?mode=recite`) where the listener can run.
  const params = useLocalSearchParams<{ mode?: string; q?: string }>();
  const [mode, setMode] = useState<"text" | "root" | "recite">(
    params.mode === "root" ? "root" : params.mode === RECITE_MODE_PARAM ? "recite" : "text",
  );
  const { available: reciteAvailable } = useReciteToFindAvailability();
  const activeMode = mode === "recite" && !reciteAvailable ? "text" : mode;
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const tv = isTV();
  const { width: windowWidth } = useWindowDimensions();
  const wideControls = !tv && windowWidth >= WIDE_CONTROLS_MIN_WIDTH;
  const defaultLang = useDefaultFindAyahLang();

  const [lang, setLang] = useState<VerseDetectorLang>(defaultLang);
  const [query, setQuery] = useState("");
  const { debounced, setDebounced, busy, results } = useVerseDetection({
    query,
    lang,
    debounceMs: FIND_DEBOUNCE_MS,
    minLength: FIND_MIN_QUERY_LENGTH,
    limit: FIND_MAX_RESULTS,
  });

  const shareAyah = useCallback(
    (hit: VerseDetectionHit) => {
      void share({
        ...buildAyahSharePayload(hit.arabic, hit.translation, hit.surah, hit.ayah, {
          surahName: hit.surahName,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${hit.surah}:${hit.ayah}`,
      });
    },
    [share, t],
  );

  const handleSttError = useSttErrorToast();
  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: setQuery,
    onError: handleSttError,
  });

  const setQueryFromInput = useCallback(
    (value: string) => {
      if (stt.listening) stt.abort();
      setQuery(value);
    },
    [stt],
  );

  const toggleVoice = useCallback(() => {
    if (stt.listening) {
      stt.stop();
      return;
    }
    void stt.start("quran-search", "", lang === "ar" ? "arabic" : "other");
  }, [lang, stt]);

  const onLangChange = useCallback(
    (next: VerseDetectorLang) => {
      if (stt.listening) stt.abort();
      setLang(next);
    },
    [stt],
  );

  const applyExample = useCallback(
    (id: string) => {
      const sample = EXAMPLE_SNIPPETS[id];
      if (!sample) return;
      if (stt.listening) stt.abort();
      setLang(sample.lang);
      setQuery(sample.text);
      setDebounced(sample.text);
    },
    [setDebounced, stt],
  );

  const modeOptions = useMemo(
    () => [
      { id: "text" as const, label: t("quranRoots.mode.text") },
      { id: "root" as const, label: t("quranRoots.mode.root") },
      ...(reciteAvailable ? [{ id: "recite" as const, label: t("reciteToFind.mode.recite") }] : []),
    ],
    [reciteAvailable, t],
  );

  const langOptions = useMemo(
    () => [
      { id: "en" as const, label: t("quran.detector.langEnglish") },
      { id: "ar" as const, label: t("quran.detector.langArabic") },
    ],
    [t],
  );

  const placeholder =
    lang === "ar" ? t("quran.searchPlaceholderArabic") : t("quran.searchPlaceholder");

  const showEmpty = !busy && debounced.length >= FIND_MIN_QUERY_LENGTH && results.length === 0;
  // TV has no microphone path — never offer dictation there.
  const voiceAvailable = stt.available && !tv;

  return (
    <>
      {SnapshotHost}
      <View style={styles.modeRow}>
        <SegmentedControl
          options={modeOptions}
          value={activeMode}
          onChange={(next) => {
            if (stt.listening) stt.abort();
            setMode(next);
          }}
        />
      </View>
      {activeMode === "recite" ? (
        <ReciteToFindPanel twoPane={wideControls} />
      ) : activeMode === "root" ? (
        <RootSearchPanel
          initialQuery={params.mode === "root" ? (params.q ?? "") : ""}
          onSearchText={(text) => {
            setLang("ar");
            setQuery(text);
            setMode("text");
          }}
        />
      ) : (
        <Card>
          <View style={wideControls ? styles.controlsWide : undefined}>
            <View style={[styles.fieldGroup, wideControls && styles.fieldGroupWide]}>
              <ThemedText type="smallBold">{t("quran.detector.languageLabel")}</ThemedText>
              <SegmentedControl options={langOptions} value={lang} onChange={onLangChange} />
            </View>

            <SearchField
              value={query}
              onChangeText={setQueryFromInput}
              placeholder={placeholder}
              // TV: never pop the on-screen keyboard on mount.
              autoFocus={!tv}
              direction={lang === "ar" ? "rtl" : "ltr"}
              style={wideControls ? styles.inputWrapWide : undefined}
              trailing={
                voiceAvailable ? (
                  <VoiceInputButton
                    size="sm"
                    listening={stt.listening}
                    level={stt.level}
                    accessibilityLabel={
                      stt.listening ? t("quran.detector.stopDictate") : t("quran.detector.dictate")
                    }
                    accessibilityHint={stt.listening ? t("quran.detector.listening") : undefined}
                    onPress={toggleVoice}
                  />
                ) : undefined
              }
            />
          </View>

          {busy ? (
            <FindAyahSearching label={t("quran.searching")} />
          ) : (
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              style={styles.hint}
              accessibilityLiveRegion="polite"
            >
              {results.length > 0
                ? t("quran.resultsCount", { count: results.length })
                : stt.listening
                  ? t("quran.detector.listening")
                  : t("quran.searchHint")}
            </ThemedText>
          )}

          {showEmpty ? (
            <FindAyahNoResults query={debounced} onExample={applyExample} />
          ) : !busy ? (
            // TV: single focus column. Tablet / desktop: two result columns.
            <ResponsiveGrid
              gap={Spacing.two}
              maxColumns={2}
              columns={tv ? 1 : undefined}
              style={styles.resultsGrid}
            >
              {results.map((hit) => {
                const key = `${hit.surah}:${hit.ayah}`;
                return (
                  <FindAyahResultCard
                    key={key}
                    hit={hit}
                    onOpen={() => router.push(readerHref(hit))}
                    // TV: one focus stop per result (Select opens the ayah); no share.
                    onShare={tv ? undefined : () => shareAyah(hit)}
                    isSharing={isSharing(key)}
                    isGesturePending={isGesturePending(key)}
                  />
                );
              })}
            </ResponsiveGrid>
          ) : null}
        </Card>
      )}
    </>
  );
}

// ── Library entry (verse detector): Type · Recite ───────────────────────────

function DetectorBody({ twoPane }: { twoPane: boolean }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const defaultLang = useDefaultFindAyahLang();

  const [lang, setLang] = useState<VerseDetectorLang>(defaultLang);
  const [query, setQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const wasListeningRef = useRef(false);
  const { debounced, setDebounced, busy, results } = useVerseDetection({
    query,
    lang,
    debounceMs: FIND_DEBOUNCE_MS,
    minLength: FIND_MIN_QUERY_LENGTH,
    limit: FIND_MAX_RESULTS,
    onResults: (hits) => setExpandedKey(hits[0] ? `${hits[0].surah}:${hits[0].ayah}` : null),
  });

  const handleSttError = useSttErrorToast();
  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: setQuery,
    onError: handleSttError,
  });

  // Dictation finished: detect right away instead of waiting for the debounce.
  useEffect(() => {
    if (stt.listening) {
      wasListeningRef.current = true;
      return;
    }
    if (wasListeningRef.current && query.trim().length >= FIND_MIN_QUERY_LENGTH) {
      setDebounced(query.trim());
    }
    wasListeningRef.current = false;
  }, [stt.listening, query, setDebounced]);

  const showEmpty = !busy && debounced.length >= FIND_MIN_QUERY_LENGTH && results.length === 0;
  const hasInput = query.trim().length > 0;
  const topHit = results[0];
  const otherHits = results.slice(1);
  const { width } = useWindowDimensions();
  /** Very wide desktop: secondary matches in two columns beside each other. */
  const otherColumns = twoPane && width >= 1440 ? 2 : 1;
  const examples = useExamples();

  const applyExample = useCallback(
    (id: string) => {
      const sample = EXAMPLE_SNIPPETS[id];
      if (!sample) return;
      if (stt.listening) stt.abort();
      setLang(sample.lang);
      setQuery(sample.text);
      setDebounced(sample.text);
    },
    [setDebounced, stt],
  );

  const setQueryFromInput = useCallback(
    (value: string) => {
      if (stt.listening) stt.abort();
      setQuery(value);
    },
    [stt],
  );

  const toggleVoice = useCallback(() => {
    if (stt.listening) {
      stt.stop();
      return;
    }
    void stt.start("verse", "", lang === "ar" ? "arabic" : "other");
  }, [lang, stt]);

  const shareHit = useCallback(
    (hit: VerseDetectionHit) => {
      void share({
        ...buildAyahSharePayload(hit.arabic, hit.translation, hit.surah, hit.ayah, {
          surahName: hit.surahName,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${hit.surah}:${hit.ayah}`,
      });
    },
    [share, t],
  );

  const langOptions = useMemo(
    () => [
      { id: "en" as const, label: t("quran.detector.langEnglish") },
      { id: "ar" as const, label: t("quran.detector.langArabic") },
    ],
    [t],
  );

  const resultCard = (hit: VerseDetectionHit, featured: boolean) => {
    const key = `${hit.surah}:${hit.ayah}`;
    return (
      <FindAyahResultCard
        hit={hit}
        detailed
        featured={featured}
        expanded={expandedKey === key}
        onToggleExpanded={() => setExpandedKey((current) => (current === key ? null : key))}
        onOpen={() => router.push(readerHref(hit))}
        onShare={() => shareHit(hit)}
        isSharing={isSharing(key)}
        isGesturePending={isGesturePending(key)}
      />
    );
  };

  const composerCard = (
    <Card
      padding="four"
      style={[
        styles.composer,
        {
          borderWidth: BorderWidth.thin,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">{t("quran.detector.languageLabel")}</ThemedText>
        <SegmentedControl options={langOptions} value={lang} onChange={setLang} />
      </View>

      {/* Multi-line so a whole passage can be pasted (kept from the original
          verse detector); debounce, minimum length and result cap are shared with
          the Qur'an search entry (P5-30). Clear + voice sit in the trailing slot. */}
      <TextField
        label={t("quran.detector.textLabel")}
        value={query}
        onChangeText={setQueryFromInput}
        placeholder={t("quran.detector.textPlaceholder")}
        multiline
        minLines={3}
        textAlignVertical="top"
        autoCorrect={false}
        inputStyle={{
          textAlign: lang === "ar" ? "right" : "left",
          writingDirection: lang === "ar" ? "rtl" : "ltr",
        }}
        trailing={
          <View style={styles.detectorTrailing}>
            {hasInput ? (
              <IconButton
                accessibilityLabel={t("search.clear")}
                onPress={() => setQueryFromInput("")}
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                size={18}
                tintColor={colors.mutedForeground}
              />
            ) : null}
            {stt.available ? (
              <VoiceInputButton
                size="sm"
                listening={stt.listening}
                level={stt.level}
                accessibilityLabel={
                  stt.listening ? t("quran.detector.stopDictate") : t("quran.detector.dictate")
                }
                accessibilityHint={stt.listening ? t("quran.detector.listening") : undefined}
                onPress={toggleVoice}
              />
            ) : null}
          </View>
        }
      />
      {stt.listening ? (
        <View style={styles.listeningBadge} accessibilityLiveRegion="polite">
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={14}
            tintColor={colors.accent}
          />
          <ThemedText type="caption" style={{ color: colors.accentText }}>
            {t("quran.detector.listening")}
          </ThemedText>
        </View>
      ) : null}

      {!twoPane && !hasInput && !stt.listening ? (
        <JannahCallout tone="info">{t("quran.detector.detectHint")}</JannahCallout>
      ) : null}

      {busy && !twoPane ? <FindAyahSearching label={t("quran.detector.detecting")} /> : null}

      <View style={styles.examplesBlock}>
        <ThemedText type="smallBold">{t("quran.detector.examples")}</ThemedText>
        {/* Wrap the example chips — no sideways swipe to discover them. */}
        <View style={styles.examplesWrap}>
          {examples.map((example) => (
            <Chip
              key={example.id}
              label={example.label}
              selected={false}
              onPress={() => applyExample(example.id)}
            />
          ))}
        </View>
      </View>
    </Card>
  );

  const emptyState = showEmpty ? (
    <FindAyahNoResults query={debounced} onExample={applyExample} />
  ) : null;

  const resultsCard =
    !busy && topHit ? (
      <Card
        style={[
          styles.resultsCard,
          {
            borderWidth: BorderWidth.thin,
            borderColor: colors.border,
          },
        ]}
      >
        <ReadingTypographyBar surface="quran" />
        {resultCard(topHit, true)}

        {otherHits.length > 0 ? (
          <View style={styles.otherBlock}>
            <SectionHeader title={t("quran.detector.otherMatches")} />
            <View style={[styles.resultsList, otherColumns > 1 && styles.resultsListGrid]}>
              {otherHits.map((hit) => (
                <View
                  key={`${hit.surah}:${hit.ayah}`}
                  style={otherColumns > 1 ? styles.resultsCell : undefined}
                >
                  {resultCard(hit, false)}
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Card>
    ) : null;

  return (
    <>
      {SnapshotHost}
      <Stagger>
        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.composerPane}>{composerCard}</View>
            <View style={styles.resultsPane}>
              {emptyState}
              {resultsCard}
              {!busy && !showEmpty && !topHit ? (
                <EmptyState
                  icon={{
                    ios: "text.magnifyingglass",
                    android: "manage_search",
                    web: "manage_search",
                  }}
                  title={t("quran.find.title")}
                  description={t("quran.detector.detectHint")}
                />
              ) : null}
              {busy ? <FindAyahSearching label={t("quran.detector.detecting")} /> : null}
            </View>
          </View>
        ) : null}
        {twoPane ? null : composerCard}
        {twoPane ? null : emptyState}
        {twoPane ? null : resultsCard}
      </Stagger>
    </>
  );
}

type DetectorMode = "type" | "recite";

/**
 * Type / Recite switch (D68). Recite uses the on-device Qur'an listener; Type
 * keeps text search plus the phone's generic dictation for translation-language
 * queries. `?mode=recite` (universal search shortcut) opens Recite. The switch
 * is hidden where the listener cannot run (TV, unsupported browsers).
 */
function DetectorModes({ twoPane }: { twoPane: boolean }) {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { available } = useReciteToFindAvailability();
  const modeParam = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const [mode, setMode] = useState<DetectorMode>(
    modeParam === RECITE_MODE_PARAM ? "recite" : "type",
  );
  // A link to an already-open detector (quick action, search shortcut) changes
  // only the param: follow it. Without a param the user's own choice stays.
  useEffect(() => {
    if (modeParam === RECITE_MODE_PARAM) setMode("recite");
    else if (modeParam === "type") setMode("type");
  }, [modeParam]);
  const effective: DetectorMode = available ? mode : "type";
  const modeOptions = useMemo(
    () => [
      { id: "type" as const, label: t("reciteToFind.mode.type") },
      { id: "recite" as const, label: t("reciteToFind.mode.recite") },
    ],
    [t],
  );

  return (
    <>
      {available ? (
        <View style={[styles.modeRow, twoPane && styles.modeRowWide]}>
          <SegmentedControl options={modeOptions} value={effective} onChange={setMode} />
        </View>
      ) : null}
      {effective === "recite" ? (
        <ReciteToFindPanel twoPane={twoPane} />
      ) : (
        <DetectorBody twoPane={twoPane} />
      )}
    </>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

/** The one "Find an ayah" screen; `entry` keeps each route's back target and modes. */
export function FindAyahScreen({ entry }: { entry: FindAyahEntry }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const fromLibrary = entry === "detector";
  /** Desktop / wide web: composer on the start side, matches beside it. */
  const twoPane = fromLibrary && width >= Breakpoints.wide;
  const seoPath = fromLibrary ? "/verse-detector" : "/quran/search";
  const layoutProps = {
    eyebrow: fromLibrary ? t("library.eyebrow") : t("quran.title"),
    title: t("quran.find.title"),
    subtitle: t("quran.find.subtitle"),
    onBack: () => goBackOrReplace(router, fromLibrary ? "/library" : "/"),
  };

  if (fromLibrary && isTV()) {
    return (
      <ScreenLayout {...layoutProps}>
        <Seo path={seoPath} />
        {/* TV has no microphone: explain, and offer text search as the focusable
            next step so the screen is never a focus dead end. */}
        <EmptyState
          icon={{ ios: "tv", android: "tv", web: "tv" }}
          title={t("common.tvUnavailableTitle")}
          description={tTv(t, "common.tvUnavailableBody", "quran.detector.tvUnavailableBody")}
          actionLabel={t("quran.searchTitle")}
          onAction={() => router.push("/quran/search" as Href)}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout {...layoutProps} maxContentWidth={twoPane ? 1320 : undefined}>
      <Seo path={seoPath} />
      <ReadingTypographyProvider surface="quran">
        {fromLibrary ? <DetectorModes twoPane={twoPane} /> : <SearchEntry />}
      </ReadingTypographyProvider>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  centerText: { textAlign: "center" },
  modeRow: { marginBottom: Spacing.three },
  modeRowWide: { maxWidth: 440 },
  fieldGroup: { gap: Spacing.two, marginBottom: Spacing.three },
  controlsWide: { flexDirection: "row", alignItems: "flex-end", gap: Spacing.three },
  fieldGroupWide: { width: 280, marginBottom: 0 },
  inputWrapWide: { flex: 1, minWidth: 0 },
  hint: { marginTop: Spacing.two },
  searchingSkeleton: { marginTop: Spacing.three },
  // No `gap` here — ResponsiveGrid owns the gutters (a column gap would wrap cells).
  resultsGrid: { marginTop: Spacing.three },
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  composerPane: {
    width: 440,
    maxWidth: "44%",
  },
  resultsPane: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  examplesBlock: { gap: Spacing.two },
  examplesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
  },
  noResults: { gap: Spacing.three, marginTop: Spacing.three },
  resultsListGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  resultsCell: {
    flexBasis: "45%",
    flexGrow: 1,
    minWidth: 0,
  },
  composer: { gap: Spacing.three },
  detectorTrailing: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  listeningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  resultsCard: { gap: Spacing.three },
  resultsList: { gap: Spacing.three, marginTop: Spacing.two },
  otherBlock: { gap: Spacing.one },
  resultCard: {
    flexGrow: 1,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    overflow: "hidden",
  },
  resultCardFeatured: {
    borderWidth: BorderWidth.thick,
  },
  resultBody: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  resultBodyTv: { minHeight: TvLayout.minFocusTarget },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  resultTitleBlock: { flex: 1, gap: Spacing.half, minWidth: 0 },
  resultBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.one,
    maxWidth: "52%",
  },
  arabicLine: {
    marginTop: Spacing.half,
  },
  openCue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  resultActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  textAction: {
    minHeight: Control.minTouch,
    justifyContent: "center",
    paddingHorizontal: Spacing.half,
  },
});
