/**
 * `expo-blur` stand-in: `BlurView` / `BlurTargetView` render plain Views
 * (`testID="blur-view"` / `"blur-target-view"`) that forward their props.
 *
 *   jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);
 */
import type { ReactNode } from "react";
import { View } from "react-native";

type Props = { children?: ReactNode } & Record<string, unknown>;

function MockBlurView(props: Props) {
  return <View testID="blur-view" {...props} />;
}

function MockBlurTargetView(props: Props) {
  return <View testID="blur-target-view" {...props} />;
}

export const expoBlurMock = {
  __esModule: true,
  BlurView: MockBlurView,
  BlurTargetView: MockBlurTargetView,
};
