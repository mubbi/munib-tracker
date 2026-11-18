/**
 * `expo-glass-effect` stand-in: `GlassView` renders a plain View (`testID="glass-view"`)
 * that forwards its props, so tests can assert `isInteractive`, `colorScheme`, etc.
 * Liquid Glass is reported as available; override `isLiquidGlassAvailable` to test
 * the blur fallback.
 *
 *   jest.mock("expo-glass-effect", () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock);
 */
import type { ReactNode } from "react";
import { View } from "react-native";

function MockGlassView(props: { children?: ReactNode } & Record<string, unknown>) {
  return <View testID="glass-view" {...props} />;
}

export const expoGlassEffectMock = {
  __esModule: true,
  isLiquidGlassAvailable: () => true,
  GlassView: MockGlassView,
};
