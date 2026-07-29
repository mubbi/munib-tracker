import { Platform } from "react-native";

/**
 * True on Apple TV (tvOS) and Android TV when built with the react-native-tvos
 * fork (`EXPO_TV=1` prebuild). Safe on phone/web — `Platform.isTV` is false /
 * undefined outside the TV fork.
 */
export function isTV(): boolean {
  return Boolean((Platform as { isTV?: boolean }).isTV);
}
