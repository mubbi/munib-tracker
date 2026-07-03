import Constants from "expo-constants";
import { Platform } from "react-native";

/** True when running inside Expo Go (remote push and some native modules are limited). */
export function isExpoGo(): boolean {
  return Constants.executionEnvironment === "storeClient";
}

export const isWeb = Platform.OS === "web";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isNative = isIOS || isAndroid;

/** Local OS reminders are supported on native dev/production builds, not Expo Go or web. */
export function isLocalNotificationSupported(): boolean {
  return isNative && !isExpoGo();
}
