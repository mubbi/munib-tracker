import { type ReactElement, useMemo } from "react";
import Svg, { Circle, G, Line, Path, Polygon } from "react-native-svg";

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

function geometry(size: number) {
  const half = size / 2;
  const bandOut = half - size * 0.02;
  const bandIn = half - size * 0.13;
  const archBase = bandIn - size * 0.035;
  const archTop = bandOut - size * 0.004;
  return {
    half,
    bandOut,
    bandIn,
    bandMid: (bandOut + bandIn) / 2,
    starR: bandIn * 0.8,
    archBase,
    archTop,
    kaabaR: archBase + (archTop - archBase) * 0.42,
  };
}

/** A square of the eight-pointed star, corners at `start`, `start + 90`, … */
function square(center: number, r: number, start: number): string {
  return [0, 90, 180, 270]
    .map((d) => polar(center, r, start + d))
    .map((p) => `${fx(p.x)},${fx(p.y)}`)
    .join(" ");
}

function MihrabArt({ size, bearing, c }: { size: number; bearing: number; c: FaceColors }) {
  const g = geometry(size);
  const h = g.half;
  const bw = g.bandOut - g.bandIn;

  // Band: alternating diamonds — a simple zellige-like border.
  const band: ReactElement[] = [];
  for (let i = 0; i < 32; i++) {
    const a = i * 11.25;
    const p = [
      polar(h, g.bandMid + bw * 0.36, a),
      polar(h, g.bandMid, a + 3.6),
      polar(h, g.bandMid - bw * 0.36, a),
      polar(h, g.bandMid, a - 3.6),
    ];
    band.push(
      <Polygon
        key={a}
        points={p.map((q) => `${fx(q.x)},${fx(q.y)}`).join(" ")}
        fill={i % 2 === 0 ? withAlpha(c.accent, 0.55) : c.accentBorder}
      />,
    );
  }

  // The mihrab: a pointed arch on the rim, its niche open toward the centre.
  const w = size * 0.135;
  const yb = h - g.archBase;
  const yt = h - g.archTop;
  const tall = yb - yt;
  const spring = yb - tall * 0.42;
  const arch = (inset: number) => {
    const x1 = h - w / 2 + inset;
    const x2 = h + w / 2 - inset;
    const top = yt + inset * 1.4;
    return [
      `M ${fx(x1)} ${fx(yb)}`,
      `L ${fx(x1)} ${fx(spring)}`,
      `Q ${fx(x1)} ${fx(top + tall * 0.14)} ${fx(h)} ${fx(top)}`,
      `Q ${fx(x2)} ${fx(top + tall * 0.14)} ${fx(x2)} ${fx(spring)}`,
      `L ${fx(x2)} ${fx(yb)} Z`,
    ].join(" ");
  };
  const lineFrom = polar(h, g.starR * 0.42, bearing);
  const lineTo = polar(h, g.archBase, bearing);

  return (
    <Svg width={size} height={size}>
      <Circle cx={h} cy={h} r={fx(h - 1)} fill={c.card} stroke={c.accentBorder} strokeWidth={1.5} />
      <Circle
        cx={h}
        cy={h}
        r={fx(g.bandMid)}
        fill="none"
        stroke={withAlpha(c.accent, 0.1)}
        strokeWidth={fx(bw)}
      />
      <Circle
        cx={h}
        cy={h}
        r={fx(g.bandOut)}
        fill="none"
        stroke={withAlpha(c.accent, 0.5)}
        strokeWidth={1}
      />
      <Circle
        cx={h}
        cy={h}
        r={fx(g.bandIn)}
        fill="none"
        stroke={withAlpha(c.accent, 0.5)}
        strokeWidth={1}
      />
      {band}
      {/* Interlaced eight-pointed star (two squares) with a medallion. */}
      <Polygon points={square(h, g.starR, 0)} fill={withAlpha(c.accent, 0.12)} />
      <Polygon points={square(h, g.starR, 45)} fill={withAlpha(c.accent, 0.12)} />
      <Polygon points={square(h, g.starR, 0)} fill="none" stroke={c.accent} strokeWidth={1.6} />
      <Polygon points={square(h, g.starR, 45)} fill="none" stroke={c.accent} strokeWidth={1.6} />
      <Circle
        cx={h}
        cy={h}
        r={fx(g.starR * 0.56)}
        fill={c.card}
        stroke={c.accent}
        strokeWidth={1.2}
      />
      <Polygon
        points={square(h, g.starR * 0.4, 0)}
        fill={withAlpha(c.accent, 0.22)}
        stroke={c.accent}
        strokeWidth={0.9}
      />
      <Polygon
        points={square(h, g.starR * 0.4, 45)}
        fill={withAlpha(c.accent, 0.22)}
        stroke={c.accent}
        strokeWidth={0.9}
      />
      <Line
        x1={fx(lineFrom.x)}
        y1={fx(lineFrom.y)}
        x2={fx(lineTo.x)}
        y2={fx(lineTo.y)}
        stroke={c.accent}
        strokeWidth={2}
        strokeDasharray="1 4"
        strokeLinecap="round"
      />
      <Circle cx={h} cy={h} r={fx(size * 0.018)} fill={c.accent} />
      <G transform={`rotate(${fx(bearing)} ${fx(h)} ${fx(h)})`}>
        <Path d={arch(0)} fill={c.accent} stroke={c.card} strokeWidth={1.5} />
        <Path d={arch(w * 0.16)} fill={c.card} />
      </G>
    </Svg>
  );
}

/**
 * Mihrab: an interlaced eight-pointed star inside a zellige border; the qibla
 * is a mihrab arch on the rim with the Kaaba in its niche.
 */
export default function MihrabFace({ size, bearing, hasCompass, motion }: QiblaFaceProps) {
  const c = useFaceColors();
  const g = geometry(size);
  const fontSize = dialFont(size, 0.048, 7);
  const art = useMemo(() => <MihrabArt size={size} bearing={bearing} c={c} />, [size, bearing, c]);
  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        <CardinalLabels
          size={size}
          radius={g.starR * 0.76}
          motion={motion}
          fontSize={fontSize}
          northColor={c.accentText}
          color={c.foreground}
        />
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={g.kaabaR}
          glyph={Math.round(size * 0.068)}
          motion={motion}
        />
      </DialLayer>
      {hasCompass ? (
        <TopPointer size={size} width={14} height={10} top={0} color={c.accent} />
      ) : null}
    </FaceStage>
  );
}
