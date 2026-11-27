import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Svg, { Circle, G, Polygon } from "react-native-svg";

import {
  AlignHalo,
  DialLayer,
  DialText,
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

function ArrowArt({ size, bearing, c }: { size: number; bearing: number; c: FaceColors }) {
  const h = size / 2;
  const r = h - size * 0.025;
  const tip = r * 0.8;
  const base = r * 0.22;
  const head = r * 0.4;
  const shaft = r * 0.13;
  const tail = r * 0.56;
  const arrow = [
    [h, h - tip],
    [h + head, h - base],
    [h + shaft, h - base],
    [h + shaft, h + tail],
    [h - shaft, h + tail],
    [h - shaft, h - base],
    [h - head, h - base],
  ]
    .map(([x, y]) => `${fx(x)},${fx(y)}`)
    .join(" ");
  const n1 = polar(h, r - size * 0.004, -5);
  const n2 = polar(h, r - size * 0.004, 5);
  const n3 = polar(h, r - size * 0.06, 0);
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={h}
        cy={h}
        r={fx(r)}
        fill={c.accentSoft}
        stroke={c.accent}
        strokeWidth={fx(size * 0.022)}
      />
      <Polygon
        points={`${fx(n1.x)},${fx(n1.y)} ${fx(n2.x)},${fx(n2.y)} ${fx(n3.x)},${fx(n3.y)}`}
        fill={c.foreground}
      />
      <G transform={`rotate(${fx(bearing)} ${fx(h)} ${fx(h)})`}>
        <Polygon
          points={arrow}
          fill={c.accent}
          stroke={c.card}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

/**
 * Bold arrow: one large arrow to the Kaaba on a plain high-contrast disc — the
 * easiest face to read at a glance or with low vision.
 */
export default function ArrowFace({ size, bearing, hasCompass, motion, preview }: QiblaFaceProps) {
  const { t } = useTranslation();
  const c = useFaceColors();
  const r = size / 2 - size * 0.025;
  const art = useMemo(() => <ArrowArt size={size} bearing={bearing} c={c} />, [size, bearing, c]);
  const glyph = Math.round(r * 0.2);
  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        {preview ? null : (
          <DialText
            size={size}
            angle={0}
            radius={r - size * 0.12}
            motion={motion}
            text={t("qibla.cardinalN")}
            color={c.foreground}
            fontSize={dialFont(size, 0.055, 8)}
            bold
          />
        )}
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={r * 0.5}
          glyph={glyph}
          motion={motion}
          badge={c.card}
        />
      </DialLayer>
      {hasCompass ? (
        <TopPointer size={size} width={18} height={13} top={0} color={c.foreground} />
      ) : null}
    </FaceStage>
  );
}
