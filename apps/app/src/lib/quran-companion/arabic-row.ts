import { Platform, type ViewStyle } from "react-native";

/**
 * Flex style that lays Arabic words out right-to-left in every app locale.
 *
 * Native: `row-reverse` pinned with `direction: "ltr"` so an RTL app layout
 * does not flip it back. Web: React Native Web rejects the `direction` style, and
 * the page's `dir` already flips flex rows — so pick `row` under RTL and
 * `row-reverse` under LTR instead.
 */
export function arabicWordRowStyle(rtl: boolean): ViewStyle {
  if (Platform.OS === "web") return { flexDirection: rtl ? "row" : "row-reverse" };
  return { flexDirection: "row-reverse", direction: "ltr" };
}
