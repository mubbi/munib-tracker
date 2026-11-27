import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import type { MicState } from "@/hooks/use-practice-session";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const SIZE = 104;

/**
 * The one big Start / Stop button of kids recite-along. Red only while the
 * microphone is live (the universal "recording" cue); a spinner while the
 * listener is getting ready. State is in the label, never colour alone.
 */
export function KidsMicButton({
  mic,
  preparing,
  disabled,
  onPress,
}: {
  mic: MicState;
  preparing: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const recording = mic === "listening" || mic === "starting";
  const busy = preparing || mic === "starting" || mic === "settling";
  const label = preparing
    ? t("kids.recite.gettingReady")
    : recording
      ? t("kids.recite.stop")
      : t("kids.recite.start");
  const background = recording ? tokens.status.danger.color : colors.accent;

  return (
    <View style={styles.wrap}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={recording ? undefined : t("kids.recite.startHint")}
        accessibilityState={{ disabled: disabled || preparing, busy }}
        disabled={disabled || preparing}
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor: background, opacity: disabled || preparing ? 0.55 : 1 },
        ]}
      >
        {busy && !recording ? (
          <ActivityIndicator color={colors.accentForeground} />
        ) : (
          <AppIcon
            icon={
              recording
                ? { ios: "stop.fill", android: "stop", web: "stop" }
                : { ios: "mic.fill", android: "mic", web: "mic" }
            }
            size={40}
            tintColor={colors.accentForeground}
          />
        )}
      </PressableScale>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: Spacing.two },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { textAlign: "center" },
});
