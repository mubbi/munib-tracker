import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

type StepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Label prefix for accessibility, e.g. "Fajr qaza". */
  label: string;
  /** When set, the center value becomes tappable (e.g. manual qaza edit). */
  onValuePress?: () => void;
  /** Accessibility label for the tappable value — required when `onValuePress` is set. */
  valueAccessibilityLabel?: string;
  min?: number;
  size?: "sm" | "md";
  /** Button background — defaults to the card color. */
  buttonBackground?: string;
};

/** A compact −/value/+ stepper, shared by the qaza counters and roza screens. */
export function Stepper({
  value,
  onIncrement,
  onDecrement,
  label,
  onValuePress,
  valueAccessibilityLabel,
  min = 0,
  size = "sm",
  buttonBackground,
}: StepperProps) {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const dim = size === "sm" ? 30 : 40;
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <View style={styles.row}>
      <StepButton
        icon={{ ios: "minus", android: "remove", web: "remove" }}
        label={t("common.decrease", { label })}
        disabled={value <= min}
        dim={dim}
        iconSize={iconSize}
        background={buttonBackground ?? colors.card}
        onPress={() => {
          triggerHaptic("light");
          onDecrement();
        }}
      />
      {onValuePress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={valueAccessibilityLabel ?? label}
          hitSlop={6}
          onPress={() => {
            triggerHaptic("light");
            onValuePress();
          }}
          style={[styles.countPressable, { minWidth: dim - 2 }]}
        >
          <ThemedText type="smallBold" style={styles.count}>
            {value}
          </ThemedText>
        </Pressable>
      ) : (
        <ThemedText type="smallBold" style={[styles.count, { minWidth: dim - 2 }]}>
          {value}
        </ThemedText>
      )}
      <StepButton
        icon={{ ios: "plus", android: "add", web: "add" }}
        label={t("common.increase", { label })}
        dim={dim}
        iconSize={iconSize}
        background={buttonBackground ?? colors.card}
        onPress={() => {
          triggerHaptic("light");
          onIncrement();
        }}
      />
    </View>
  );
}

function StepButton({
  icon,
  label,
  onPress,
  disabled,
  dim,
  iconSize,
  background,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
  dim: number;
  iconSize: number;
  background: string;
}) {
  const { colors } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={Math.max(6, Math.ceil((44 - dim) / 2))}
      onPress={onPress}
      style={[
        styles.button,
        { width: dim, height: dim, backgroundColor: background, opacity: disabled ? 0.3 : 1 },
      ]}
    >
      <SymbolView name={icon} size={iconSize} tintColor={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  button: {
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  countPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.one,
  },
  count: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
