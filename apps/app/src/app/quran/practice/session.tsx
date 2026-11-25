import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  Platform,
  type ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { type AyahChipState, PracticeAyahChips } from "@/components/quran/practice-ayah-chips";
import { PracticeAyahResult } from "@/components/quran/practice-ayah-result";
import { PracticeDock } from "@/components/quran/practice-dock";
import { PracticePageView } from "@/components/quran/practice-page-view";
import { PracticePassagePicker } from "@/components/quran/practice-passage-picker";
import { PracticeToolbar } from "@/components/quran/practice-toolbar";
import { PracticeWordRow } from "@/components/quran/practice-word-row";
import { PronunciationCheckSession } from "@/components/quran/pronunciation-check-session";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { UnavailableOnDevice } from "@/components/ui/unavailable-on-device";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset, useObstructedBottomInset } from "@/hooks/use-content-bottom-inset";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { usePracticeSession } from "@/hooks/use-practice-session";
import { useSurahTajweed } from "@/hooks/use-quran";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { buildPracticeActivity } from "@/lib/continue-activity";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { isSessionMode, parsePassage } from "@/lib/quran-companion/passage";
import { tryAgainIndexes, visibleWordStates } from "@/lib/quran-companion/reduce-session";
import { practiceSessionKeyAction } from "@/lib/quran-companion/session-keys";
import { studyWordTajweedRuns } from "@/lib/quran-companion/tajweed-word-runs";
import type { Passage, SessionMode } from "@/lib/quran-companion/types";
import { getPageForAyah, getSurahByNumber } from "@/lib/quran-meta";
import { PRONUNCIATION_MODE } from "@/lib/quran-pronunciation/entry";
import {
  resolveArabicFontFamily,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { recordContinueActivity } from "@/stores/continue-store";
import { usePreferences } from "@/stores/preferences-store";
import {
  useCompanionPrefs,
  useCompanionPrefsReady,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { useEnsureListenerLoaded } from "@/stores/quran-listener-store";
import { useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";
import {
  quranPracticeStore,
  useEnsurePracticeLoaded,
  useRevisionSitting,
} from "@/stores/quran-practice-store";

/**
 * Live practice session (§9.2). The ayah is the screen: one ayah at a time, the
 * reader's font size, a fixed dock above the content inset. Invalid params land
 * on the hub — never a crash or an empty session.
 */
export default function PracticeSessionRoute() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    surah?: string;
    from?: string;
    to?: string;
    mode?: string;
    source?: string;
    /** D74: the Sunnah habit a recite-along take came from (`source=habit`). */
    habit?: string;
  }>();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  useEnsurePracticeLoaded();
  const prefsReady = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  useEnsureListenerLoaded(prefs.engineChoice, prefsReady);

  const passage = useMemo(
    () => parsePassage({ surah: params.surah, from: params.from, to: params.to }),
    [params.from, params.surah, params.to],
  );
  const mode: SessionMode = isSessionMode(params.mode) ? params.mode : prefs.defaultMode;

  useEffect(() => {
    if (!isPracticeAvailable()) router.replace("/quran");
    else if (!passage) router.replace("/quran/practice" as Href);
  }, [passage, router]);

  // Home "Continue" resumes practice (D68): recorded when a session starts here;
  // `onEnd` records it again when the session finishes.
  const continueMode = params.mode === PRONUNCIATION_MODE ? PRONUNCIATION_MODE : mode;
  useEffect(() => {
    if (!passage || !prefsReady || !isPracticeAvailable()) return;
    recordContinueActivity(buildPracticeActivity(passage, continueMode));
  }, [continueMode, passage, prefsReady]);

  // Never a blank route (P8-01): TV gets the one-action "not on this device"
  // state while it redirects; a cold open shows the chrome over a skeleton.
  if (!isPracticeAvailable()) {
    return (
      <ScreenLayout
        eyebrow={t("quranCompanion.hub.title")}
        title={t("quranCompanion.hub.title")}
        onBack={() => goBackOrReplace(router, "/quran")}
      >
        <UnavailableOnDevice fallbackHref="/quran" />
      </ScreenLayout>
    );
  }
  if (!passage || !prefsReady) {
    return (
      <ScreenLayout
        eyebrow={t("quran.eyebrow")}
        title={t("quranCompanion.hub.title")}
        onBack={() => goBackOrReplace(router, "/quran/practice")}
      >
        <SkeletonPlaceholder preset="card" />
      </ScreenLayout>
    );
  }
  // NF-3.24 "Check pronunciation" — its own flow, not a memorisation session.
  if (params.mode === PRONUNCIATION_MODE) {
    return (
      <PronunciationCheckSession
        key={`${passage.surah}:${passage.ayahStart}-${passage.ayahEnd}:pronunciation`}
        passage={passage}
        source={params.source ?? "hub"}
        habitId={params.habit}
      />
    );
  }
  // Keyed by passage + mode so changing the passage always starts a fresh session.
  return (
    <PracticeSessionScreen
      key={`${passage.surah}:${passage.ayahStart}-${passage.ayahEnd}:${mode}`}
      passage={passage}
      mode={mode}
      source={params.source ?? "hub"}
      habitId={params.habit}
    />
  );
}

function PracticeSessionScreen({
  passage,
  mode,
  source,
  habitId,
}: {
  passage: Passage;
  mode: SessionMode;
  source: string;
  /** D74: carried to the summary so it can offer "Mark habit done". */
  habitId?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  // Everything covering the bottom edge: mini-player (when audio plays) or the home indicator.
  const obstructedBottom = useObstructedBottomInset();
  const { height } = useWindowDimensions();
  const contentBottom = useContentBottomInset();
  const { fontPrefs, translationLocale, locale } = usePreferences();
  const prefs = useCompanionPrefs();
  // Translation / transliteration are the app-wide pair (D13), shared with the reader.
  const { showTranslation, showTransliteration } = useReadingDisplay();
  const surahMeta = getSurahByNumber(passage.surah);
  const surahName = surahMeta?.nameTransliteration ?? String(passage.surah);
  const sizes = resolveReadingFontSizes("quran", fontPrefs);
  const arabicFamily = resolveArabicFontFamily(fontPrefs.arabic.family);

  const s = usePracticeSession({
    passage,
    mode,
    language: translationLocale || locale || "en",
    surahName,
  });

  const tajweedQuery = useSurahTajweed(passage.surah, prefs.showTajweedColors);
  const ayahState = s.session.ayahs[s.ayah];
  // Tajweed colours go on the interactive word row itself (one copy of the ayah).
  const rowWords = ayahState?.words ?? s.row?.words;
  const tajweedSegments = tajweedQuery.data?.[String(s.ayah)];
  const tajweedRuns = useMemo(
    () =>
      prefs.showTajweedColors && tajweedSegments && rowWords
        ? studyWordTajweedRuns(tajweedSegments, rowWords)
        : null,
    [prefs.showTajweedColors, rowWords, tajweedSegments],
  );
  const takeActive = s.mic === "listening" || s.mic === "starting" || s.mic === "settling";
  const settled = s.settledAyahs.has(s.ayah);
  const states = ayahState ? visibleWordStates(ayahState, prefs.feedbackTiming, !settled) : [];
  const listenOnly = s.engineStatus === "listen-only" || s.engineStatus === "failed";
  const preparing = s.engineStatus === "loading";
  const pageView = prefs.practiceView !== "ayah";
  const compactDock = height < 420;
  const hideMode = s.displayMode === "hide-words" || s.displayMode === "hide-ayahs";
  const [ending, setEnding] = useState(false);
  const sitting = useRevisionSitting();
  const inSitting = mode === "revision" && sitting != null && sitting.items.length > 1;

  // Skip: next ayah in the sitting without a lapse and without a summary (§9.4).
  const onSkip = () => {
    const nextItem = quranPracticeStore.getState().advanceSitting();
    if (!nextItem) {
      quranPracticeStore.getState().startSitting(null);
      router.replace("/quran/revision" as Href);
      return;
    }
    router.replace({
      pathname: "/quran/practice/session",
      params: {
        surah: String(nextItem.surah),
        from: String(nextItem.ayah),
        to: String(nextItem.ayah),
        mode: "revision",
        source: "revision",
      },
    });
  };

  // Announce a confirmed "try again" after the ayah, never while the mic is live.
  useEffect(() => {
    if (!settled || takeActive || !s.tryAgain.length || prefs.feedbackTiming === "end") return;
    AccessibilityInfo.announceForAccessibility(
      t("quranCompanion.session.tryAgainLine", { count: s.tryAgain.length }),
    );
  }, [prefs.feedbackTiming, s.tryAgain.length, settled, t, takeActive]);

  const onEnd = async () => {
    if (ending) return;
    setEnding(true);
    try {
      const summary = await s.finish();
      quranPracticeStore.getState().setLastSummary(summary);
      recordContinueActivity(buildPracticeActivity(passage, mode));
      router.replace({
        pathname: "/quran/practice/summary",
        params: { source, ...(habitId ? { habit: habitId } : {}) },
      } as unknown as Href);
    } finally {
      setEnding(false);
    }
  };

  const onBack = () => {
    goBackOrReplace(router, source === "reader" ? `/quran/${passage.surah}` : "/quran/practice");
  };

  const errorCaption =
    s.engineError != null
      ? s.engineStatus === "failed"
        ? t("quranCompanion.session.listenerDidNotStart")
        : t("quranCompanion.session.listeningStopped")
      : null;

  // §9.2: in a long ayah, scroll only when the active word leaves the visible
  // band between the header and the dock — never with reduced motion on.
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollY = useRef(0);
  const reduceMotion = useHydrationSafeReducedMotion();
  const keepActiveWordVisible = useCallback(
    ({ y, height: wordHeight }: { y: number; height: number }) => {
      if (reduceMotion) return;
      const top = VISIBLE_TOP;
      const bottom = height - obstructedBottom - DOCK_RESERVED_HEIGHT;
      if (bottom - top < wordHeight * 2) return;
      if (y >= top && y + wordHeight <= bottom) return;
      const target = scrollY.current + y - (top + (bottom - top) * 0.3);
      scrollRef.current?.scrollTo({ y: Math.max(0, target), animated: true });
    },
    [height, obstructedBottom, reduceMotion],
  );

  const micDenied = s.micPermission === "denied";
  const [pickerOpen, setPickerOpen] = useState(false);
  // Dock "Reveal all" / "End" are hard to undo — confirm first.
  // Kind outlives `open` so the copy doesn't swap while the sheet animates out.
  const [confirmKind, setConfirmKind] = useState<"revealAll" | "end">("end");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const askConfirm = (kind: "revealAll" | "end") => {
    setConfirmKind(kind);
    setConfirmOpen(true);
  };
  const isEndConfirm = confirmKind === "end";

  const chipState = (ayah: number): AyahChipState => {
    if (ayah === s.ayah) return "current";
    if (!s.settledAyahs.has(ayah)) return "todo";
    const a = s.session.ayahs[ayah];
    return a && tryAgainIndexes(a).length ? "retry" : "done";
  };

  // Change passage: a fresh session on the new range, same mode. Never mid-take.
  const changePassage = (next: Passage) => {
    setPickerOpen(false);
    router.replace({
      pathname: "/quran/practice/session",
      params: {
        surah: String(next.surah),
        from: String(next.ayahStart),
        to: String(next.ayahEnd),
        mode,
        source,
      },
    });
  };
  const showCoach = !prefs.coachDismissed && !listenOnly && s.mic === "idle";

  // Desktop web: Space = mic (Hear when listen-only), ← / → = previous / next ayah.
  const uiRtl = useIsRTL();
  useWebScreenKeyHandler(
    (event) => {
      const action = practiceSessionKeyAction(event.key, {
        rtl: uiRtl,
        interactiveTarget: isWebInteractiveTarget(event.target),
        canNavigate: s.ayahs.length > 1 && !takeActive,
        shiftKey: event.shiftKey,
      });
      if (action === "primary") {
        if (listenOnly) void s.hear();
        else if (!preparing && s.engineError == null) void s.toggleMic();
        return true;
      }
      if (action === "next") {
        if (s.index < s.ayahs.length - 1) s.next();
        return true;
      }
      if (action === "previous") {
        if (s.index > 0) s.previous();
        return true;
      }
      return undefined;
    },
    Platform.OS === "web" && !pickerOpen && !confirmOpen,
  );

  return (
    <View style={styles.root}>
      <ScreenLayout
        eyebrow={
          mode === "revision"
            ? t("quranCompanion.session.revisionEyebrow")
            : t(MODE_LABEL_KEY[s.displayMode])
        }
        title={t("quranCompanion.passage.single", { surah: surahName, ayah: s.ayah })}
        subtitle={
          inSitting && sitting
            ? [
                t("quranCompanion.revision.sittingProgress", {
                  n: sitting.index + 1,
                  total: sitting.items.length,
                }),
                sitting.remaining > 0
                  ? t("quranCompanion.hub.reviseRemaining", { count: sitting.remaining })
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : s.ayahs.length > 1
              ? t("quranCompanion.session.ayahOf", { n: s.index + 1, total: s.ayahs.length })
              : undefined
        }
        onBack={onBack}
        headerAccessory={
          <PracticeToolbar
            mode={s.displayMode}
            locked={takeActive}
            showModeChip={mode !== "revision"}
            onChangeMode={(next) => router.setParams({ mode: next })}
            onOpenSettings={() =>
              router.push({ pathname: "/settings/quran-practice", params: { from: "hub" } })
            }
          />
        }
        // Focused reading view: keep the Arabic word row at a readable measure.
        maxContentWidth={SESSION_MAX_WIDTH}
        scrollRef={scrollRef}
        onScroll={(e) => {
          scrollY.current = e.nativeEvent.contentOffset.y;
        }}
        contentStyle={{ paddingBottom: contentBottom + DOCK_RESERVED_HEIGHT }}
      >
        <Seo path="/quran/practice/session" />
        {s.ayahs.length > 1 ? (
          <PracticeAyahChips
            ayahs={s.ayahs}
            stateOf={chipState}
            disabled={takeActive}
            onSelect={s.goTo}
          />
        ) : null}
        <Card
          padding="four"
          style={
            s.mic === "listening" && !listenOnly
              ? { borderColor: tokens.status.danger.border, borderWidth: BorderWidth.thick }
              : undefined
          }
        >
          <View style={styles.cardHead}>
            <View style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {s.ayah}
              </ThemedText>
            </View>
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              style={styles.flexText}
              numberOfLines={1}
            >
              {preparing ? `${surahName} · ${t("quranCompanion.session.preparing")}` : surahName}
            </ThemedText>
            {mode !== "revision" ? (
              <Button
                label={t("quranCompanion.session.changePassage")}
                variant="ghost"
                size="sm"
                icon={{ ios: "book", android: "menu_book", web: "menu_book" }}
                disabled={takeActive}
                onPress={() => setPickerOpen(true)}
              />
            ) : null}
          </View>
          {pageView ? (
            <PracticePageView
              view={prefs.practiceView === "mushaf" ? "mushaf" : "page"}
              page={getPageForAyah(passage.surah, s.ayah)}
              surah={passage.surah}
              passageAyahs={s.ayahs}
              currentAyah={s.ayah}
              wordsOf={(a) => s.session.ayahs[a]?.words ?? s.rows[a]?.words ?? null}
              statesOf={(a) => {
                const st = s.session.ayahs[a];
                return st
                  ? visibleWordStates(st, prefs.feedbackTiming, !s.settledAyahs.has(a))
                  : [];
              }}
              hiddenOf={s.hiddenOf}
              activeWord={takeActive ? (ayahState?.activeIndex ?? null) : null}
              surahWordCounts={s.surahWordCounts}
              arabicSize={sizes.arabic}
              arabicFontFamily={arabicFamily}
              onAyahPress={(a) => {
                if (takeActive) return;
                const i = s.ayahs.indexOf(a);
                if (i >= 0) s.goTo(i);
              }}
            />
          ) : null}
          {pageView ? null : s.row ? (
            <PracticeWordRow
              words={ayahState?.words ?? s.row.words}
              states={states}
              hidden={s.hidden}
              activeIndex={takeActive ? (ayahState?.activeIndex ?? null) : null}
              hearIndex={s.hearWordIndex}
              fontSize={sizes.arabic}
              fontFamily={arabicFamily}
              markStyle={prefs.showTajweedColors ? "dot" : "underline"}
              tajweedRuns={tajweedRuns}
              onWordPress={(i) => void s.hearWord(i)}
              onActiveWordMeasured={keepActiveWordVisible}
            />
          ) : (
            <View
              style={[
                styles.placeholder,
                // Arabic lines start at the physical right whatever the UI direction (G-21).
                { minHeight: sizes.arabic * 2, alignItems: uiRtl ? "flex-start" : "flex-end" },
              ]}
              accessible
              accessibilityLabel={t("quranCompanion.session.loading")}
            >
              {[0.9, 0.6].map((w) => (
                <View
                  key={w}
                  style={[
                    styles.placeholderLine,
                    {
                      width: `${w * 100}%`,
                      height: sizes.arabic,
                      backgroundColor: tokens.hairline,
                    },
                  ]}
                />
              ))}
            </View>
          )}
          {showTransliteration && s.row?.transliteration && !s.hidden.size ? (
            <ThemedText
              type="small"
              themeColor="mutedForeground"
              style={[styles.text, { fontSize: sizes.transliteration }]}
            >
              {s.row.transliteration}
            </ThemedText>
          ) : null}
          {showTranslation &&
          s.row?.translation &&
          !(s.displayMode === "hide-ayahs" && s.hidden.size) ? (
            <ThemedText style={[styles.text, translationReadingStyle(locale, sizes.translation)]}>
              {s.row.translation}
            </ThemedText>
          ) : null}
        </Card>

        {s.mic === "listening" && !listenOnly ? (
          <View style={[styles.listeningHint, { borderColor: tokens.status.danger.border }]}>
            <View style={[styles.liveDot, { backgroundColor: tokens.status.danger.color }]} />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.flexText}>
              {t("quranCompanion.session.listeningHint")}
            </ThemedText>
          </View>
        ) : null}

        {settled && ayahState && ayahState.takes > 0 && !listenOnly && !takeActive ? (
          <PracticeAyahResult
            ayah={ayahState}
            timing={prefs.feedbackTiming}
            isLast={s.index >= s.ayahs.length - 1}
            canFinish={!ending}
            onNext={s.next}
            onRetry={() => {
              s.retry();
              void s.toggleMic();
            }}
            onHear={() => void s.hear()}
            onHearWord={(i) => void s.hearWord(i)}
            onFinish={() => void onEnd()}
          />
        ) : null}

        {/* Failures are callouts, never grey captions that read like hints (G-05). */}
        {errorCaption ? (
          <Callout tone="danger" style={styles.callout}>
            {errorCaption}
          </Callout>
        ) : null}

        {micDenied ? (
          <Callout
            tone="warning"
            style={styles.callout}
            action={
              canOpenAppSettings()
                ? {
                    label: t("quranCompanion.session.openSettings"),
                    onPress: () => void openAppSettings(),
                  }
                : undefined
            }
          >
            {t("quranCompanion.session.micOff")}
          </Callout>
        ) : null}

        {listenOnly && !errorCaption ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
            {hideMode
              ? t("quranCompanion.session.listenOnlyHide")
              : t("quranCompanion.session.listenOnly")}
          </ThemedText>
        ) : null}

        {s.ayahs.length > 1 ? (
          <View style={styles.inlineButtons}>
            <Button
              label={t("quranCompanion.session.previous")}
              variant="ghost"
              size="sm"
              disabled={s.index === 0 || takeActive}
              onPress={s.previous}
            />
            <Button
              label={t("quranCompanion.session.next")}
              variant="secondary"
              size="sm"
              disabled={s.index >= s.ayahs.length - 1 || takeActive}
              onPress={s.next}
            />
          </View>
        ) : null}

        {inSitting ? (
          <View style={styles.inlineButtons}>
            <Button
              label={t("quranCompanion.revision.skip")}
              variant="ghost"
              size="sm"
              disabled={takeActive}
              onPress={onSkip}
            />
          </View>
        ) : null}

        {showCoach ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
            {t("quranCompanion.session.coach")}
          </ThemedText>
        ) : null}
      </ScreenLayout>

      <PracticePassagePicker
        visible={pickerOpen}
        initial={passage}
        onClose={() => setPickerOpen(false)}
        onSelect={changePassage}
      />
      <View
        style={[
          styles.dockWrap,
          {
            bottom: Math.max(obstructedBottom, Spacing.two) + Spacing.two,
            pointerEvents: "box-none",
          },
        ]}
      >
        <PracticeDock
          showMic={!listenOnly}
          preparing={preparing}
          mic={s.mic}
          micDisabled={s.engineError != null || preparing}
          isHearing={s.isHearing}
          showReveal={hideMode && s.hidden.size > 0}
          compact={compactDock}
          onHear={() => void s.hear()}
          onMic={() => {
            // Web has no OS settings page: re-ask through the browser instead.
            if (micDenied && canOpenAppSettings()) {
              void openAppSettings();
              return;
            }
            void s.toggleMic();
          }}
          onReveal={s.revealNext}
          onRevealAll={() => askConfirm("revealAll")}
          onEnd={() => askConfirm("end")}
        />
      </View>
      <ConfirmDialog
        visible={confirmOpen}
        title={
          isEndConfirm
            ? t("quranCompanion.dock.endConfirmTitle")
            : t("quranCompanion.dock.revealAllConfirmTitle")
        }
        message={
          isEndConfirm
            ? t("quranCompanion.dock.endConfirmMessage")
            : t("quranCompanion.dock.revealAllConfirmMessage")
        }
        confirmLabel={
          isEndConfirm ? t("quranCompanion.dock.endConfirm") : t("quranCompanion.dock.revealAll")
        }
        onConfirm={() => {
          if (isEndConfirm) void onEnd();
          else s.revealAll();
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </View>
  );
}

/** Header band the active word should stay below when auto-scrolling. */
const VISIBLE_TOP = 120;
/** Room kept below the content for the floating dock (mic button + labels). */
const DOCK_RESERVED_HEIGHT = 140;
/** Desktop: content column for the practice session (phones are narrower anyway). */
const SESSION_MAX_WIDTH = 880;

const MODE_LABEL_KEY = {
  follow: "quranCompanion.mode.follow",
  check: "quranCompanion.mode.check",
  "hide-words": "quranCompanion.mode.hideWords",
  "hide-ayahs": "quranCompanion.mode.hideAyahs",
} as const;

const styles = StyleSheet.create({
  root: { flex: 1 },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  ayahBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  listeningHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thin,
  },
  liveDot: { width: 10, height: 10, borderRadius: 5 },
  flexText: { flex: 1 },
  text: { marginTop: Spacing.three },
  inlineButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  center: { textAlign: "center", marginTop: Spacing.two },
  callout: { marginTop: Spacing.two },
  dockWrap: { position: "absolute", start: Spacing.three, end: Spacing.three },
  placeholder: { justifyContent: "center", gap: Spacing.two },
  placeholderLine: { borderRadius: Radius.xs, opacity: 0.6 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/practice/session");
