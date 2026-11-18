import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, StyleSheet, View } from "react-native";
import { PronunciationConsentSheet } from "@/components/quran/pronunciation-consent-sheet";
import { pronunciationErrorKey } from "@/components/quran/pronunciation-settings-card";
import { QuranGuideClipPlayButton } from "@/components/quran-guide/ayah-play-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useIsOnline } from "@/hooks/use-is-online";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import {
  DRILL_HEADS,
  type DrillVerdict,
  judgeDrill,
  LESSON_DRILL_HEAD,
} from "@/lib/quran-companion/pronunciation/judge";
import { toQuranLabCode } from "@/lib/quran-companion/pronunciation/types";
import {
  ensureQuranGuideContent,
  getQuranGuideTajweedLesson,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import {
  pronunciationClient,
  quranPronunciationStore,
  useEnsurePronunciationLoaded,
  usePronunciationState,
} from "@/stores/quran-pronunciation-store";

export function generateStaticParams(): Array<{ id: string }> {
  return Object.keys(LESSON_DRILL_HEAD).map((id) => ({ id }));
}

type TakeState = "idle" | "listening" | "judging";

/**
 * Phase 6 "Practise this sound" (§11 Phase 6). Plays the lesson's reference
 * audio, then listens through Quran Lab's SDK (`listen()` owns the microphone).
 * Feedback is one of three lines and never names a rule as broken. Only heads
 * the loaded calibration validates are scored. No Tilawa session runs here.
 */
export default function TajweedDrillScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const online = useIsOnline();
  const audio = useAudioPlayerContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const head = lessonId ? LESSON_DRILL_HEAD[lessonId] : undefined;
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lesson = useMemo(
    () => (contentReady ? getQuranGuideTajweedLesson(lessonId) : undefined),
    [lessonId, i18n.language, contentReady],
  );
  useEnsureCompanionPrefsLoaded();
  useEnsurePronunciationLoaded();
  const state = usePronunciationState();
  const [consentOpen, setConsentOpen] = useState(false);
  const [take, setTake] = useState<TakeState>("idle");
  const [verdict, setVerdict] = useState<DrillVerdict | null>(null);
  const [takeError, setTakeError] = useState<string | null>(null);
  const takeRef = useRef<TakeState>("idle");
  takeRef.current = take;

  const lessonHref = (
    lessonId ? `/learn-quran/tajweed/${lessonId}` : "/learn-quran/tajweed"
  ) as Href;

  useEffect(() => {
    if (!isPracticeAvailable() || !head) router.replace(lessonHref);
  }, [head, lessonHref, router]);

  // Open the model once it is on the device (reads the calibration).
  useEffect(() => {
    if (state.status === "ready" && !state.model) void quranPronunciationStore.getState().open();
  }, [state.model, state.status]);

  // Leaving the screen or the app ends the take (the SDK also ends it in the background).
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active" && takeRef.current === "listening") {
        void pronunciationClient.cancelTake();
        setTake("idle");
      }
    });
    return () => {
      sub.remove();
      void pronunciationClient.cancelTake();
    };
  }, []);

  if (!head || !isPracticeAvailable()) return null;

  const reliable = state.cached?.reliable;
  const known = reliable != null;
  const headReliable = !!reliable?.includes(head);

  const finishTake = async () => {
    if (takeRef.current !== "listening") return;
    setTake("judging");
    try {
      const result = await pronunciationClient.finishTake();
      const model = state.model ?? (await quranPronunciationStore.getState().open());
      setVerdict(
        judgeDrill({
          head,
          heads: result.heads,
          calibration: model?.calibration ?? null,
          context: model?.defaultContext ?? state.cached?.context ?? "",
          heardSpeech: result.heardSpeech,
        }),
      );
    } catch (error) {
      if (toQuranLabCode(error) !== "cancelled")
        setTakeError(pronunciationErrorKey(toQuranLabCode(error)));
    } finally {
      setTake("idle");
    }
  };

  const startTake = async () => {
    setVerdict(null);
    setTakeError(null);
    audio.stop();
    setTake("listening");
    try {
      await pronunciationClient.startTake(
        [DRILL_HEADS[head].head, "log_probs", "timing_log_probs"],
        () => {},
        () => void finishTake(),
      );
    } catch (error) {
      setTakeError(pronunciationErrorKey(toQuranLabCode(error)));
      setTake("idle");
    }
  };

  const verdictLine =
    verdict === "matched"
      ? t("quranCompanion.pronunciation.verdictMatched")
      : verdict === "try-again"
        ? t("quranCompanion.pronunciation.verdictTryAgain")
        : verdict === "not-sure"
          ? t("quranCompanion.pronunciation.verdictNotSure")
          : null;

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("quranCompanion.pronunciation.drillTitle")}
      subtitle={lesson?.title}
      onBack={() => goBackOrReplace(router, lessonHref)}
    >
      <Seo path={`/learn-quran/tajweed/drill/${lessonId}`} index={false} />
      <Card padding="four">
        <ThemedText type="small">{t("quranCompanion.pronunciation.drillIntro")}</ThemedText>
        {lesson?.practiceAudio ? (
          <View style={styles.row}>
            <QuranGuideClipPlayButton
              audio={lesson.practiceAudio}
              sourceHref={`/learn-quran/tajweed/drill/${lessonId}`}
            />
          </View>
        ) : null}
        {lesson?.practice ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
            {lesson.practice}
          </ThemedText>
        ) : null}
      </Card>

      <Card padding="three">
        {state.status === "needs-consent" ? (
          <>
            <ThemedText type="small">{t("quranCompanion.pronunciation.needsSetup")}</ThemedText>
            {!online ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
                {t("quranCompanion.pronunciation.needsConnectionOnce")}
              </ThemedText>
            ) : null}
            <Button
              label={t("quranCompanion.pronunciation.setUp")}
              onPress={() => setConsentOpen(true)}
              disabled={!online}
              style={styles.gap}
            />
          </>
        ) : state.status === "not-downloaded" || state.status === "failed" ? (
          <>
            <ThemedText type="small">
              {state.error
                ? t(pronunciationErrorKey(state.error))
                : t("quranCompanion.pronunciation.notOnDevice")}
            </ThemedText>
            {!online ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
                {t("quranCompanion.pronunciation.needsConnectionOnce")}
              </ThemedText>
            ) : null}
            <Button
              label={t("quranCompanion.listener.download")}
              onPress={() => void quranPronunciationStore.getState().download()}
              disabled={!online}
              style={styles.gap}
            />
          </>
        ) : state.status === "downloading" ? (
          <>
            <ThemedText type="small">{t("quranCompanion.pronunciation.downloading")}</ThemedText>
            {state.bytesTotal > 0 ? (
              <ProgressBar value={state.bytesDone / state.bytesTotal} style={styles.gap} />
            ) : null}
          </>
        ) : known && !headReliable ? (
          <ThemedText type="small">
            {t("quranCompanion.pronunciation.notAvailableForSound")}
          </ThemedText>
        ) : (
          <>
            <Button
              label={
                take === "listening"
                  ? t("quranCompanion.pronunciation.stop")
                  : t("quranCompanion.pronunciation.recite")
              }
              onPress={() => void (take === "listening" ? finishTake() : startTake())}
              disabled={take === "judging" || !state.model}
              fullWidth
              icon={
                take === "listening"
                  ? { ios: "stop.fill", android: "stop", web: "stop" }
                  : { ios: "mic.fill", android: "mic", web: "mic" }
              }
            />
            {take === "listening" ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
                {t("quranCompanion.pronunciation.listening")}
              </ThemedText>
            ) : null}
            {verdictLine ? (
              <ThemedText
                type="small"
                style={[
                  styles.gap,
                  {
                    color:
                      verdict === "matched"
                        ? tokens.status.success.color
                        : verdict === "try-again"
                          ? tokens.status.warning.color
                          : undefined,
                  },
                ]}
              >
                {verdictLine}
              </ThemedText>
            ) : null}
            {takeError ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
                {t(takeError)}
              </ThemedText>
            ) : null}
          </>
        )}
      </Card>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {t("quranCompanion.privacy.practiceAid")}
      </ThemedText>

      <PronunciationConsentSheet
        visible={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAgree={() => {
          setConsentOpen(false);
          void quranPronunciationStore.getState().consentAndDownload();
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: Spacing.three, alignItems: "flex-start" },
  gap: { marginTop: Spacing.two },
  center: { textAlign: "center", marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tajweed/drill/[id]");
