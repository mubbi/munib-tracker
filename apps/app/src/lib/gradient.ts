import type { ViewStyle } from "react-native";

/**
 * A CSS gradient background that works on every platform.
 *
 * React Native 0.88 made `backgroundImage` a stable style key (the
 * `experimental_backgroundImage` alias is deprecated), and react-native-web passes
 * the same key through as plain CSS — so one key now covers native and web.
 * Accepts any `linear-gradient()` / `radial-gradient()` / `conic-gradient()` string.
 * Conic gradients only render on web — use `ArcProgressRing` for circular progress
 * on native.
 */
export function gradientBackground(image: string): ViewStyle {
  return { backgroundImage: image };
}
