import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useRecitationCapture } from "@/lib/quran-companion/audio/capture";
import {
  CALIBRATION_LISTEN_THRESHOLD,
  CALIBRATION_REPS,
  calibrationFromScores,
  resolveTasbeehVoicePrefs,
} from "@/lib/tasbeeh-voice/gate";
import type { PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import type { VoicePipeline } from "@/lib/tasbeeh-voice/pipeline";
import { usePreferences } from "@/stores/preferences-store";
import {
  tasbeehVoiceCalibrationStore,
  useTasbeehVoiceCalibration,
} from "@/stores/tasbeeh-voice-calibration-store";

/** Give up after this long without five repetitions. */
const CALIBRATION_TIMEOUT_MS = 30_000;

type Phase = "idle" | "listening" | "saved" | "failed";

/**
 * "Say SubhanAllah 5 times" (NF-3.20 personal calibration). Listens with a loose
 * gate, keeps only the scores of what it heard (in memory), and stores ONE
 * number per phrase on this device. Nothing counts during calibration.
 */
export function VoiceCalibrationPanel({
  phrase,
  onDone,
}: {
  phrase: PhraseKey;
  onDone?: () => void;
}) {
  const { t } = useTranslation();
  const capture = useRecitationCapture();
  const { tasbeehVoice } = usePreferences();
  const sensitivity = resolveTasbeehVoicePrefs(tasbeehVoice).sensitivity;
  const calibration = useTasbeehVoiceCalibration();
  const [phase, setPhase] = useState<Phase>("idle");
  const [heard, setHeard] = useState(0);
  const scores = useRef<number[]>([]);
  const pipeline = useRef<VoicePipeline | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const active = pipeline.current;
    pipeline.current = null;
    await active?.stop();
    const outcome = calibrationFromScores(scores.current, sensitivity);
    scores.current = [];
    if (outcome.ok) {
      await tasbeehVoiceCalibrationStore.getState().setOffset(phrase, outcome.thresholdOffset);
      setPhase("saved");
    } else {
      setPhase("failed");
    }
  }, [phrase, sensitivity]);

  const start = async () => {
    scores.current = [];
    setHeard(0);
    setPhase("listening");
    try {
      const { startVoicePipeline } = await import("@/lib/tasbeeh-voice/pipeline");
      pipeline.current = await startVoicePipeline({
        capture,
        phrase,
        threshold: () => CALIBRATION_LISTEN_THRESHOLD,
        onHit: (hit) => {
          scores.current.push(hit.score);
          setHeard(scores.current.length);
          if (scores.current.length >= CALIBRATION_REPS) void finish();
        },
        onFailure: () => void finish(),
        onInterrupted: () => void finish(),
      });
      timer.current = setTimeout(() => void finish(), CALIBRATION_TIMEOUT_MS);
    } catch {
      setPhase("failed");
    }
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      void pipeline.current?.stop();
    },
    [],
  );

  const phraseName = t(`tasbeehVoice.phrase.${phrase}`);
  return (
    <View style={styles.root}>
      <ThemedText type="smallBold">{t("tasbeehVoice.calibrate.title")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("tasbeehVoice.calibrate.instructions", { phrase: phraseName, count: CALIBRATION_REPS })}
      </ThemedText>
      {phase === "listening" ? (
        <>
          <ThemedText type="small" accessibilityLiveRegion="polite">
            {t("tasbeehVoice.calibrate.progress", { heard, total: CALIBRATION_REPS })}
          </ThemedText>
          <ProgressBar value={heard / CALIBRATION_REPS} />
        </>
      ) : null}
      {phase === "saved" ? (
        <ThemedText type="small" accessibilityLiveRegion="polite">
          {t("tasbeehVoice.calibrate.done")}
        </ThemedText>
      ) : null}
      {phase === "failed" ? (
        <ThemedText type="small" accessibilityLiveRegion="polite">
          {t("tasbeehVoice.calibrate.failed")}
        </ThemedText>
      ) : null}
      <View style={styles.row}>
        {phase === "listening" ? (
          <Button
            label={t("tasbeehVoice.calibrate.stop")}
            variant="secondary"
            onPress={() => void finish()}
          />
        ) : (
          <Button
            label={t("tasbeehVoice.calibrate.start")}
            variant="secondary"
            onPress={() => void start()}
          />
        )}
        {calibration[phrase] && phase !== "listening" ? (
          <Button
            label={t("tasbeehVoice.calibrate.reset")}
            variant="ghost"
            onPress={() => void tasbeehVoiceCalibrationStore.getState().clear(phrase)}
          />
        ) : null}
        {onDone && phase !== "listening" ? (
          <Button label={t("common.done")} variant="ghost" onPress={onDone} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
