import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sheet } from "@/components/ui/sheet";
import { engineDownloadMb } from "@/constants/recitation-models";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { FASTCONFORMER_ENGINE } from "@/lib/speech/fastconformer";
import { usesModel } from "@/lib/tasbeeh-voice/mode";
import { downloadFraction } from "@/lib/tasbeeh-voice/model-status";
import { PHRASE_KEYS, type PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import {
  useCompanionPrefs,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";

import { VoiceCalibrationPanel } from "./voice-calibration-panel";

type Props = {
  visible: boolean;
  onClose: () => void;
  voice: VoiceTasbeeh;
  /** Free counter: the user picks the phrase here. */
  choosable: boolean;
  phrase: PhraseKey | null;
  onChoosePhrase: (phrase: PhraseKey) => void;
};

/**
 * First-use / setup sheet for hands-free counting (NF-3.20): how it works and
 * that everything stays on the device, the shared listener download (reusing
 * Qur'an practice's download job and progress), that a low voice is enough and
 * tapping is just as good, then the microphone permission — in that order.
 */
export function VoiceTasbeehSheet({
  visible,
  onClose,
  voice,
  choosable,
  phrase,
  onChoosePhrase,
}: Props) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureCompanionPrefsLoaded();
  const companion = useCompanionPrefs();
  const listener = useListenerState();
  const [needsCellular, setNeedsCellular] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [starting, setStarting] = useState(false);
  const sizeMb = engineDownloadMb(FASTCONFORMER_ENGINE);
  const model = voice.modelStatus;

  const download = async (allowCellular = false) => {
    const result = await quranListenerStore.getState().download(FASTCONFORMER_ENGINE, {
      wifiOnly: companion.wifiOnlyDownload,
      allowCellular,
    });
    setNeedsCellular(result === "needs-cellular-confirm");
  };

  const start = async () => {
    setStarting(true);
    try {
      const result = await voice.start();
      if (result === "started") onClose();
    } finally {
      setStarting(false);
    }
  };

  const ready = model === "ready" && voice.permission === "granted" && phrase != null;

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <View style={styles.body}>
        <ThemedText type="subtitle" role="heading">
          {t("tasbeehVoice.sheet.title")}
        </ThemedText>
        <ThemedText type="small">{t("tasbeehVoice.sheet.howItWorks")}</ThemedText>
        <ThemedText type="small">{t("tasbeehVoice.sheet.lowVoice")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("tasbeehVoice.sheet.accuracy")}
        </ThemedText>

        {choosable ? (
          <View style={styles.section}>
            <ThemedText type="smallBold">{t("tasbeehVoice.sheet.choosePhrase")}</ThemedText>
            <View style={styles.chips} accessibilityRole="radiogroup">
              {PHRASE_KEYS.map((key) => {
                const selected = key === phrase;
                return (
                  <PressableScale
                    key={key}
                    haptic="selection"
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => onChoosePhrase(key)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? tokens.accentSoft : colors.muted,
                        borderColor: selected ? colors.accent : tokens.hairline,
                      },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={{ color: selected ? colors.accentText : colors.foreground }}
                    >
                      {t(`tasbeehVoice.phrase.${key}`)}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>
          </View>
        ) : null}

        {usesModel() ? null : (
          <ThemedText type="small" style={{ color: tokens.status.warning.color }}>
            {t("tasbeehVoice.sheet.pauseMode")}
          </ThemedText>
        )}

        <View style={styles.section}>
          {!usesModel() ? null : model === "unsupported" ? (
            <ThemedText type="small">{t("tasbeehVoice.sheet.unsupported")}</ThemedText>
          ) : model === "ready" ? (
            <ThemedText type="small" themeColor="mutedForeground">
              {t("tasbeehVoice.sheet.modelReady")}
            </ThemedText>
          ) : model === "downloading" ? (
            <>
              <ThemedText type="small">
                {t("tasbeehVoice.sheet.downloading", {
                  percent: Math.round(downloadFraction(listener) * 100),
                })}
              </ThemedText>
              <ProgressBar value={downloadFraction(listener)} />
              <Button
                label={t("tasbeehVoice.sheet.cancelDownload")}
                variant="ghost"
                onPress={() => quranListenerStore.getState().cancel()}
              />
            </>
          ) : (
            <>
              <ThemedText type="small">
                {t("tasbeehVoice.sheet.model", { size: sizeMb })}
              </ThemedText>
              {model === "other-engine" ? (
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("tasbeehVoice.sheet.modelOther")}
                </ThemedText>
              ) : null}
              {model === "failed" ? (
                <ThemedText type="small" style={{ color: tokens.status.warning.color }}>
                  {t("tasbeehVoice.sheet.downloadFailed")}
                </ThemedText>
              ) : null}
              {needsCellular ? (
                <>
                  <ThemedText type="small">{t("tasbeehVoice.sheet.cellular")}</ThemedText>
                  <Button
                    label={t("tasbeehVoice.sheet.downloadAnyway")}
                    variant="secondary"
                    onPress={() => void download(true)}
                  />
                </>
              ) : (
                <Button
                  label={t("tasbeehVoice.sheet.download", { size: sizeMb })}
                  variant="secondary"
                  onPress={() => void download(false)}
                />
              )}
            </>
          )}
        </View>

        {model !== "unsupported" ? (
          <View style={styles.section}>
            <ThemedText type="smallBold">{t("tasbeehVoice.sheet.micTitle")}</ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("tasbeehVoice.sheet.micExplain")}
            </ThemedText>
            {voice.permission === "denied" ? (
              <>
                <ThemedText type="small">{t("tasbeehVoice.sheet.micDenied")}</ThemedText>
                <Button
                  label={
                    canOpenAppSettings()
                      ? t("tasbeehVoice.sheet.openSettings")
                      : t("tasbeehVoice.sheet.allowMic")
                  }
                  variant="secondary"
                  onPress={() =>
                    void (canOpenAppSettings() ? openAppSettings() : voice.requestPermission())
                  }
                />
              </>
            ) : voice.permission !== "granted" ? (
              <Button
                label={t("tasbeehVoice.sheet.allowMic")}
                variant="secondary"
                onPress={() => void voice.requestPermission()}
              />
            ) : null}
          </View>
        ) : null}

        {ready && phrase && usesModel() ? (
          calibrating ? (
            <VoiceCalibrationPanel phrase={phrase} onDone={() => setCalibrating(false)} />
          ) : (
            <Button
              label={t("tasbeehVoice.calibrate.title")}
              variant="ghost"
              onPress={() => setCalibrating(true)}
            />
          )
        ) : null}

        <View style={styles.actions}>
          <Button
            label={t("tasbeehVoice.sheet.close")}
            variant="ghost"
            onPress={onClose}
            style={styles.action}
          />
          <Button
            label={t("tasbeehVoice.sheet.start")}
            onPress={() => void start()}
            disabled={!ready || starting || calibrating}
            style={styles.action}
          />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
