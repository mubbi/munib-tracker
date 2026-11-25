import { type ReactElement, useMemo } from "react";
import Svg, { Circle, G, Line, Polygon } from "react-native-svg";

import { withAlpha } from "@/constants/theme";

import {
  AlignHalo,
  CardinalLabels,
  DialLayer,
  dialFont,
  type FaceColors,
  FaceStage,
  fx,
  KaabaMarker,
  polar,
  TopPointer,
  useFaceColors,
} from "./shared";
import type { QiblaFaceProps } from "./types";

type Point = { x: number; y: number };
const pts = (...p: Point[]) => p.map((q) => `${fx(q.x)},${fx(q.y)}`).join(" ");

/** One rose point as two shaded halves (the classic chart-rose bevel). */
function rosePoint(
  center: number,
  angle: number,
  tip: number,
  base: number,
  spread: number,
  dark: string,
  light: string,
): ReactElement {
  const o = { x: center, y: center };
  const t = polar(center, tip, angle);
  const l = polar(center, base, angle - spread);
  const r = polar(center, base, angle + spread);
  return (
    <G key={angle}>
      <Polygon points={pts(o, t, l)} fill={light} />
      <Polygon points={pts(o, t, r)} fill={dark} />
    </G>
  );
}

function MarinerArt({
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
  const half = size / 2;
  const bezel = half - 1;
  const scaleOut = half - size * 0.035;
  const scaleIn = half - size * 0.085;
  const roseTip = scaleIn - size * (preview ? 0.07 : 0.115);

  const ticks: ReactElement[] = [];
  for (let a = 0; a < 360; a += 5) {
    const major = a % 10 === 0;
    const p1 = polar(half, scaleOut, a);
    const p2 = polar(half, major ? scaleIn : scaleOut - (scaleOut - scaleIn) * 0.5, a);
    ticks.push(
      <Line
        key={a}
        x1={fx(p1.x)}
        y1={fx(p1.y)}
        x2={fx(p2.x)}
        y2={fx(p2.y)}
        stroke={withAlpha(c.foreground, major ? 0.55 : 0.3)}
        strokeWidth={major ? 1.2 : 0.8}
      />,
    );
  }

  const ink = c.foreground;
  const rose: ReactElement[] = [];
  // Smallest points first so the cardinals sit on top.
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5;
    if (a % 45 === 0) continue;
    rose.push(
      rosePoint(
        half,
        a,
        roseTip * 0.46,
        roseTip * 0.1,
        11,
        withAlpha(ink, 0.45),
        withAlpha(ink, 0.12),
      ),
    );
  }
  for (const a of [45, 135, 225, 315]) {
    rose.push(
      rosePoint(
        half,
        a,
        roseTip * 0.68,
        roseTip * 0.12,
        22,
        withAlpha(ink, 0.6),
        withAlpha(ink, 0.16),
      ),
    );
  }
  for (const a of [0, 90, 180, 270]) {
    const north = a === 0;
    rose.push(
      rosePoint(
        half,
        a,
        roseTip,
        roseTip * 0.15,
        45,
        north ? c.accent : withAlpha(ink, 0.82),
        north ? withAlpha(c.accent, 0.4) : withAlpha(ink, 0.2),
      ),
    );
  }

  const ray = polar(half, scaleIn - size * 0.01, bearing);
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={half}
        cy={half}
        r={bezel}
        fill={c.surface}
        stroke={c.hairline}
        strokeWidth={1.5}
      />
      <Circle
        cx={half}
        cy={half}
        r={scaleOut}
        fill="none"
        stroke={withAlpha(ink, 0.4)}
        strokeWidth={1}
      />
      <Circle
        cx={half}
        cy={half}
        r={scaleIn}
        fill={c.card}
        stroke={withAlpha(ink, 0.4)}
        strokeWidth={1}
      />
      {ticks}
      <Circle
        cx={half}
        cy={half}
        r={fx(roseTip * 0.55)}
        fill="none"
        stroke={withAlpha(ink, 0.18)}
        strokeWidth={0.8}
      />
      {rose}
      <Line
        x1={half}
        y1={half}
        x2={fx(ray.x)}
        y2={fx(ray.y)}
        stroke={c.accent}
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <Circle
        cx={half}
        cy={half}
        r={fx(size * 0.028)}
        fill={c.card}
        stroke={c.accent}
        strokeWidth={2}
      />
    </Svg>
  );
}

/**
 * Mariner: a sailor's chart rose — sixteen bevelled points, a five-degree
 * scale and a dashed course line to the Kaaba on the rim.
 */
export default function MarinerFace({
  size,
  bearing,
  hasCompass,
  motion,
  preview,
}: QiblaFaceProps) {
  const c = useFaceColors();
  const half = size / 2;
  const scaleOut = half - size * 0.035;
  const scaleIn = half - size * 0.085;
  const fontSize = dialFont(size, 0.05, 7);
  const art = useMemo(
    () => <MarinerArt size={size} bearing={bearing} c={c} preview={preview} />,
    [size, bearing, c, preview],
  );
  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        <CardinalLabels
          size={size}
          radius={scaleIn - fontSize * 1.3}
          motion={motion}
          fontSize={fontSize}
          northColor={c.accentText}
          color={c.foreground}
        />
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={(scaleOut + scaleIn) / 2}
          glyph={Math.round(size * 0.065)}
          motion={motion}
          badge={c.card}
          badgeBorder={c.accent}
        />
      </DialLayer>
      {hasCompass ? (
        <TopPointer size={size} width={14} height={10} top={0} color={c.accent} />
      ) : null}
    </FaceStage>
  );
}
