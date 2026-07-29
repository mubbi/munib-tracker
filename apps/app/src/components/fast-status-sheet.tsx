import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";
import type { FastStatus } from "@/stores/fasting-store";

type SymbolName = SymbolViewProps["name"];
type FastTone = "success" | "danger" | "info" | "muted";

/** Selectable fasting options in display order (null = clear/unmarked). */
const FAST_OPTIONS: {
  value: FastStatus | null;
  key: string;
  icon: SymbolName;
  tone: FastTone;
}[] = [
  {
    value: "fasted",
    key: "fasted",
    icon: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
    tone: "success",
  },
  {
    value: "missed",
    key: "missed",
    icon: { ios: "xmark.circle.fill", android: "cancel", web: "cancel" },
    tone: "danger",
  },
  {
    value: "exempt",
    key: "exempt",
    icon: { ios: "cross.case.fill", android: "medical_services", web: "medical_services" },
    tone: "info",
  },
  {
    value: null,
    key: "clear",
    icon: { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" },
    tone: "muted",
  },
];

function outcomeHaptic(status: FastStatus | null): HapticFeedback {
  if (status === "fasted") return "success";
  if (status === "missed") return "warning";
  return "selection";
}

type FastStatusSheetProps = {
  visible: boolean;
  dayLabel: string;
  currentStatus: FastStatus | undefined;
  onSelect: (status: FastStatus | null) => void;
  onClose: () => void;
};

export function FastStatusSheet({
  visible,
  dayLabel,
  currentStatus,
  onSelect,
  onClose,
}: FastStatusSheetProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  const toneColor = (tone: FastTone) =>
    tone === "muted" ? colors.mutedForeground : tokens.status[tone].color;
  const toneSoft = (tone: FastTone) => (tone === "muted" ? colors.muted : tokens.status[tone].soft);

  const handlePress = (status: FastStatus | null) => {
    triggerHaptic(outcomeHaptic(status));
    onSelect(status);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{dayLabel}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fastStatusSheet.prompt")}
      </ThemedText>

      <View style={styles.options}>
        {FAST_OPTIONS.map((option) => {
          const active = (currentStatus ?? null) === option.value;
          const color = toneColor(option.tone);
          return (
            <PressableScale
              key={option.key}
              haptic={false}
              accessibilityRole="button"
              accessibilityLabel={t(`fastStatusSheet.${option.key}`)}
              accessibilityState={{ selected: active }}
              onPress={() => handlePress(option.value)}
              style={[
                styles.option,
                {
                  backgroundColor: active ? toneSoft(option.tone) : colors.muted,
                  borderColor: active ? color : "transparent",
                },
              ]}
            >
              <SymbolView name={option.icon} size={22} tintColor={color} />
              <ThemedText type="smallBold" style={{ color }}>
                {t(`fastStatusSheet.${option.key}`)}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  option: {
    flexGrow: 1,
    flexBasis: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
});
