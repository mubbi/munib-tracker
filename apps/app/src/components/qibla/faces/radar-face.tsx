import { type ReactElement, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { BorderWidth, withAlpha } from "@/constants/theme";

import {
  AlignHalo,
  CardinalLabels,
  DialLayer,
  DialMarker,
  dialFont,
  type FaceColors,
  FaceStage,
  fx,
  KaabaGlyph,
  polar,
  TopPointer,
  useFaceColors,
} from "./shared";
import type { QiblaFaceProps } from "./types";

const SWEEP_MS = 4200;
const PING_MS = 1600;
/** Where the beam rests when motion is reduced (and on thumbnails). */
const STILL_BEAM = 315;

function RadarArt({ size, c }: { size: number; c: FaceColors }) {
  const h = size / 2;
  const r = h - 2;
  const ticks: ReactElement[] = [];
  for (let a = 0; a < 360; a += 10) {
    const p1 = polar(h, r, a);
    const p2 = polar(h, r - size * (a % 30 === 0 ? 0.04 : 0.022), a);
    ticks.push(
      <Line
        key={a}
        x1={fx(p1.x)}
        y1={fx(p1.y)}
        x2={fx(p2.x)}
        y2={fx(p2.y)}
        stroke={withAlpha(c.accent, 0.45)}
        strokeWidth={1}
      />,
    );
  }
  return (
    <Svg width={size} height={size}>
      <Circle cx={h} cy={h} r={fx(r)} fill={c.card} />
      <Circle cx={h} cy={h} r={fx(r)} fill={withAlpha(c.accent, c.isDark ? 0.13 : 0.07)} />
      {[0.25, 0.5, 0.75].map((k) => (
        <Circle
          key={k}
          cx={h}
          cy={h}
          r={fx(r * k)}
          fill="none"
          stroke={withAlpha(c.accent, 0.26)}
          strokeWidth={1}
        />
      ))}
      <Line
        x1={h}
        y1={fx(h - r)}
        x2={h}
        y2={fx(h + r)}
        stroke={withAlpha(c.accent, 0.2)}
        strokeWidth={1}
      />
      <Line
        x1={fx(h - r)}
        y1={h}
        x2={fx(h + r)}
        y2={h}
        stroke={withAlpha(c.accent, 0.2)}
        strokeWidth={1}
      />
      {ticks}
      <Circle
        cx={h}
        cy={h}
        r={fx(r)}
        fill="none"
        stroke={withAlpha(c.accent, 0.6)}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

/** A fading beam: thin wedges trailing anticlockwise behind the leading edge at 12 o'clock. */
function Beam({ size, color }: { size: number; color: string }) {
  const h = size / 2;
  const r = h - 2;
  const wedges: ReactElement[] = [];
  const steps = 12;
  for (let i = 0; i < steps; i++) {
    const a2 = -i * 4;
    const a1 = a2 - 4.4;
    const p1 = polar(h, r, a1);
    const p2 = polar(h, r, a2);
    wedges.push(
      <Path
        key={i}
        d={`M ${fx(h)} ${fx(h)} L ${fx(p1.x)} ${fx(p1.y)} A ${fx(r)} ${fx(r)} 0 0 1 ${fx(p2.x)} ${fx(p2.y)} Z`}
        fill={withAlpha(color, 0.3 * (1 - i / steps))}
      />,
    );
  }
  return (
    <Svg width={size} height={size}>
      {wedges}
      <Line x1={h} y1={h} x2={h} y2={fx(h - r)} stroke={withAlpha(color, 0.85)} strokeWidth={1.5} />
    </Svg>
  );
}

/**
 * Radar: range rings and a sweeping beam; the Kaaba is a pinging contact.
 * The beam and ping are ambient (still under reduced motion and on thumbnails).
 */
export default function RadarFace({
  size,
  bearing,
  hasCompass,
  motion,
  reduceMotion,
  preview,
}: QiblaFaceProps) {
  const c = useFaceColors();
  const animate = !reduceMotion && !preview;
  const sweep = useSharedValue(STILL_BEAM);
  const ping = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(sweep);
      cancelAnimation(ping);
      sweep.value = STILL_BEAM;
      ping.value = 0;
      return;
    }
    sweep.value = 0;
    sweep.value = withRepeat(
      withTiming(360, { duration: SWEEP_MS, easing: Easing.linear }),
      -1,
      false,
    );
    ping.value = withRepeat(
      withTiming(1, { duration: PING_MS, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(sweep);
      cancelAnimation(ping);
    };
  }, [animate, sweep, ping]);

  const beamStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${sweep.value}deg` }] }));
  const pingStyle = useAnimatedStyle(() => ({
    opacity: animate ? 0.7 * (1 - ping.value) : 0,
    transform: [{ scale: 0.7 + ping.value * 1.3 }],
  }));

  const r = size / 2 - 2;
  const fontSize = dialFont(size, 0.048, 7);
  const glyph = Math.round(size * 0.065);
  const blip = Math.round(glyph * 1.6);
  const art = useMemo(() => <RadarArt size={size} c={c} />, [size, c]);
  const beam = useMemo(() => <Beam size={size} color={c.accent} />, [size, c.accent]);

  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        <CardinalLabels
          size={size}
          radius={r - fontSize * 1.7}
          motion={motion}
          fontSize={fontSize}
          northColor={c.accentText}
          color={c.muted}
        />
      </DialLayer>
      <Animated.View
        pointerEvents="none"
        style={[styles.layer, { width: size, height: size }, beamStyle]}
      >
        {beam}
      </Animated.View>
      <DialLayer size={size} motion={motion}>
        <DialMarker size={size} angle={bearing} radius={r * 0.6} box={blip * 2} motion={motion}>
          <Animated.View
            style={[
              styles.ping,
              { width: blip, height: blip, borderRadius: blip / 2, borderColor: c.accent },
              pingStyle,
            ]}
          />
          <View
            style={[
              styles.blip,
              {
                width: blip,
                height: blip,
                borderRadius: blip / 2,
                backgroundColor: c.card,
                borderColor: c.accent,
              },
            ]}
          >
            <KaabaGlyph size={glyph} />
          </View>
        </DialMarker>
      </DialLayer>
      <View pointerEvents="none" style={[styles.center, { width: size, height: size }]}>
        <View
          style={{
            width: Math.max(4, size * 0.02),
            height: Math.max(4, size * 0.02),
            borderRadius: size,
            backgroundColor: c.accent,
          }}
        />
      </View>
      {hasCompass ? (
        <TopPointer size={size} width={14} height={10} top={0} color={c.accent} />
      ) : null}
    </FaceStage>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    start: 0,
  },
  center: {
    position: "absolute",
    top: 0,
    start: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ping: {
    position: "absolute",
    borderWidth: BorderWidth.thick,
  },
  blip: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BorderWidth.thick,
  },
});
