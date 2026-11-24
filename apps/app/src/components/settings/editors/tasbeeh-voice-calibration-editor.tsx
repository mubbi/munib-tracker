import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PHRASE_KEYS, type PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import { useEnsureTasbeehVoiceCalibrationLoaded } from "@/stores/tasbeeh-voice-calibration-store";

// The panel pulls in microphone capture (expo-audio) and the on-device model
// runner: load it only when calibration starts, never with the editors barrel.
const VoiceCalibrationPanel = lazy(() =>
  import("@/components/tasbeeh/voice/voice-calibration-panel").then((m) => ({
    default: m.VoiceCalibrationPanel,
  })),
);

/**
 * Settings › Hadith, duas & adhkar › Tasbeeh counter › "Calibrate for my voice"
 * (NF-3.20). Pick a phrase, then the shared calibration panel listens on the
 * device and stores one offset for that phrase on this device only. The panel
 * (and its microphone stream) mounts only after "Start".
 */
export function TasbeehVoiceCalibrationEditor() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureTasbeehVoiceCalibrationLoaded();
  const [phrase, setPhrase] = useState<PhraseKey>("subhanallah");
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.root}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("tasbeehVoice.sheet.choosePhrase")}
      </ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {PHRASE_KEYS.map((key) => {
          const selected = key === phrase;
          return (
            <PressableScale
              key={key}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: open }}
              disabled={open}
              onPress={() => setPhrase(key)}
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
      {open ? (
        <Suspense fallback={null}>
          <VoiceCalibrationPanel phrase={phrase} onDone={() => setOpen(false)} />
        </Suspense>
      ) : (
        <Button
          label={t("tasbeehVoice.calibrate.title")}
          variant="secondary"
          onPress={() => setOpen(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
