import { Platform, type ViewStyle } from "react-native";

/**
 * A CSS gradient background that works on every platform.
 *
 * React Native 0.86 exposes gradients through the `experimental_backgroundImage`
 * style key, but react-native-web (0.21) doesn't recognise that key — it only
 * honours the plain CSS `backgroundImage`. Passing the native key on web leaves
 * the layer transparent (the hero would collapse to a flat colour), so we branch
 * by platform here. Accepts any `linear-gradient()` / `radial-gradient()` /
 * `conic-gradient()` string. Conic gradients only render on web — use
 * `ArcProgressRing` for circular progress on native.
 */
export function gradientBackground(image: string): ViewStyle {
  if (Platform.OS === "web") {
    return { backgroundImage: image } as unknown as ViewStyle;
  }
  return { experimental_backgroundImage: image } as ViewStyle;
}
