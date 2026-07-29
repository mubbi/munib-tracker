import Constants from "expo-constants";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/** True when running inside Expo Go (remote push and some native modules are limited). */
export function isExpoGo(): boolean {
  return Constants.executionEnvironment === "storeClient";
}

export const isWeb = Platform.OS === "web";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isNative = isIOS || isAndroid;

/** Local OS reminders are supported on native phone builds, not Expo Go, web, or TV. */
export function isLocalNotificationSupported(): boolean {
  return isNative && !isExpoGo() && !isTV();
}
