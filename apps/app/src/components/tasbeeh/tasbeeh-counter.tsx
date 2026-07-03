import { SymbolView } from "expo-symbols";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

export type TasbeehMode = { label: string; target: number };

export const TASBEEH_MODES: TasbeehMode[] = [
  { label: "33", target: 33 },
  { label: "99", target: 99 },
  { label: "100", target: 100 },
  { label: "∞", target: 0 },
];

const RING_SIZE = 240;
const RING_STROKE = 16;

type TasbeehCounterProps = {
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  modes?: TasbeehMode[];
  onSelectMode?: (target: number) => void;
  onCustom?: () => void;
};

export function TasbeehCounter({
  count,
  target,
  onIncrement,
  onDecrement,
  onReset,
  modes = TASBEEH_MODES,
  onSelectMode,
  onCustom,
}: TasbeehCounterProps) {
  const { colors, tokens } = useThemeTokens();
  const complete = target > 0 && count >= target;
  const prevComplete = useRef(complete);

  useEffect(() => {
    if (complete && !prevComplete.current) triggerHaptic("success");
    prevComplete.current = complete;
  }, [complete]);

  const handleTap = () => {
    triggerHaptic(complete ? "medium" : "light");
    onIncrement();
  };

  return (
    <View style={styles.root}>
      {onSelectMode ? (
        <View style={styles.modes}>
          {modes.map((mode) => {
            const active = mode.target === target;
            return (
              <PressableScale
                key={mode.label}
                haptic="light"
                onPress={() => onSelectMode(mode.target)}
                style={[
                  styles.modeChip,
                  { backgroundColor: active ? colors.accent : colors.muted },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
                >
                  {mode.label}
                </ThemedText>
              </PressableScale>
            );
          })}
          {onCustom ? (
            <PressableScale
              haptic="light"
              onPress={onCustom}
              style={[styles.modeChip, { backgroundColor: colors.muted }]}
            >
              <ThemedText type="smallBold" themeColor="mutedForeground">
                Custom
              </ThemedText>
            </PressableScale>
          ) : null}
        </View>
      ) : null}

      <PressableScale
        haptic={false}
        onPress={handleTap}
        scaleTo={0.97}
        accessibilityRole="button"
        accessibilityLabel="Count"
        accessibilityValue={{ now: count, min: 0, max: target > 0 ? target : undefined }}
      >
        <CounterRing count={count} target={target} complete={complete} />
      </PressableScale>

      {complete ? (
        <ThemedText type="smallBold" style={{ color: tokens.status.success.color }}>
          MashaAllah — target reached
        </ThemedText>
      ) : (
        <ThemedText type="caption" themeColor="mutedForeground">
          Tap the circle to count
        </ThemedText>
      )}

      <View style={styles.controls}>
        <ControlButton
          icon={{ ios: "minus", android: "remove", web: "remove" }}
          label="Minus"
          onPress={() => {
            triggerHaptic("light");
            onDecrement();
          }}
        />
        <ControlButton
          icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
          label="Reset"
          onPress={() => {
            triggerHaptic("medium");
            onReset();
          }}
        />
      </View>
    </View>
  );
}

function CounterRing({
  count,
  target,
  complete,
}: {
  count: number;
  target: number;
  complete: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const progress = target > 0 ? Math.min(count / target, 1) : 0;
  const deg = progress * 360;
  const fill = complete ? tokens.status.success.color : colors.accent;
  const inset = RING_STROKE;

  return (
    <View style={[styles.ring, { width: RING_SIZE, height: RING_SIZE }]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: RING_SIZE / 2, borderWidth: RING_STROKE, borderColor: tokens.track },
        ]}
      />
      {target > 0 ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: RING_SIZE / 2,
              experimental_backgroundImage: `conic-gradient(${fill} 0deg ${deg}deg, transparent ${deg}deg 360deg)`,
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              top: inset,
              left: inset,
              right: inset,
              bottom: inset,
              borderRadius: RING_SIZE / 2,
              backgroundColor: colors.card,
              ...Shadows.sm,
            }}
          />
        </View>
      ) : null}

      <View style={styles.ringCenter}>
        <ThemedText type="display" style={styles.count}>
          {count}
        </ThemedText>
        {target > 0 ? (
          complete ? (
            <SymbolView
              name={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
              size={22}
              tintColor={fill}
            />
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              of {target}
            </ThemedText>
          )
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground">
            unlimited
          </ThemedText>
        )}
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.control, { backgroundColor: colors.muted, borderColor: tokens.hairline }]}
    >
      <SymbolView name={icon} size={22} tintColor={colors.foreground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: Spacing.four,
  },
  modes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
  },
  modeChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    minWidth: 52,
    alignItems: "center",
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    alignItems: "center",
    gap: Spacing.one,
  },
  count: {
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    gap: Spacing.four,
  },
  control: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
