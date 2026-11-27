import { type ReactElement, useMemo } from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { QiblaInstrument as Q, withAlpha } from "@/constants/theme";

import {
  AlignHalo,
  angleGap,
  CardinalLabels,
  DialLayer,
  DialText,
  dialFont,
  FaceStage,
  fx,
  KaabaMarker,
  polar,
  TopPointer,
  useDialNumber,
  useSvgId,
} from "./shared";
import type { QiblaFaceProps } from "./types";

function geometry(size: number) {
  const half = size / 2;
  const rim = half - 1;
  const bandOut = half - size * 0.025;
  const bandIn = half - size * 0.13;
  return { half, rim, bandOut, bandIn, bandMid: (bandOut + bandIn) / 2 };
}

/** Engraving ink at a given strength (always dark on brass, in any scheme). */
const ink = (a: number) => withAlpha(Q.engraving, a);

function AstrolabeArt({
  size,
  bearing,
  preview,
  uid,
}: {
  size: number;
  bearing: number;
  preview?: boolean;
  /** Unique per instance: SVG ids are document-global on web. */
  uid: string;
}) {
  const g = geometry(size);
  const h = g.half;

  const ticks: ReactElement[] = [];
  for (let a = 0; a < 360; a += preview ? 10 : 5) {
    const major = a % 15 === 0;
    const p1 = polar(h, g.bandOut, a);
    const p2 = polar(h, major ? g.bandOut - size * 0.03 : g.bandOut - size * 0.018, a);
    ticks.push(
      <Line
        key={a}
        x1={fx(p1.x)}
        y1={fx(p1.y)}
        x2={fx(p2.x)}
        y2={fx(p2.y)}
        stroke={ink(major ? 0.75 : 0.5)}
        strokeWidth={major ? 1.2 : 0.8}
      />,
    );
  }

  // Almucantars: circles of equal altitude, crowding toward the zenith above
  // the plate centre (stereographic look), clipped to the plate.
  const almucantars: ReactElement[] = [];
  for (let k = 0; k < 6; k++) {
    const r = g.bandIn * (0.95 - k * 0.14);
    const cy = h - g.bandIn * (0.08 + k * 0.07);
    almucantars.push(
      <Circle
        key={k}
        cx={h}
        cy={fx(cy)}
        r={fx(r)}
        fill="none"
        stroke={ink(0.28)}
        strokeWidth={0.8}
      />,
    );
  }

  // Rete star pointers: small flames around a ring.
  const pointers: ReactElement[] = [];
  const reteR = g.bandIn * 0.74;
  for (let i = 0; i < 8; i++) {
    const a = 22.5 + i * 45;
    const base = polar(h, reteR, a);
    const tip = polar(h, reteR + size * 0.05, a + 9);
    const side = polar(h, reteR + size * 0.012, a - 6);
    pointers.push(
      <Path
        key={a}
        d={`M ${fx(base.x)} ${fx(base.y)} Q ${fx(side.x)} ${fx(side.y)} ${fx(tip.x)} ${fx(tip.y)} Z`}
        fill={ink(0.7)}
      />,
    );
  }

  // Alidade (the sighting rule) along the qibla bearing, pointed at the Kaaba.
  const len = g.bandIn - size * 0.02;
  const w = size * 0.034;
  const vane = size * 0.05;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={`brass${uid}`} cx="42%" cy="36%" r="70%">
          <Stop offset="0" stopColor={Q.brassLight} />
          <Stop offset="0.55" stopColor={Q.brass} />
          <Stop offset="1" stopColor={Q.brassDeep} />
        </RadialGradient>
        <RadialGradient id={`plate${uid}`} cx="50%" cy="45%" r="60%">
          <Stop offset="0" stopColor={Q.brassLight} />
          <Stop offset="1" stopColor={Q.brass} />
        </RadialGradient>
        <ClipPath id={`clip${uid}`}>
          <Circle cx={h} cy={h} r={fx(g.bandIn)} />
        </ClipPath>
      </Defs>
      <Circle
        cx={h}
        cy={h}
        r={fx(g.rim)}
        fill={`url(#brass${uid})`}
        stroke={ink(0.6)}
        strokeWidth={1.2}
      />
      <Circle cx={h} cy={h} r={fx(g.bandOut)} fill="none" stroke={ink(0.55)} strokeWidth={0.9} />
      {ticks}
      <Circle
        cx={h}
        cy={h}
        r={fx(g.bandIn)}
        fill={`url(#plate${uid})`}
        stroke={ink(0.65)}
        strokeWidth={1.2}
      />
      <G clipPath={`url(#clip${uid})`}>
        {almucantars}
        <Line
          x1={h}
          y1={fx(h - g.bandIn)}
          x2={h}
          y2={fx(h + g.bandIn)}
          stroke={ink(0.35)}
          strokeWidth={0.8}
        />
        <Line
          x1={fx(h - g.bandIn)}
          y1={h}
          x2={fx(h + g.bandIn)}
          y2={h}
          stroke={ink(0.35)}
          strokeWidth={0.8}
        />
      </G>
      <Circle cx={h} cy={h} r={fx(reteR)} fill="none" stroke={ink(0.6)} strokeWidth={1.4} />
      <Circle cx={h} cy={h} r={fx(g.bandIn * 0.3)} fill="none" stroke={ink(0.5)} strokeWidth={1} />
      {pointers}
      <G transform={`rotate(${fx(bearing)} ${fx(h)} ${fx(h)})`}>
        <Polygon
          points={[
            `${fx(h - w / 2)},${fx(h + len)}`,
            `${fx(h + w / 2)},${fx(h + len)}`,
            `${fx(h + w / 2)},${fx(h - len + size * 0.07)}`,
            `${fx(h)},${fx(h - len)}`,
            `${fx(h - w / 2)},${fx(h - len + size * 0.07)}`,
          ].join(" ")}
          fill={Q.brassDeep}
          stroke={ink(0.85)}
          strokeWidth={1}
        />
        <Rect
          x={fx(h - vane / 2)}
          y={fx(h - len * 0.55)}
          width={fx(vane)}
          height={fx(size * 0.014)}
          fill={Q.brassDeep}
          stroke={ink(0.85)}
          strokeWidth={0.8}
        />
        <Rect
          x={fx(h - vane / 2)}
          y={fx(h + len * 0.55)}
          width={fx(vane)}
          height={fx(size * 0.014)}
          fill={Q.brassDeep}
          stroke={ink(0.85)}
          strokeWidth={0.8}
        />
      </G>
      <Circle
        cx={h}
        cy={h}
        r={fx(size * 0.03)}
        fill={Q.brass}
        stroke={ink(0.85)}
        strokeWidth={1.2}
      />
      <Circle cx={h} cy={h} r={fx(size * 0.01)} fill={ink(0.9)} />
    </Svg>
  );
}

