import { type ReactElement, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

import { withAlpha } from "@/constants/theme";

import {
  AlignHalo,
  angleGap,
  CardinalLabels,
  DialLayer,
  DialText,
  dialFont,
  type FaceColors,
  FaceStage,
  fx,
  KaabaMarker,
  polar,
  useDialNumber,
  useFaceColors,
} from "./shared";
import type { QiblaFaceProps } from "./types";

function geometry(size: number) {
  const half = size / 2;
  const tickOut = half - size * 0.03;
  return {
    half,
    tickOut,
    numeralR: tickOut - size * 0.115,
    cardinalR: tickOut - size * 0.215,
    kaabaR: tickOut - size * 0.115,
  };
}

function PrecisionArt({
  size,
  bearing,
  c,
  preview,
}: {
  size: number;
  bearing: number;
  c: FaceColors;
  preview?: boolean;
}) {
  const g = geometry(size);
  const step = preview ? 10 : 2;
  const ticks: ReactElement[] = [];
  for (let a = 0; a < 360; a += step) {
    const kind = a % 30 === 0 ? 2 : a % 10 === 0 ? 1 : 0;
    const len = size * [0.025, 0.045, 0.062][kind];
    const p1 = polar(g.half, g.tickOut, a);
    const p2 = polar(g.half, g.tickOut - len, a);
    ticks.push(
      <Line
        key={a}
        x1={fx(p1.x)}
        y1={fx(p1.y)}
        x2={fx(p2.x)}
        y2={fx(p2.y)}
        stroke={kind === 0 ? withAlpha(c.foreground, 0.38) : c.foreground}
        strokeOpacity={kind === 1 ? 0.75 : 1}
        strokeWidth={[0.9, 1.4, 2.2][kind]}
      />,
    );
  }
  // Qibla wedge on the scale + a hairline from the centre.
  const tip = polar(g.half, g.tickOut - size * 0.07, bearing);
  const w1 = polar(g.half, g.tickOut + size * 0.012, bearing - 3.2);
  const w2 = polar(g.half, g.tickOut + size * 0.012, bearing + 3.2);
  const line = polar(g.half, g.kaabaR - size * 0.06, bearing);
  return (
    <Svg width={size} height={size}>
      <Circle cx={g.half} cy={g.half} r={g.half - 1} fill={withAlpha(c.card, 0.78)} />
      {ticks}
      <Line
        x1={g.half}
        y1={g.half}
        x2={fx(line.x)}
        y2={fx(line.y)}
        stroke={c.accent}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Polygon
        points={`${fx(w1.x)},${fx(w1.y)} ${fx(w2.x)},${fx(w2.y)} ${fx(tip.x)},${fx(tip.y)}`}
        fill={c.accent}
      />
    </Svg>
  );
}

/**
 * Precision: an instrument scale — a tick every two degrees, numbered every
 * 30°, a fixed crosshair and a thick lubber line, with the qibla as an accent
 * wedge on the scale.
 */
export default function PrecisionFace({
  size,
  bearing,
  hasCompass,
  aligned,
  motion,
  preview,
}: QiblaFaceProps) {
  const c = useFaceColors();
  const num = useDialNumber();
  const g = geometry(size);
  const numeralFont = dialFont(size, 0.04, 6);
  const art = useMemo(
    () => <PrecisionArt size={size} bearing={bearing} c={c} preview={preview} />,
    [size, bearing, c, preview],
  );
  const numerals = useMemo(() => {
    if (preview) return [];
    const out: number[] = [];
    for (let a = 30; a < 360; a += 30) {
      if (a % 90 !== 0 && angleGap(a, bearing) > 14) out.push(a);
    }
    return out;
  }, [preview, bearing]);
  const cross = size * 0.16;
  const lubberColor = aligned ? c.accent : c.foreground;

  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        {numerals.map((a) => (
          <DialText
            key={a}
            size={size}
            angle={a}
            radius={g.numeralR}
            motion={motion}
            text={num(a)}
            color={c.muted}
            fontSize={numeralFont}
          />
        ))}
        <CardinalLabels
          size={size}
          radius={preview ? g.numeralR : g.cardinalR}
          motion={motion}
          fontSize={dialFont(size, 0.062, 8)}
          northColor={c.accentText}
          color={c.foreground}
          skip={(a) => angleGap(a, bearing) < 12}
        />
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={g.kaabaR}
          glyph={Math.round(size * 0.07)}
          motion={motion}
        />
      </DialLayer>
      <View pointerEvents="none" style={[styles.fixed, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Line
            x1={fx(g.half - cross)}
            y1={g.half}
            x2={fx(g.half + cross)}
            y2={g.half}
            stroke={withAlpha(c.foreground, 0.35)}
            strokeWidth={1}
          />
          <Line
            x1={g.half}
            y1={fx(g.half - cross)}
            x2={g.half}
            y2={fx(g.half + cross)}
            stroke={withAlpha(c.foreground, 0.35)}
            strokeWidth={1}
          />
          <Circle cx={g.half} cy={g.half} r={fx(Math.max(2, size * 0.012))} fill={c.foreground} />
          {hasCompass ? (
            <Line
              x1={g.half}
              y1={0}
              x2={g.half}
              y2={fx(size * 0.1)}
              stroke={lubberColor}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
          ) : null}
        </Svg>
      </View>
    </FaceStage>
  );
}

const styles = StyleSheet.create({
  fixed: {
    position: "absolute",
    top: 0,
    start: 0,
  },
});
