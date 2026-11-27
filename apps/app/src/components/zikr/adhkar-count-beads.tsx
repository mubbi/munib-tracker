import { StyleSheet, View } from "react-native";

import { withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ltrControlViewProps } from "@/lib/rtl";

/** Largest target drawn as beads — beyond this a number reads faster than dots. */
export const MAX_BEADS = 12;

/** Whether a repetition target is small enough to draw as beads (2…12). */
export function showsBeads(target: number): boolean {
  return target >= 2 && target <= MAX_BEADS;
}

/**
 * Prayer-bead dots for small repetition counts (×3, ×7, ×10): one bead per
 * recitation, filled as you count — progress you can feel at a glance without
 * reading a number.
 */
export function AdhkarCountBeads({
  count,
  target,
  color,
  size = 10,
}: {
  count: number;
  target: number;
  color: string;
  size?: number;
}) {
  const { tokens } = useThemeTokens();
  if (!showsBeads(target)) return null;
  const bead = tvDp(size);
  return (
    <View
      {...ltrControlViewProps()}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.row, ltrControlViewProps().style, { gap: bead * 0.6 }]}
    >
      {Array.from({ length: target }, (_, i) => {
        const filled = i < count;
        return (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length bead row
            key={i}
            style={{
              width: bead,
              height: bead,
              borderRadius: bead / 2,
              backgroundColor: filled ? color : withAlpha(color, tokens.isDark ? 0.22 : 0.16),
              borderWidth: filled ? 0 : StyleSheet.hairlineWidth,
              borderColor: withAlpha(color, 0.45),
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
});
