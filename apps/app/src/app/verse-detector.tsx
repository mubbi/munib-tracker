import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, TextInput, type TextStyle, View } from "react-native";
import { JannahCallout } from "@/components/jannah/primitives";
import {
  ReadingTypographyBar,
  ReadingTypographyProvider,
  useReadingTypography,
} from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import i18n from "@/i18n";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  detectQuranVerses,
  segmentHighlightedText,
  type VerseDetectionHit,
  type VerseDetectorLang,
} from "@/lib/quran-verse-detector";
import { arabicReadingLayout, resolveArabicFontFamily } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import { clearAyahIndex } from "@/lib/search";
import { buildAyahSharePayload } from "@/lib/share";
import { abortStt, type SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

const DEBOUNCE_MS = 350;
const MIN_DETECT_LENGTH = 3;
const MAX_RESULTS = 8;

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

  if (!hasMatch) {
    return (
      <Text
        style={[flatStyle, arabicFamily ? { fontFamily: arabicFamily } : null]}
        numberOfLines={numberOfLines}
      >
        {text}
      </Text>
    );
  }

  return (
    <Text
      style={[flatStyle, arabicFamily ? { fontFamily: arabicFamily } : null]}
      numberOfLines={numberOfLines}
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

function VerseResultCard({
  hit,
  featured,
  expanded,
  onToggleExpanded,
  onOpen,
  onShare,
  isSharing,
  isGesturePending,
}: {
  hit: VerseDetectionHit;
  featured: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpen: () => void;
  onShare: () => void;
  isSharing: boolean;
  isGesturePending: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const chevronForward = useChevronForward();
  const percent = confidencePercent(hit.confidence);

  return (
    <View
      style={[
        styles.resultCard,
        {
          backgroundColor: featured ? tokens.accentSoft : colors.muted,
          borderColor: featured ? colors.accent : "transparent",
        },
        featured && styles.resultCardFeatured,
      ]}
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultTitleBlock}>
          {featured ? (
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {t("quran.detector.bestMatch")}
            </ThemedText>
          ) : null}
          {hit.popularName ? (
            <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accent }}>
              {hit.popularName}
            </ThemedText>
          ) : null}
          <ThemedText type={hit.popularName ? "caption" : "smallBold"} numberOfLines={1}>
            {hit.surahName}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {hit.surahNameEnglish}
          </ThemedText>
        </View>
        <View style={styles.resultBadges}>
          <Pill
            label={t("quran.ayahRef", { surah: hit.surah, ayah: hit.ayah })}
            color={colors.accent}
            background={featured ? colors.card : tokens.accentSoft}
            compact
          />
          <Pill
            label={t("quran.detector.confidence", { percent: `${percent}%` })}
            color={tokens.status.success.color}
            background={tokens.status.success.soft}
            compact
          />
        </View>
      </View>

      {hit.arabic ? (
        <HighlightedText
          arabic
          text={hit.arabic}
          query={hit.query}
          numberOfLines={expanded ? undefined : featured ? 4 : 2}
          style={[
            arabicReadingLayout(sizes.arabic),
            {
              lineHeight: sizes.arabic * 1.75,
              color: colors.foreground,
            },
            styles.arabicLine,
          ]}
        />
      ) : null}

      <HighlightedText
        text={hit.translation}
        query={hit.query}
        numberOfLines={expanded ? undefined : featured ? 4 : 2}
        style={{
          fontSize: sizes.translation,
          lineHeight: sizes.translation * 1.45,
          color: colors.mutedForeground,
        }}
      />

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

      <View style={styles.resultActions}>
        <Button
          label={t("quran.detector.openInQuran")}
          variant={featured ? "primary" : "secondary"}
          size="sm"
          fullWidth
          trailingIcon={chevronForward}
          onPress={onOpen}
        />
        <View style={styles.resultSecondaryActions}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={
              expanded ? t("quran.detector.showLess") : t("quran.detector.readFull")
            }
            onPress={onToggleExpanded}
            style={styles.textAction}
          >
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
              {expanded ? t("quran.detector.showLess") : t("quran.detector.readFull")}
            </ThemedText>
          </PressableScale>
          <IconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            size={18}
            tintColor={colors.mutedForeground}
            haptic="light"
            loading={isSharing}
            accessibilityLabel={isGesturePending ? t("share.tapToShare") : t("quran.shareAyah")}
            onPress={onShare}
          />
        </View>
      </View>
    </View>
  );
}

