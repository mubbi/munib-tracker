import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { Shadows } from "@/constants/theme";
import {
  chartCoordinateStyle,
  progressRingArcPath,
  progressRingConicGradient,
  progressSweepRtl,
} from "@/lib/chart-rtl";
import { gradientBackground } from "@/lib/gradient";

type ArcProgressRingProps = {
  size: number;
  stroke: number;
  /** Progress from 0 to 1. */
  progress: number;
  fillColor: string;
  trackColor: string;
  /** Color punched out of the ring centre. */
  surfaceColor: string;
  /** Optional shadow on the inner surface disc (tasbeeh counter). */
  surfaceShadow?: boolean;
  style?: ViewStyle;
};

/**
 * Circular progress arc. Web uses a CSS conic gradient; native draws an SVG
 * stroke arc because React Native only supports linear/radial gradients in
 * `backgroundImage`, not conic.
 */
export function ArcProgressRing({
  size,
  stroke,
  progress,
  fillColor,
  trackColor,
  surfaceColor,
  surfaceShadow = false,
  style,
}: ArcProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const inset = stroke;
  const innerSize = size - inset * 2;
  const innerRadius = innerSize / 2;
  const rtl = progressSweepRtl();
  const innerDisc = (
    <View
      style={[
        {
          position: "absolute",
          top: inset,
          left: inset,
          width: innerSize,
          height: innerSize,
          borderRadius: innerRadius,
          backgroundColor: surfaceColor,
        },
        surfaceShadow ? Shadows.sm : null,
      ]}
    />
  );

  if (Platform.OS === "web") {
    return (
      <View
        style={[StyleSheet.absoluteFill, chartCoordinateStyle, { borderRadius: size / 2 }, style]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: size / 2 },
            gradientBackground(progressRingConicGradient(fillColor, trackColor, clamped, rtl)),
          ]}
        />
        {innerDisc}
      </View>
    );
  }

  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const arcPath = progressRingArcPath(cx, cx, radius, clamped, rtl);

  return (
    <View style={[StyleSheet.absoluteFill, chartCoordinateStyle, { pointerEvents: "none" }, style]}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        {arcPath ? (
          <Path
            d={arcPath}
            stroke={fillColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}
      </Svg>
      {innerDisc}
    </View>
  );
}