/**
 * Astrolabe: brass rings, almucantar engravings and rete star pointers in the
 * style of classical Islamic astrolabes; the alidade (sighting rule) points to
 * the Kaaba. Constant brass palette in light and dark mode.
 */
export default function AstrolabeFace({
  size,
  bearing,
  hasCompass,
  motion,
  preview,
}: QiblaFaceProps) {
  const num = useDialNumber();
  const uid = useSvgId();
  const g = geometry(size);
  const art = useMemo(
    () => <AstrolabeArt size={size} bearing={bearing} preview={preview} uid={uid} />,
    [size, bearing, preview, uid],
  );
  const numerals = useMemo(() => {
    if (preview) return [];
    const out: number[] = [];
    for (let a = 0; a < 360; a += 30) if (angleGap(a, bearing) > 12) out.push(a);
    return out;
  }, [preview, bearing]);
  const engraved = ink(0.92);

  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={Q.kiswahBand} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        {numerals.map((a) => (
          <DialText
            key={a}
            size={size}
            angle={a}
            radius={g.bandMid - size * 0.012}
            motion={motion}
            text={num(a)}
            color={engraved}
            fontSize={dialFont(size, 0.036, 6)}
          />
        ))}
        <CardinalLabels
          size={size}
          radius={g.bandIn - dialFont(size, 0.05, 7) * 1.4}
          motion={motion}
          fontSize={dialFont(size, 0.05, 7)}
          northColor={engraved}
          color={engraved}
          skip={(a) => angleGap(a, bearing) < 14}
        />
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={g.bandMid}
          glyph={Math.round(size * 0.07)}
          motion={motion}
        />
      </DialLayer>
      {hasCompass ? (
        <TopPointer size={size} width={16} height={12} top={0} color={Q.brassDeep} />
      ) : null}
    </FaceStage>
  );
}