function DetectorBody() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const { colors } = useThemeTokens();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();

  const [lang, setLang] = useState<VerseDetectorLang>("en");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pending, setPending] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [results, setResults] = useState<VerseDetectionHit[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasListeningRef = useRef(false);

  const handleSttError = useCallback(
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

  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: setQuery,
    onError: handleSttError,
  });

  useEffect(() => () => abortStt(), []);
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
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, debounced]);

  useEffect(() => {
    if (stt.listening) {
      wasListeningRef.current = true;
      return;
    }
    if (wasListeningRef.current && query.trim().length >= MIN_DETECT_LENGTH) {
      setDebounced(query.trim());
    }
    wasListeningRef.current = false;
  }, [stt.listening, query]);

  useEffect(() => {
    if (debounced.length < MIN_DETECT_LENGTH) {
      setResults([]);
      setDetecting(false);
      return;
    }

    setDetecting(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      void detectQuranVerses(debounced, { lang, limit: MAX_RESULTS }).then((hits) => {
        if (cancelled) return;
        setResults(hits);
        setDetecting(false);
        setExpandedKey(hits[0] ? `${hits[0].surah}:${hits[0].ayah}` : null);
      });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, lang]);

  const busy = pending || detecting;
  const showEmpty = !busy && debounced.length >= MIN_DETECT_LENGTH && results.length === 0;
  const hasInput = query.trim().length > 0;
  const topHit = results[0];
  const otherHits = results.slice(1);

  const examples = useMemo(
    () => [
      { id: "kursi", label: t("quran.detector.exampleKursi") },
      { id: "fatiha", label: t("quran.detector.exampleFatiha") },
      { id: "ikhlas", label: t("quran.detector.exampleIkhlas") },
    ],
    [t],
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
    [stt],
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

  const openHit = useCallback(
    (hit: VerseDetectionHit) => {
      router.push({
        pathname: "/quran/[surah]",
        params: { surah: String(hit.surah), ayah: String(hit.ayah) },
      });
    },
    [router],
  );

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

  return (
    <>
      {SnapshotHost}
      <Stagger>
        <Card
          padding="four"
          style={[
            styles.composer,
            {
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.fieldGroup}>
            <ThemedText type="smallBold">{t("quran.detector.languageLabel")}</ThemedText>
            <SegmentedControl options={langOptions} value={lang} onChange={setLang} />
          </View>

          <View
            style={[
              styles.textField,
              {
                backgroundColor: colors.background,
                borderColor: stt.listening ? colors.accent : colors.border,
                borderWidth: stt.listening ? 1.5 : 1,
              },
            ]}
          >
            <TextInput
              value={query}
              onChangeText={setQueryFromInput}
              placeholder={t("quran.detector.textPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("quran.detector.textPlaceholder")}
              multiline
              textAlignVertical="top"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.foreground,
                  textAlign: lang === "ar" ? "right" : "left",
                  writingDirection: lang === "ar" ? "rtl" : "ltr",
                },
              ]}
            />
            <View style={styles.textFieldFooter}>
              {stt.listening ? (
                <View style={styles.listeningBadge}>
                  <SymbolView
                    name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
                    size={14}
                    tintColor={colors.accent}
                  />
                  <ThemedText type="caption" style={{ color: colors.accent }}>
                    {t("quran.detector.listening")}
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.footerSpacer} />
              )}
              <View style={styles.textFieldActions}>
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
            </View>
          </View>

          {!hasInput && !stt.listening ? (
            <JannahCallout tone="info">{t("quran.detector.detectHint")}</JannahCallout>
          ) : null}

          {busy ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={colors.accent} />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quran.detector.detecting")}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.examplesBlock}>
            <ThemedText type="smallBold">{t("quran.detector.examples")}</ThemedText>
            <TvScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.examplesRow}
            >
              {examples.map((example) => (
                <PressableScale
                  key={example.id}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={example.label}
                  onPress={() => applyExample(example.id)}
                  style={[
                    styles.exampleChip,
                    {
                      backgroundColor: colors.muted,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText type="caption" style={{ color: colors.foreground }}>
                    {example.label}
                  </ThemedText>
                </PressableScale>
              ))}
            </TvScrollView>
          </View>
        </Card>

        {showEmpty ? (
          <EmptyState
            icon={{
              ios: "text.magnifyingglass",
              android: "manage_search",
              web: "manage_search",
            }}
            title={t("quran.detector.noResults")}
            description={t("quran.detector.noResultsHint")}
          />
        ) : null}

        {!busy && topHit ? (
          <Card
            padding="three"
            style={[
              styles.resultsCard,
              {
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <ReadingTypographyBar surface="quran" />
            <VerseResultCard
              hit={topHit}
              featured
              expanded={expandedKey === `${topHit.surah}:${topHit.ayah}`}
              onToggleExpanded={() =>
                setExpandedKey((current) => {
                  const key = `${topHit.surah}:${topHit.ayah}`;
                  return current === key ? null : key;
                })
              }
              onOpen={() => openHit(topHit)}
              onShare={() => shareHit(topHit)}
              isSharing={isSharing(`${topHit.surah}:${topHit.ayah}`)}
              isGesturePending={isGesturePending(`${topHit.surah}:${topHit.ayah}`)}
            />

            {otherHits.length > 0 ? (
              <View style={styles.otherBlock}>
                <SectionHeader title={t("quran.detector.otherMatches")} />
                <View style={styles.resultsList}>
                  {otherHits.map((hit) => {
                    const key = `${hit.surah}:${hit.ayah}`;
                    return (
                      <VerseResultCard
                        key={key}
                        hit={hit}
                        featured={false}
                        expanded={expandedKey === key}
                        onToggleExpanded={() =>
                          setExpandedKey((current) => (current === key ? null : key))
                        }
                        onOpen={() => openHit(hit)}
                        onShare={() => shareHit(hit)}
                        isSharing={isSharing(key)}
                        isGesturePending={isGesturePending(key)}
                      />
                    );
                  })}
                </View>
              </View>
            ) : null}
          </Card>
        ) : null}
      </Stagger>
    </>
  );
}

export default function QuranVerseDetectorScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  if (isTV()) {
    return (
      <ScreenLayout
        eyebrow={t("library.eyebrow")}
        title={t("quran.detector.title")}
        subtitle={t("quran.detector.subtitle")}
        onBack={() => goBackOrReplace(router, "/library")}
      >
        <Seo path="/verse-detector" />
        <EmptyState
          icon={{ ios: "tv", android: "tv", web: "tv" }}
          title={t("common.tvUnavailableTitle")}
          description={t("common.tvUnavailableBody")}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("library.eyebrow")}
      title={t("quran.detector.title")}
      subtitle={t("quran.detector.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
    >
      <Seo path="/verse-detector" />
      <ReadingTypographyProvider surface="quran">
        <DetectorBody />
      </ReadingTypographyProvider>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  composer: { gap: Spacing.three },
  fieldGroup: { gap: Spacing.two },
  textField: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    padding: Spacing.three,
    gap: Spacing.two,
  },
  textInput: {
    minHeight: 88,
    maxHeight: 160,
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  textFieldFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    minHeight: 36,
  },
  footerSpacer: { flex: 1 },
  listeningBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  textFieldActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    flexShrink: 0,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  examplesBlock: { gap: Spacing.two },
  examplesRow: { gap: Spacing.two, paddingEnd: Spacing.two },
  exampleChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  resultsCard: { gap: Spacing.three },
  resultsList: { gap: Spacing.three, marginTop: Spacing.two },
  otherBlock: { gap: Spacing.one },
  resultCard: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  resultCardFeatured: {
    borderWidth: 1.5,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  resultTitleBlock: { flex: 1, gap: Spacing.half },
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
  resultActions: {
    gap: Spacing.two,
  },
  resultSecondaryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  textAction: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.half,
  },
});
