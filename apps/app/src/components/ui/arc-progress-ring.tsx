import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Shadows } from "@/constants/theme";
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
  const deg = clamped * 360;
  const inset = stroke;
  const innerSize = size - inset * 2;
  const innerRadius = innerSize / 2;

  if (Platform.OS === "web") {
    return (
      <View style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }, style]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: size / 2 },
            // The unfilled arc uses the track color (not transparent) so the full
            // ring reads as a light "disabled" circle behind the progress sweep,
            // matching the native SVG track below.
            gradientBackground(
              `conic-gradient(${fillColor} 0deg ${deg}deg, ${trackColor} ${deg}deg 360deg)`,
            ),
          ]}
        >
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
        </View>
      </View>
    );
  }

  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }, style]}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        {clamped > 0 ? (
          <Circle
            cx={cx}
            cy={cx}
            r={radius}
            stroke={fillColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${cx}, ${cx}`}
          />
        ) : null}
      </Svg>
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
    </View>
  );
}
