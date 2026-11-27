import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sheet } from "@/components/ui/sheet";
import { engineDownloadMb } from "@/constants/recitation-models";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { FASTCONFORMER_ENGINE } from "@/lib/speech/fastconformer";
import { usesModel } from "@/lib/tasbeeh-voice/mode";
import { downloadFraction } from "@/lib/tasbeeh-voice/model-status";
import type { VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import {
  useCompanionPrefs,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { quranListenerStore, useListenerState } from "@/stores/quran-listener-store";

import { VoiceCalibrationPanel } from "./voice-calibration-panel";
import { VoiceTeachPanel } from "./voice-teach-panel";
import { VoiceZikrPicker } from "./voice-zikr-picker";

type Props = {
  visible: boolean;
  onClose: () => void;
  voice: VoiceTasbeeh;
  /** Free counter: the user picks the zikr here. */
  choosable: boolean;
  zikr: VoiceZikr | null;
  onChooseZikr: (zikr: VoiceZikr) => void;
};

/**
 * Setup sheet for hands-free counting (NF-3.20, D48–D51), in this order: how it
 * works and what stays on the device; which zikr (free counter only: search the
 * whole library, your tasbeehs, or "Something else"); the microphone; then
 * "Say it once so only this zikr counts" — teach 1–3 samples with live feedback,
 * after which counting starts — or "Skip — count every pause" (less accurate).
 * A zikr already taught on this device starts straight away, with "Re-teach".
 * The model download / calibration only appear for the model spotter (off, D24).
 */
export function VoiceTasbeehSheet({
  visible,
  onClose,
  voice,
  choosable,
  zikr,
  onChooseZikr,
}: Props) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  useEnsureCompanionPrefsLoaded();
  const companion = useCompanionPrefs();
  const listener = useListenerState();
  const [needsCellular, setNeedsCellular] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(zikr == null);
  const sizeMb = engineDownloadMb(FASTCONFORMER_ENGINE);
  const model = voice.modelStatus;
  const spotter = usesModel() && voice.phrase != null && !voice.taught;
  const teaching = voice.teach.status === "recording";
  const micReady = voice.permission === "granted";

  // Counting started (teaching finished, or Start): the sheet's job is done.
  const wasListening = useRef(voice.listening);
  useEffect(() => {
    if (visible && voice.listening && !wasListening.current) onClose();
    wasListening.current = voice.listening;
  }, [visible, voice.listening, onClose]);

  // Re-open on the picker when nothing is chosen yet.
  useEffect(() => {
    if (visible && zikr == null) setPicking(true);
  }, [visible, zikr]);

  const close = () => {
    // Closing on a Re-teach goes back to counting with the pattern it had.
    if (teaching) voice.cancelTeaching({ resume: true });
    onClose();
  };

  const download = async (allowCellular = false) => {
    const result = await quranListenerStore.getState().download(FASTCONFORMER_ENGINE, {
      wifiOnly: companion.wifiOnlyDownload,
      allowCellular,
    });
    setNeedsCellular(result === "needs-cellular-confirm");
  };

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    try {
      const result = await action();
      if (result === "needs-permission") await voice.requestPermission();
    } finally {
      setBusy(false);
    }
  };

  const showPicker = choosable && (picking || zikr == null);
  const ready = zikr != null && micReady && (!spotter || model === "ready");
  const label = zikr?.label ?? null;

  return (
    <Sheet
      accessibilityLabel={t("tasbeehVoice.sheet.title")}
      visible={visible}
      onClose={close}
      variant="bottom"
      solid
    >
      <View style={styles.body}>
        <ThemedText type="subtitle" role="heading">
          {t("tasbeehVoice.sheet.title")}
        </ThemedText>
        <ThemedText type="small">{t("tasbeehVoice.sheet.howItWorks")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("tasbeehVoice.sheet.lowVoice")}
        </ThemedText>

        {showPicker ? (
          <VoiceZikrPicker
            selected={zikr}
            onSelect={(next) => {
              onChooseZikr(next);
              setPicking(false);
            }}
          />
        ) : choosable && zikr ? (
          <ChosenZikrRow
            label={label ?? t("tasbeehVoice.picker.somethingElse")}
            onChange={() => {
              if (teaching) voice.cancelTeaching();
              setPicking(true);
            }}
          />
        ) : null}

        {spotter ? (
          <ModelSection
            model={model}
            sizeMb={sizeMb}
            percent={Math.round(downloadFraction(listener) * 100)}
            fraction={downloadFraction(listener)}
            needsCellular={needsCellular}
            onDownload={(allowCellular) => void download(allowCellular)}
          />
        ) : null}

        {model !== "unsupported" && !micReady ? (
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
            ) : (
              <Button
                label={t("tasbeehVoice.sheet.allowMic")}
                variant="secondary"
                onPress={() => void voice.requestPermission()}
              />
            )}
          </View>
        ) : null}

        {zikr != null && !showPicker ? (
          teaching ? (
            <VoiceTeachPanel
              teach={voice.teach}
              label={label}
              level={voice.level}
              speaking={voice.speaking}
              onDone={() => void run(voice.finishTeaching)}
              onCancel={() => voice.cancelTeaching({ resume: true })}
            />
          ) : voice.taught ? (
            <View style={styles.section}>
              <ThemedText type="small" style={{ color: tokens.status.success.text }}>
                {t("tasbeehVoice.teach.taughtReady")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tasbeehVoice.teach.countsTaught")}
              </ThemedText>
              <Button
                label={t("tasbeehVoice.teach.reteach")}
                variant="ghost"
                onPress={() => void run(voice.startTeaching)}
                disabled={!micReady || busy}
              />
            </View>
          ) : (
            <View style={styles.section}>
              <ThemedText type="smallBold">{t("tasbeehVoice.teach.title")}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {label
                  ? t("tasbeehVoice.teach.explain", { phrase: label })
                  : t("tasbeehVoice.teach.explainOther")}
              </ThemedText>
            </View>
          )
        ) : null}

        {ready && spotter ? (
          calibrating && voice.phrase ? (
            <VoiceCalibrationPanel phrase={voice.phrase} onDone={() => setCalibrating(false)} />
          ) : (
            <Button
              label={t("tasbeehVoice.calibrate.title")}
              variant="ghost"
              onPress={() => setCalibrating(true)}
            />
          )
        ) : null}

        {teaching || showPicker ? (
          <Button label={t("tasbeehVoice.sheet.close")} variant="ghost" onPress={close} />
        ) : voice.taught || spotter ? (
          <View style={styles.actions}>
            <Button
              label={t("tasbeehVoice.sheet.close")}
              variant="ghost"
              onPress={close}
              style={styles.action}
            />
            <Button
              label={t("tasbeehVoice.sheet.start")}
              onPress={() => void run(() => voice.start())}
              disabled={!ready || busy || calibrating}
              style={styles.action}
            />
          </View>
        ) : zikr != null ? (
          <View style={styles.section}>
            <Button
              label={t("tasbeehVoice.teach.start")}
              onPress={() => void run(voice.startTeaching)}
              disabled={!micReady || busy}
            />
            <Button
              label={t("tasbeehVoice.teach.skip")}
              variant="ghost"
              onPress={() => void run(() => voice.start({ skipTeaching: true }))}
              disabled={!micReady || busy}
            />
            <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
              {t("tasbeehVoice.sheet.pauseMode")}
            </ThemedText>
            <Button label={t("tasbeehVoice.sheet.close")} variant="ghost" onPress={close} />
          </View>
        ) : null}
      </View>
    </Sheet>
  );
}

