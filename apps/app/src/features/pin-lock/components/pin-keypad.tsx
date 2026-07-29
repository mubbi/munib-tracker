import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { PIN_LENGTH } from "@/features/pin-lock/lib/pin-crypto";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const KEYPAD_ROWS: { id: string; keys: string[] }[] = [
  { id: "row-123", keys: ["1", "2", "3"] },
  { id: "row-456", keys: ["4", "5", "6"] },
  { id: "row-789", keys: ["7", "8", "9"] },
  { id: "row-0back", keys: ["", "0", "back"] },
];

const PIN_DOT_KEYS = ["dot-1", "dot-2", "dot-3", "dot-4", "dot-5", "dot-6"] as const;

const KEYPAD_COLS = 3;
const HORIZONTAL_PADDING = Spacing.five * 2;
const MAX_KEYPAD_WIDTH = 340;
const MIN_KEY_SIZE = 68;
const MAX_KEY_SIZE = 84;
const KEY_GAP = Spacing.three;

function useKeypadMetrics() {
  const { width: screenWidth } = useWindowDimensions();

  return useMemo(() => {
    const keypadWidth = Math.min(screenWidth - HORIZONTAL_PADDING, MAX_KEYPAD_WIDTH);
    const keySize = Math.min(
      MAX_KEY_SIZE,
      Math.max(MIN_KEY_SIZE, Math.floor((keypadWidth - KEY_GAP * (KEYPAD_COLS - 1)) / KEYPAD_COLS)),
    );
    const rowWidth = keySize * KEYPAD_COLS + KEY_GAP * (KEYPAD_COLS - 1);
    return { keySize, rowWidth, gap: KEY_GAP };
  }, [screenWidth]);
}

interface PinKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PinKeypad({
  onDigit,
  onBackspace,
  disabled = false,
  loading = false,
}: PinKeypadProps) {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const { keySize, rowWidth, gap } = useKeypadMetrics();

  const keyStyle = {
    width: keySize,
    height: keySize,
    borderRadius: keySize / 2,
  };

  if (loading) {
    return (
      <View style={[styles.loadingSlot, { minHeight: keySize * 4 + gap * 3 }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.keypad, { width: rowWidth, opacity: disabled ? 0.5 : 1 }]}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View
          key={row.id}
          style={[
            styles.keypadRow,
            { gap, marginBottom: rowIndex < KEYPAD_ROWS.length - 1 ? gap : 0 },
          ]}
        >
          {row.keys.map((key) => {
            if (key === "back") {
              return (
                <PressableScale
                  key={`${row.id}-back`}
                  onPress={onBackspace}
                  disabled={disabled}
                  haptic="selection"
                  accessibilityLabel={t("pinLock.backspace")}
                  style={[styles.key, keyStyle, { backgroundColor: colors.muted }]}
                >
                  <ThemedText type="title">⌫</ThemedText>
                </PressableScale>
              );
            }

            if (!key) {
              return <View key={`${row.id}-spacer`} style={[styles.keySpacer, keyStyle]} />;
            }

            return (
              <PressableScale
                key={`${row.id}-${key}`}
                onPress={() => onDigit(key)}
                disabled={disabled}
                haptic="selection"
                accessibilityLabel={key}
                style={[styles.key, keyStyle, { backgroundColor: colors.muted }]}
              >
                <ThemedText type="title">{key}</ThemedText>
              </PressableScale>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function PinDotsRow({
  filledCount,
  isLoading = false,
  hasError = false,
}: {
  filledCount: number;
  isLoading?: boolean;
  hasError?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.dotsRow}>
      {PIN_DOT_KEYS.map((dotKey, index) => {
        const filled = index < filledCount;
        return (
          <View
            key={dotKey}
            style={[
              styles.dot,
              {
                backgroundColor: isLoading || filled ? colors.accent : "transparent",
                borderColor: hasError && !isLoading ? tokens.status.danger.color : colors.border,
                opacity: isLoading ? 0.45 + (index / PIN_LENGTH) * 0.55 : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    alignSelf: "center",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
  },
  keySpacer: {
    opacity: 0,
  },
  loadingSlot: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.three,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
});
