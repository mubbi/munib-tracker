import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, StyleSheet } from "react-native";

import { PronunciationConsentSheet } from "@/components/quran/pronunciation-consent-sheet";
import { pronunciationErrorKey } from "@/components/quran/pronunciation-settings-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useIsOnline } from "@/hooks/use-is-online";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DRILL_HEADS,
  type DrillHeadId,
  type DrillVerdict,
  judgeDrill,
} from "@/lib/quran-companion/pronunciation/judge";
import { toQuranLabCode } from "@/lib/quran-companion/pronunciation/types";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import {
  pronunciationClient,
  quranPronunciationStore,
  useEnsurePronunciationLoaded,
  usePronunciationState,
} from "@/stores/quran-pronunciation-store";

type TakeState = "idle" | "listening" | "judging";

/**
 * Phase 6 "Practise this sound" take (shared by the lesson drill and NF-3.15
 * coaching). Listens through Quran Lab's SDK (`listen()` owns the microphone;
 * no Tilawa session runs alongside). Feedback is one of three lines, never
 * names a rule as broken and never shows a score. Only heads the loaded
 * calibration validates are scored. `onVerdict` lets coaching record the
 * outcome (counts and spacing only).
 */
export function DrillTakeCard({
  head,
  onVerdict,
}: {
  head: DrillHeadId;
  onVerdict?: (verdict: DrillVerdict) => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const online = useIsOnline();
  const audio = useAudioPlayerContext();
  useEnsureCompanionPrefsLoaded();
  useEnsurePronunciationLoaded();
  const state = usePronunciationState();
  const [consentOpen, setConsentOpen] = useState(false);
  const [take, setTake] = useState<TakeState>("idle");
  const [verdict, setVerdict] = useState<DrillVerdict | null>(null);
  const [takeError, setTakeError] = useState<string | null>(null);
  const takeRef = useRef<TakeState>("idle");
  takeRef.current = take;

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

  const reliable = state.cached?.reliable;
  const known = reliable != null;
  const headReliable = !!reliable?.includes(head);

  const finishTake = async () => {
    if (takeRef.current !== "listening") return;
    setTake("judging");
    try {
      const result = await pronunciationClient.finishTake();
      const model = state.model ?? (await quranPronunciationStore.getState().open());
      const next = judgeDrill({
        head,
        heads: result.heads,
        calibration: model?.calibration ?? null,
        context: model?.defaultContext ?? state.cached?.context ?? "",
        heardSpeech: result.heardSpeech,
      });
      setVerdict(next);
      onVerdict?.(next);
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
    <>
      <Card padding="three">
        {state.status === "unavailable" ? (
          <ThemedText type="small">{t("tajweedCoaching.drill.unavailable")}</ThemedText>
        ) : state.status === "needs-consent" ? (
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
                accessibilityLiveRegion="polite"
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

      <PronunciationConsentSheet
        visible={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAgree={() => {
          setConsentOpen(false);
          void quranPronunciationStore.getState().consentAndDownload();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gap: { marginTop: Spacing.two },
});
