import type { SymbolViewProps } from "expo-symbols";

/**
 * Update-prompt icons. `expo-symbols` only renders the `{ ios, android, web }`
 * form on Android and web; a bare SF Symbol name draws nothing there.
 */
export const UPDATE_HARD_ICON: SymbolViewProps["name"] = {
  ios: "exclamationmark.triangle.fill",
  android: "warning",
  web: "warning",
};

export const UPDATE_SOFT_ICON: SymbolViewProps["name"] = {
  ios: "arrow.down.circle.fill",
  android: "download",
  web: "download",
};
