import { Platform } from "react-native";

/**
 * True on Apple TV (tvOS) and Android TV when built with the react-native-tvos
 * fork (`EXPO_TV=1` prebuild). Safe on phone/web — `Platform.isTV` is false /
 * undefined outside the TV fork.
 */
export function isTV(): boolean {
  return Boolean((Platform as { isTV?: boolean }).isTV);
}

type AndroidPlatformConstants = { Manufacturer?: string; Model?: string; Brand?: string };

/**
 * True on Amazon Fire TV (Fire OS). Fire TV ships the same Leanback APK as
 * Android TV but has no Google Play Services / Play Store and uses the Amazon
 * Appstore instead. Amazon's documented signals: manufacturer "Amazon" and a
 * Fire TV model code starting with "AFT" ("Identifying Fire TV devices").
 */
export function isFireTV(): boolean {
  if (!isTV() || Platform.OS !== "android") return false;
  const constants = (Platform as { constants?: AndroidPlatformConstants }).constants ?? {};
  const model = constants.Model?.trim().toUpperCase() ?? "";
  const manufacturer = constants.Manufacturer?.trim().toLowerCase() ?? "";
  return model.startsWith("AFT") || manufacturer === "amazon";
}

/** Google Android TV / Google TV (Leanback, not Fire OS). */
export function isAndroidTV(): boolean {
  return isTV() && Platform.OS === "android" && !isFireTV();
}
