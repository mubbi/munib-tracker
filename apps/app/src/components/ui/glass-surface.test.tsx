import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("expo-glass-effect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    isLiquidGlassAvailable: () => true,
    GlassView: ({
      children,
      isInteractive,
    }: {
      children?: React.ReactNode;
      isInteractive?: boolean;
    }) =>
      React.createElement(
        View,
        { testID: "glass-view", accessibilityState: { selected: Boolean(isInteractive) } },
        children,
      ),
  };
});

import { GlassControl } from "@/components/ui/glass-surface";

describe("GlassControl", () => {
  it("can disable the Liquid Glass press lens so navigation taps skip FluidSpring", () => {
    render(
      <GlassControl radius={12} interactive={false}>
        <Text>Go</Text>
      </GlassControl>,
    );

    expect(screen.getByTestId("glass-view").props.accessibilityState).toEqual({ selected: false });
  });

  it("keeps the press lens on in-place controls by default", () => {
    render(
      <GlassControl radius={12}>
        <Text>Play</Text>
      </GlassControl>,
    );

    expect(screen.getByTestId("glass-view").props.accessibilityState).toEqual({ selected: true });
  });
});
