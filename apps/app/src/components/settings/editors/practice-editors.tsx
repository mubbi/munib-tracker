import { useFocusEffect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PronunciationSettingsCard } from "@/components/quran/pronunciation-settings-card";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { createRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission } from "@/lib/quran-companion/audio/types";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";

type RecitationCapture = ReturnType<typeof createRecitationCapture>;
let capture: RecitationCapture | null = null;
/**
 * Loaded on first use: the capture module pulls in the native audio stack, and
 * this file sits in the editors barrel that every settings group screen loads.
 */
function recitationCapture(): RecitationCapture {
  if (!capture) {
    const mod =
      require("@/lib/quran-companion/audio/capture") as typeof import("@/lib/quran-companion/audio/capture");
    capture = mod.createRecitationCapture();
  }
  return capture;
}

/**
 * Qur'an › Practice: the Quran Lab pronunciation listener card (state, download,
 * delete, the SDK's recitation-sharing switch). Renders nothing where practice
 * or the SDK is unavailable.
 */
export function PronunciationSettingsEditor() {
  if (!isPracticeAvailable()) return null;
  return <PronunciationSettingsCard />;
}

/**
 * Microphone permission status for recitation practice and hands-free counting.
 * Tapping opens the OS settings page on native, or asks the browser again on web.
 * Shared by Qur'an › Practice, Privacy & security and `/settings/quran-practice`.
 */
export function MicrophoneStatusRow() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [mic, setMic] = useState<MicPermission | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isPracticeAvailable()) return;
      try {
        void recitationCapture()
          .getPermission()
          .then(setMic)
          .catch(() => setMic(null));
      } catch {
        setMic(null);
      }
    }, []),
  );

  if (!isPracticeAvailable()) return null;

  const label =
    mic === "granted"
      ? t("quranCompanion.privacy.micAllowed")
      : mic === "denied"
        ? t("quranCompanion.privacy.micBlocked")
        : t("quranCompanion.privacy.micNotAsked");
  // Dot keeps the hue; the label uses the AA text token (the words carry the meaning).
  const tone =
    mic === "granted"
      ? tokens.status.success.color
      : mic === "denied"
        ? tokens.status.danger.color
        : colors.mutedForeground;
  const toneText =
    mic === "granted"
      ? tokens.status.success.text
      : mic === "denied"
        ? tokens.status.danger.text
        : colors.mutedForeground;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${t("quranCompanion.privacy.microphone")}: ${label}`}
      onPress={() => {
        if (canOpenAppSettings()) void openAppSettings();
        else void recitationCapture().requestPermission().then(setMic);
      }}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <SymbolView
        name={{ ios: "mic.fill", android: "mic", web: "mic" }}
        size={18}
        tintColor={colors.foreground}
      />
      <ThemedText type="small" style={styles.flex}>
        {t("quranCompanion.privacy.microphone")}
      </ThemedText>
      <View
        accessible={false}
        importantForAccessibility="no"
        style={[styles.dot, { backgroundColor: tone }]}
      />
      <ThemedText type="caption" style={{ color: toneText }}>
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  flex: { flex: 1, minWidth: 0 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
