import type { StyleProp, TextStyle } from "react-native";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";

/**
 * The one count numeral of the zikr / tasbeeh counters (B-65): the ring panel
 * uses `hero`, the session dock and the sticky tasbeeh dock use `compact`.
 */
export type CountNumeralSize = "hero" | "compact";

export function CountNumeral({
  value,
  size = "compact",
  color,
  style,
}: {
  value: number;
  size?: CountNumeralSize;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <ThemedText
      weight="bold"
      style={[size === "hero" ? styles.hero : styles.compact, { color }, style]}
    >
      {value}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  hero: { fontSize: 56, lineHeight: 64, fontVariant: ["tabular-nums"] },
  compact: { fontSize: 32, lineHeight: 38, fontVariant: ["tabular-nums"] },
});
