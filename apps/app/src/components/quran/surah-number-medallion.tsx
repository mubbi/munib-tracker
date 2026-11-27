import { StyleSheet, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * The surah number inside an eight-point star (two overlapping squares — the
 * classic khatam motif used for ayah / surah markers). Decorative: the row's
 * accessibility label already announces the number.
 */
export function SurahNumberMedallion({
  number,
  size = 42,
  highlighted = false,
}: {
  number: number;
  size?: number;
  /** Continue-reading / selected row: filled star. */
  highlighted?: boolean;
}) {
  const { tokens } = useThemeTokens();
  const box = tvDp(size);
  // Two squares of the same size, one turned 45°. Corners are computed directly
  // (no SVG transform — react-native-svg emits a raw `transform-origin` attribute
  // on web, which React DOM rejects). Half-diagonal ≈ 0.46 of the box keeps both
  // inside it with room for the stroke.
  const c = box / 2;
  const r = box * 0.46; // centre → corner
  const h = r / Math.SQRT2; // centre → side of the upright square
  const square = [
    [c - h, c - h],
    [c + h, c - h],
    [c + h, c + h],
    [c - h, c + h],
  ];
  const diamond = [
    [c, c - r],
    [c + r, c],
    [c, c + r],
    [c - r, c],
  ];
  const points = (pts: number[][]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
  const stroke = tokens.accentBorder;
  const fill = highlighted ? tokens.accentSoft : "transparent";

  return (
    <View
      style={[styles.root, { width: box, height: box }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={box} height={box} style={StyleSheet.absoluteFill}>
        <Polygon
          points={points(square)}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        <Polygon
          points={points(diamond)}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
      </Svg>
      <ThemedText
        type="caption"
        maxFontSizeMultiplier={1.2}
        style={[styles.number, { color: tokens.accentOnSoft }]}
      >
        {number}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center" },
  number: { fontVariant: ["tabular-nums"], fontWeight: "700" },
});
