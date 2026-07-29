import { type AppPlatform, normalizeAppPlatform } from "@munib-tracker/api-client";
import { Platform } from "react-native";

/** Platform sent as X-App-Platform (web / ios / android). */
export function resolveAppPlatform(): AppPlatform {
  return normalizeAppPlatform(Platform.OS);
}
