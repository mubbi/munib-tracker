import { type ReactElement, useMemo } from "react";
import Svg, { Circle, Defs, Line, Path, RadialGradient, Stop } from "react-native-svg";

import { Brand, withAlpha } from "@/constants/theme";
import { SKY_PALETTES } from "@/lib/sky";
import { backgroundStars } from "@/lib/tasbeeh/constellation";

import {
  AlignHalo,
  CardinalLabels,
  DialLayer,
  dialFont,
  FaceStage,
  fx,
  KaabaMarker,
  polar,
  TopPointer,
  useSvgId,
} from "./shared";
import type { QiblaFaceProps } from "./types";

/** The home hero's night sky (lib/sky.ts) — scene colours, constant in both schemes. */
const NIGHT = SKY_PALETTES.night;
const GOLD = NIGHT.accent;
const STARLIGHT = Brand.heroText;
/** A fixed, seeded star field — each star keeps a stable id. */
const STARS = backgroundStars(64).map((s, i) => ({ ...s, id: `star-${i}` }));

/** Four-point sparkle centred on (x, y). */
function sparkle(x: number, y: number, long: number, waist: number): string {
  return [
    `M ${fx(x)} ${fx(y - long)}`,
    `Q ${fx(x + waist)} ${fx(y - waist)} ${fx(x + long)} ${fx(y)}`,
    `Q ${fx(x + waist)} ${fx(y + waist)} ${fx(x)} ${fx(y + long)}`,
    `Q ${fx(x - waist)} ${fx(y + waist)} ${fx(x - long)} ${fx(y)}`,
    `Q ${fx(x - waist)} ${fx(y - waist)} ${fx(x)} ${fx(y - long)} Z`,
  ].join(" ");
}

function NightArt({ size, bearing, uid }: { size: number; bearing: number; uid: string }) {
  const h = size / 2;
  const r = h - 1;

  const stars: ReactElement[] = [];
  for (const s of STARS) {
    const x = h + (s.x * 2 - 1) * r;
    const y = h + (s.y * 2 - 1) * r;
    if (Math.hypot(x - h, y - h) > r * 0.88) continue;
    stars.push(
      <Circle
        key={s.id}
        cx={fx(x)}
        cy={fx(y)}
        r={fx(Math.max(0.6, s.r * size * 0.0065))}
        fill={STARLIGHT}
        fillOpacity={0.3 + s.r * 0.6}
      />,
    );
  }

  // Centre crescent (horns to the east).
  const m = size * 0.045;
  const crescent = `M ${fx(h)} ${fx(h - m)} A ${fx(m)} ${fx(m)} 0 0 0 ${fx(h)} ${fx(h + m)} A ${fx(m * 1.25)} ${fx(m * 1.25)} 0 0 1 ${fx(h)} ${fx(h - m)} Z`;

  const star = polar(h, r * 0.62, bearing);
  const pathFrom = polar(h, m * 1.8, bearing);
  const pathTo = polar(h, r * 0.62 - size * 0.08, bearing);
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={`sky${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={NIGHT.top} />
          <Stop offset="0.7" stopColor={NIGHT.mid} />
          <Stop offset="1" stopColor={NIGHT.bottom} />
        </RadialGradient>
      </Defs>
      <Circle
        cx={h}
        cy={h}
        r={fx(r)}
        fill={`url(#sky${uid})`}
        stroke={withAlpha(GOLD, 0.6)}
        strokeWidth={1.5}
      />
      <Circle
        cx={h}
        cy={h}
        r={fx(r - size * 0.035)}
        fill="none"
        stroke={withAlpha(GOLD, 0.35)}
        strokeWidth={1}
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      {stars}
      <Line
        x1={fx(pathFrom.x)}
        y1={fx(pathFrom.y)}
        x2={fx(pathTo.x)}
        y2={fx(pathTo.y)}
        stroke={withAlpha(GOLD, 0.6)}
        strokeWidth={1.5}
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <Circle
        cx={fx(star.x)}
        cy={fx(star.y)}
        r={fx(size * 0.1)}
        fill={withAlpha(NIGHT.glow, 0.18)}
      />
      <Circle cx={fx(star.x)} cy={fx(star.y)} r={fx(size * 0.065)} fill={withAlpha(GOLD, 0.22)} />
      <Path d={sparkle(star.x, star.y, size * 0.095, size * 0.014)} fill={GOLD} />
      <Path d={crescent} fill={GOLD} />
    </Svg>
  );
}

/**
 * Night sky: the home hero's night palette with a starfield that turns with the
 * dial; the Kaaba shines as the brightest star at the qibla bearing.
 */
export default function NightFace({ size, bearing, hasCompass, motion }: QiblaFaceProps) {
  const uid = useSvgId();
  const r = size / 2 - 1;
  const fontSize = dialFont(size, 0.048, 7);
  const art = useMemo(
    () => <NightArt size={size} bearing={bearing} uid={uid} />,
    [size, bearing, uid],
  );
  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={size - 2} color={GOLD} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        <CardinalLabels
          size={size}
          radius={r - size * 0.035 - fontSize * 1.3}
          motion={motion}
          fontSize={fontSize}
          northColor={GOLD}
          color={withAlpha(STARLIGHT, 0.85)}
        />
        <KaabaMarker
          size={size}
          bearing={bearing}
          radius={r * 0.62}
          glyph={Math.round(size * 0.058)}
          motion={motion}
        />
      </DialLayer>
      {hasCompass ? <TopPointer size={size} width={14} height={10} top={0} color={GOLD} /> : null}
    </FaceStage>
  );
}
