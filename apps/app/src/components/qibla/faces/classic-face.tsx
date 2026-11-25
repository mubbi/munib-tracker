import { Platform, StyleSheet, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";

import { QiblaNeedle } from "@/components/qibla/qibla-needle";
import { BorderWidth, Spacing, withAlpha } from "@/constants/theme";

import {
  angleGap,
  CardinalLabels,
  dialFont,
  FaceStage,
  fx,
  KaabaMarker,
  polar,
  TopPointer,
  useDialStyle,
  useFaceColors,
  useNeedleStyle,
} from "./shared";
import type { QiblaFaceProps } from "./types";

const ORDINALS = [45, 135, 225, 315];

/**
 * Classic (default): the original dial — soft double ring that glows as you
 * align, ordinal ticks, upright cardinals and a Kaaba badge on the rim.
 */
export function ClassicFace({ size, bearing, hasCompass, motion, preview }: QiblaFaceProps) {
  const c = useFaceColors();
  const dialStyle = useDialStyle(motion);
  const needleStyle = useNeedleStyle(motion);

  const ringGap = Math.round(size * 0.07);
  const dialSize = size - ringGap;
  const half = dialSize / 2;
  const rimInset = Math.max(Spacing.one, Math.round(dialSize * 0.035));
  const tick = Math.round(dialSize * 0.042);
  const fontSize = dialFont(dialSize, 0.044, 8);
  const lineHeight = Math.round(fontSize * 1.25);
  const labelRadius = half - rimInset - tick - (preview ? 2 : Spacing.two) - lineHeight / 2;
  const kaaba = Math.round(dialSize * 0.075);
  const backdrop = withAlpha(c.card, c.isDark ? 0.92 : 0.96);

  const hairline = c.hairline;
  const accent = c.accent;
  const isWeb = Platform.OS === "web";
  const glowPeak = withAlpha(accent, 0.35);
  const glowBase = withAlpha(accent, 0);
  const ringStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(motion.glow.value, [0, 1], [hairline, accent]),
    ...(isWeb
      ? {
          boxShadow: `0px 0px 18px ${interpolateColor(motion.glow.value, [0, 1], [glowBase, glowPeak])}`,
        }
      : {
          shadowColor: accent,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 18,
          shadowOpacity: motion.glow.value * 0.35,
        }),
  }));

  return (
    <FaceStage size={size}>
      <Animated.View
        style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }, ringStyle]}
      >
        <View
          style={[
            styles.dial,
            {
              width: dialSize,
              height: dialSize,
              borderRadius: half,
              borderColor: c.hairline,
              backgroundColor: withAlpha(c.card, c.isDark ? 0.55 : 0.72),
            },
          ]}
        >
          {/* Full dial box (incl. its border) so the pivot is the true centre. */}
          <Animated.View
            style={[styles.dialLayer, { width: dialSize, height: dialSize }, dialStyle]}
          >
            <Svg width={dialSize} height={dialSize}>
              {ORDINALS.map((angle) => {
                const a = polar(half, half - rimInset, angle);
                const b = polar(half, half - rimInset - tick, angle);
                return (
                  <Line
                    key={angle}
                    x1={fx(a.x)}
                    y1={fx(a.y)}
                    x2={fx(b.x)}
                    y2={fx(b.y)}
                    stroke={c.accentBorder}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                );
              })}
            </Svg>
            <CardinalLabels
              size={dialSize}
              radius={labelRadius}
              motion={motion}
              fontSize={fontSize}
              northColor={c.accentText}
              color={c.muted}
              backdrop={backdrop}
              skip={(angle) => angleGap(angle, bearing) < 22}
            />
            <KaabaMarker
              size={dialSize}
              bearing={bearing}
              radius={labelRadius}
              glyph={kaaba}
              motion={motion}
              badge={backdrop}
              badgeBorder={c.accentBorder}
            />
          </Animated.View>
          {hasCompass ? null : (
            <Animated.View style={needleStyle}>
              <QiblaNeedle size={Math.round(dialSize * 0.26)} color={c.accent} />
            </Animated.View>
          )}
        </View>
        {hasCompass ? (
          <TopPointer size={size} width={16} height={12} top={2} color={c.accent} direction="up" />
        ) : null}
      </Animated.View>
    </FaceStage>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BorderWidth.thick,
    borderCurve: "continuous",
  },
  dial: {
    borderWidth: BorderWidth.thick,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dialLayer: {
    position: "absolute",
    top: -BorderWidth.thick,
    start: -BorderWidth.thick,
  },
});
