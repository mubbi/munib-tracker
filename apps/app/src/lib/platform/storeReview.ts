import {
  ANDROID_PLAY_STORE_MARKET_URL,
  buildAndroidWriteReviewUrl,
  buildIosWriteReviewUrl,
} from "@munib-tracker/shared/constants";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";
import { detectWebPwaBrowserMatrix } from "@/lib/notifications/browser-capabilities";
import { isExpoGo } from "@/lib/notifications/platform";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Two deliberately separate store paths (D76, Apple HIG "Ratings and reviews",
 * App Review 5.6.1, Google Play In-App Review guidelines):
 *
 * - {@link requestNativeStoreReview} — the OS sheet (StoreKit / Play In-App
 *   Review). Only ever called from an automatic value moment, never from a
 *   button: the OS may silently skip it (quota), so a tap could do nothing.
 * - {@link openStoreWriteReview} — the user-initiated "Rate" row. Opens the
 *   store's write-review page, which always works.
 */

export type ReviewStoreListingTarget = "ios" | "android" | "both";

/** True when the OS review sheet can be requested (native store build, not TV / Expo Go / web). */
export async function isStoreReviewAvailable(): Promise<boolean> {
  if (Platform.OS === "web" || isExpoGo() || isTV()) return false;
  try {
    return await StoreReview.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Requests the OS review sheet. Resolves `true` when the request was handed to
 * the OS — which never says whether the sheet showed or the user rated.
 */
export async function requestNativeStoreReview(): Promise<boolean> {
  if (!(await isStoreReviewAvailable())) return false;
  try {
    await StoreReview.requestReview();
    return true;
  } catch {
    // Play: on error, carry on with the normal flow and tell the user nothing.
    return false;
  }
}

/** Which store a "Rate" action should open on this device. */
export function resolveReviewStoreListingTarget(): ReviewStoreListingTarget {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  const matrix = detectWebPwaBrowserMatrix();
  if (matrix?.isIosWebKit) return "ios";
  if (matrix?.isAndroid) return "android";
  return "both";
}

/** Write-review URLs to try in order (Android: Play app first, then the web listing). */
export function resolveWriteReviewUrls(
  target: Exclude<ReviewStoreListingTarget, "both">,
  locale?: string,
): string[] {
  if (target === "ios") return [buildIosWriteReviewUrl(locale)];
  const web = buildAndroidWriteReviewUrl(locale);
  return Platform.OS === "android" ? [ANDROID_PLAY_STORE_MARKET_URL, web] : [web];
}

/** True when this device has a store listing to rate (phone / tablet build, not TV / web). */
export function canOpenStoreWriteReview(): boolean {
  return (Platform.OS === "ios" || Platform.OS === "android") && !isTV();
}

/** Opens the store's write-review page for this device. Resolves `false` when nothing opened. */
export async function openStoreWriteReview(options?: { locale?: string }): Promise<boolean> {
  const target = resolveReviewStoreListingTarget();
  if (target === "both") return false;
  for (const url of resolveWriteReviewUrls(target, options?.locale)) {
    try {
      await Linking.openURL(url);
      return true;
    } catch {
      // Try the next URL (e.g. no Play Store app → web listing).
    }
  }
  return false;
}
