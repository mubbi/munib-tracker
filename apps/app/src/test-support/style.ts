import { type StyleProp, StyleSheet } from "react-native";

/** Flattens a host element's `style` prop into a plain object for assertions. */
export function flattenStyle(style: StyleProp<unknown>): Record<string, unknown> {
  return (StyleSheet.flatten(style as never) ?? {}) as Record<string, unknown>;
}
