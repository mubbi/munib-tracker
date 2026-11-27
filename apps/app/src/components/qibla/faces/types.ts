import type { SharedValue } from "react-native-reanimated";

import type { QiblaCompassStyleId } from "@/lib/qibla-compass-styles";

export type { QiblaCompassStyleId };

/**
 * Animated values the Qibla screen drives (or a static preview fakes). Faces
 * only read them — the screen owns smoothing, unwrapping and timing.
 */
export interface QiblaMotion {
  /** Dial rotation in degrees (`-heading`, unwrapped). 0 without a compass. */
  dial: SharedValue<number>;
  /** Qibla direction on screen in degrees (`bearing - heading`, unwrapped). */
  needle: SharedValue<number>;
  /** 0 far off … 1 aligned. */
  glow: SharedValue<number>;
  /** Aligned "breathing" scale (1 at rest). */
  pulse: SharedValue<number>;
}

/**
 * The shared face contract. A face is visual only: the screen owns the sensors,
 * the accessible label (the stage is one `image` element), haptics and the
 * turn guidance card.
 *
 * Geometry every face follows: with a compass the dial turns by `motion.dial`
 * so north on the dial points to real north, and the Kaaba marker drawn on the
 * dial at `bearing` reaches the fixed top pointer when the phone faces the
 * qibla. Without a compass the dial stays north-up and the qibla pointer shows
 * the bearing from north.
 */
export interface QiblaFaceProps {
  /** Square stage box (dial plus any frame or halo). */
  size: number;
  /** Qibla bearing from true north, degrees. */
  bearing: number;
  hasCompass: boolean;
  aligned: boolean;
  /** Signed qibla offset from the device top, (-180, 180]; 0 without a compass. */
  offsetDeg: number;
  motion: QiblaMotion;
  reduceMotion: boolean;
  /** Small static thumbnail in the style picker: no ambient animation, fewer labels. */
  preview?: boolean;
}
