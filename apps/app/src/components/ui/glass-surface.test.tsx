import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { GlassControl, GlassSurface } from "@/components/ui/glass-surface";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Liquid Glass available (iOS 26+). The fallback paths live in glass-surface.fallback.test.tsx.
jest.mock(
  "expo-glass-effect",
  () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
);

const glass = () => screen.getByTestId("glass-view");

describe("GlassControl", () => {
  const renderControl = (interactive?: boolean) =>
    render(
      <GlassControl radius={12} interactive={interactive} tintColor="#00ff00" colorScheme="dark">
        <Text>Go</Text>
      </GlassControl>,
    );

  it("can disable the Liquid Glass press lens so navigation taps skip FluidSpring", async () => {
    await renderControl(false);

    expect(glass().props.isInteractive).toBe(false);
  });

  it("keeps the press lens on in-place controls by default", async () => {
    await renderControl();

    expect(glass().props.isInteractive).toBe(true);
  });

  it("clips the control to the well radius", async () => {
    await renderControl();

    expect(flattenStyle(glass().props.style)).toMatchObject({
      borderRadius: 12,
      overflow: "hidden",
    });
  });
});

describe("GlassSurface with Liquid Glass", () => {
  it.each([
    [undefined, true],
    [0, false],
  ])("washOpacity=%s paints a scheme wash: %s", async (washOpacity, painted) => {
    await renderWithTheme(
      <GlassSurface interactive washOpacity={washOpacity}>
        <Text>Chrome</Text>
      </GlassSurface>,
    );

    expect(glass().props.isInteractive).toBe(true);
    expect(flattenStyle(glass().props.style).backgroundColor !== undefined).toBe(painted);
  });
});
