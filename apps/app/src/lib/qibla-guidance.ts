export type QiblaTurnKind =
  | "aligned"
  | "fineTuneLeft"
  | "fineTuneRight"
  | "slightLeft"
  | "slightRight"
  | "left"
  | "right";

export type QiblaTurnGuidance = {
  kind: QiblaTurnKind;
  /** Signed offset in degrees (-180, 180]; positive = turn clockwise (right). */
  offsetDeg: number;
  /** Absolute offset for display. */
  absDeg: number;
};

/** Signed angle of the qibla relative to the device top edge, in (-180, 180]. */
export function qiblaArrowAngle(bearing: number, heading: number): number {
  return ((bearing - heading + 540) % 360) - 180;
}

export function getQiblaTurnGuidance(
  arrowAngle: number,
  alignedThreshold = 5,
  fineTuneThreshold = 12,
  slightThreshold = 40,
): QiblaTurnGuidance {
  const absDeg = Math.round(Math.abs(arrowAngle));
  const offsetDeg = arrowAngle;

  if (absDeg <= alignedThreshold) {
    return { kind: "aligned", offsetDeg, absDeg };
  }

  const turnRight = offsetDeg > 0;

  if (absDeg <= fineTuneThreshold) {
    return { kind: turnRight ? "fineTuneRight" : "fineTuneLeft", offsetDeg, absDeg };
  }

  if (absDeg <= slightThreshold) {
    return { kind: turnRight ? "slightRight" : "slightLeft", offsetDeg, absDeg };
  }

  return { kind: turnRight ? "right" : "left", offsetDeg, absDeg };
}

/** 0 = far off, 1 = perfectly aligned — for progress rings and glow intensity. */
export function qiblaAlignmentProgress(absDeg: number, maxDeg = 90): number {
  return Math.max(0, Math.min(1, 1 - absDeg / maxDeg));
}
