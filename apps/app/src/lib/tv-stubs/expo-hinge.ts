/**
 * Metro resolves `expo-hinge` here when `EXPO_TV=1`.
 * TVs have no hinge: every reader reports "unavailable" and listeners never fire.
 */
import type { Hinge, HingeChangeEvent } from "expo-hinge";

export type { Hinge, HingeChangeEvent, HingeStatus } from "expo-hinge";

export function isAvailable(): boolean {
  return false;
}

export function getHinge(): Hinge | null {
  return null;
}

export function useHinge(): Hinge | null {
  return null;
}

export function addHingeListener(_listener: (event: HingeChangeEvent) => void): {
  remove: () => void;
} {
  return { remove: () => {} };
}

export default { isAvailable, getHinge, useHinge, addHingeListener };