function ChosenZikrRow({ label, onChange }: { label: string; onChange: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={t("tasbeehVoice.picker.changeA11y", { phrase: label })}
      onPress={onChange}
      style={[styles.chosen, { backgroundColor: colors.muted, borderColor: tokens.hairline }]}
    >
      <View style={styles.chosenText}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("tasbeehVoice.picker.chosen")}
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={2}>
          {label}
        </ThemedText>
      </View>
      <ThemedText type="small" style={{ color: colors.accentText }}>
        {t("tasbeehVoice.picker.change")}
      </ThemedText>
    </PressableScale>
  );
}

function ModelSection({
  model,
  sizeMb,
  percent,
  fraction,
  needsCellular,
  onDownload,
}: {
  model: VoiceTasbeeh["modelStatus"];
  sizeMb: number;
  percent: number;
  fraction: number;
  needsCellular: boolean;
  onDownload: (allowCellular: boolean) => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  if (model === "unsupported") {
    return <ThemedText type="small">{t("tasbeehVoice.sheet.unsupported")}</ThemedText>;
  }
  if (model === "ready") {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("tasbeehVoice.sheet.modelReady")}
      </ThemedText>
    );
  }
  if (model === "downloading") {
    return (
      <View style={styles.section}>
        <ThemedText type="small">{t("tasbeehVoice.sheet.downloading", { percent })}</ThemedText>
        <ProgressBar value={fraction} accessibilityLabel={t("a11yProgress.modelDownload")} />
        <Button
          label={t("tasbeehVoice.sheet.cancelDownload")}
          variant="ghost"
          onPress={() => quranListenerStore.getState().cancel()}
        />
      </View>
    );
  }
  return (
    <View style={styles.section}>
      <ThemedText type="small">{t("tasbeehVoice.sheet.model", { size: sizeMb })}</ThemedText>
      {model === "other-engine" ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("tasbeehVoice.sheet.modelOther")}
        </ThemedText>
      ) : null}
      {model === "failed" ? (
        <ThemedText type="small" style={{ color: tokens.status.warning.text }}>
          {t("tasbeehVoice.sheet.downloadFailed")}
        </ThemedText>
      ) : null}
      {needsCellular ? (
        <>
          <ThemedText type="small">{t("tasbeehVoice.sheet.cellular")}</ThemedText>
          <Button
            label={t("tasbeehVoice.sheet.downloadAnyway")}
            variant="secondary"
            onPress={() => onDownload(true)}
          />
        </>
      ) : (
        <Button
          label={t("tasbeehVoice.sheet.download", { size: sizeMb })}
          variant="secondary"
          onPress={() => onDownload(false)}
        />
      )}
    </View>
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
  chosen: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  chosenText: {
    flex: 1,
    gap: Spacing.half,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
