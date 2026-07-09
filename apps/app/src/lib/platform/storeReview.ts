import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
} from "@munib-tracker/shared/constants";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";
import { detectWebPwaBrowserMatrix } from "@/lib/notifications/browser-capabilities";
import { isExpoGo } from "@/lib/notifications/platform";

export type ReviewStoreListingTarget = "ios" | "android" | "both";

export async function isStoreReviewAvailable(): Promise<boolean> {
  if (Platform.OS === "web" || isExpoGo()) return false;
  try {
    return await StoreReview.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestStoreReviewIfAvailable(): Promise<boolean> {
  if (!(await isStoreReviewAvailable())) return false;
  try {
    await StoreReview.requestReview();
    return true;
  } catch {
    return false;
  }
}

export function resolveReviewStoreListingTarget(): ReviewStoreListingTarget {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  const matrix = detectWebPwaBrowserMatrix();
  if (matrix?.isIosWebKit) return "ios";
  if (matrix?.isAndroid) return "android";
  return "both";
}

export function resolveReviewStoreListingUrl(
  target: Exclude<ReviewStoreListingTarget, "both">,
  locale?: string,
): string {
  return target === "ios"
    ? buildLocalizedIosAppStoreUrl(locale)
    : buildLocalizedAndroidPlayStoreUrl(locale);
}

export async function openReviewStoreListingUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function openReviewStoreListing(options?: { locale?: string }): Promise<boolean> {
  if (Platform.OS !== "web" && !isExpoGo()) {
    const nativeOk = await requestStoreReviewIfAvailable();
    if (nativeOk) return true;
  }

  const target = resolveReviewStoreListingTarget();
  if (target === "both") return false;

  return openReviewStoreListingUrl(resolveReviewStoreListingUrl(target, options?.locale));
}
