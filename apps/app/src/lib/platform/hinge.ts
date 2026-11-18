import { type Hinge, isAvailable, useHinge } from "expo-hinge";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/**
 * Normalised fold posture for foldable phones (iPhone Duo on iOS 27.1+, Android 11+
 * foldables). Apple's guidance: drive **interactions and effects** from the hinge,
 * never layout — layout always follows window size (`useLargeScreenLayout`).
 *
 * - `flat`     — unfolded (≥ 165°), or the device reports `fullyOpen`
 * - `halfOpen` — tabletop / book posture
 * - `closed`   — folded shut (Android never reports `closed`, so it is derived from the angle)
 */
export type HingePosture = "flat" | "halfOpen" | "closed";

const FLAT_MIN_DEGREES = 165;
const CLOSED_MAX_DEGREES = 20;

/** Pure mapping, exported for tests. */
export function postureFromHinge(hinge: Hinge | null): HingePosture | null {
  if (!hinge) return null;
  const { angle, status } = hinge;
  if (status === "closed") return "closed";
  if (status === "fullyOpen") return "flat";
  if (status === "partiallyOpen") return angle >= FLAT_MIN_DEGREES ? "flat" : "halfOpen";
  // `unknown` (Android when the window does not span the fold): fall back to the angle.
  if (!Number.isFinite(angle)) return null;
  if (angle <= CLOSED_MAX_DEGREES) return "closed";
  if (angle >= FLAT_MIN_DEGREES) return "flat";
  return "halfOpen";
}

/** True when this build + OS can report a hinge (not that the device has one). */
export function isHingeSupported(): boolean {
  if (Platform.OS === "web" || isTV()) return false;
  try {
    return isAvailable();
  } catch {
    return false;
  }
}

/**
 * Current fold posture, or `null` on devices without a hinge, below iOS 27.1 /
 * Android 11, on web, and on TV. Re-renders when the posture changes.
 */
export function useHingePosture(): HingePosture | null {
  return postureFromHinge(useHinge());
}
