import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Radius, Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import i18n from "@/i18n";
import { goBackOrReplace } from "@/lib/navigation";
import {
  detectQuranVerses,
  type VerseDetectionHit,
  type VerseDetectorLang,
} from "@/lib/quran-verse-detector";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { runWhenIdle } from "@/lib/run-when-idle";
import { clearAyahIndex } from "@/lib/search";
import { buildAyahSharePayload } from "@/lib/share";
import { abortStt, type SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";

const MAX_RESULTS = 40;
const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;

/** Qur'an ayah search with verse-detector matching, EN/AR scope, and voice fill. */
export default function QuranSearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const { colors, tokens } = useThemeTokens();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();

  const [lang, setLang] = useState<VerseDetectorLang>("en");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pending, setPending] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<VerseDetectionHit[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  // Reclaim the multi-MB ayah Fuse heap when leaving this screen.
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

  // Verse-detector pipeline: aliases, surah:ayah refs, substring, and fuzzy Fuse
  // over Arabic + translation + transliteration. Deferred off the interaction thread.
  useEffect(() => {
    if (debounced.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      void detectQuranVerses(debounced, { lang, limit: MAX_RESULTS }).then((hits) => {
        if (cancelled) return;
        setResults(hits);
        setSearching(false);
      });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, lang]);

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

  const langOptions = useMemo(
    () => [
      { id: "en" as const, label: t("quran.detector.langEnglish") },
      { id: "ar" as const, label: t("quran.detector.langArabic") },
    ],
    [t],
  );

  const placeholder =
    lang === "ar" ? t("quran.searchPlaceholderArabic") : t("quran.searchPlaceholder");

  const busy = pending || searching;
  const showEmpty = !busy && debounced.length >= MIN_QUERY_LENGTH && results.length === 0;
  const hasInput = query.trim().length > 0;
  const micPad = stt.available ? Spacing.three + 40 : Spacing.three;

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.searchTitle")}
      subtitle={t("quran.searchSubtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/quran/search" />
      <Card padding="three">
        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold">{t("quran.detector.languageLabel")}</ThemedText>
          <SegmentedControl options={langOptions} value={lang} onChange={onLangChange} />
        </View>

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: colors.muted,
              borderWidth: stt.listening ? 1.5 : 0,
              borderColor: stt.listening ? colors.accent : "transparent",
            },
          ]}
        >
          <TextInput
            value={query}
            onChangeText={setQueryFromInput}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={placeholder}
            autoFocus
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: colors.foreground,
                paddingEnd: hasInput ? micPad + 28 : micPad,
                textAlign: lang === "ar" ? "right" : "left",
                writingDirection: lang === "ar" ? "rtl" : "ltr",
              },
            ]}
          />
          <View style={styles.inputActions}>
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

        {busy ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.searching")}
            </ThemedText>
          </View>
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {results.length > 0
              ? t("quran.resultsCount", { count: results.length })
              : stt.listening
                ? t("quran.detector.listening")
                : t("quran.searchHint")}
          </ThemedText>
        )}

        {showEmpty ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("quran.noResults")}
          />
        ) : !busy ? (
          <View style={styles.list}>
            {results.map((hit) => (
              <View
                key={`${hit.surah}:${hit.ayah}`}
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={styles.rowHeader}>
                  <PressableScale
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={`${hit.surahName} ${hit.ayah}`}
                    onPress={() =>
                      router.push({
                        pathname: "/quran/[surah]",
                        params: { surah: String(hit.surah), ayah: String(hit.ayah) },
                      })
                    }
                    style={styles.rowHeaderContent}
                  >
                    <ThemedText type="smallBold" numberOfLines={1} style={styles.rowName}>
                      {hit.popularName ?? hit.surahName}
                    </ThemedText>
                    <Pill
                      label={t("quran.ayahRef", { surah: hit.surah, ayah: hit.ayah })}
                      color={colors.accent}
                      background={tokens.accentSoft}
                    />
                  </PressableScale>
                  <IconButton
                    name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                    size={18}
                    tintColor={colors.mutedForeground}
                    haptic="light"
                    loading={isSharing(`${hit.surah}:${hit.ayah}`)}
                    accessibilityLabel={
                      isGesturePending(`${hit.surah}:${hit.ayah}`)
                        ? t("share.tapToShare")
                        : t("quran.shareAyah")
                    }
                    onPress={() => shareAyah(hit)}
                  />
                </View>
                {hit.arabic ? (
                  <ThemedText type="arabic" numberOfLines={2} style={compactArabicTextStyle()}>
                    {hit.arabic}
                  </ThemedText>
                ) : null}
                <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
                  {hit.translation}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { gap: Spacing.two, marginBottom: Spacing.three },
  inputWrap: {
    position: "relative",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  inputActions: {
    position: "absolute",
    end: Spacing.one,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
  hint: { marginTop: Spacing.two },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  rowHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowName: { flexShrink: 1 },
});
