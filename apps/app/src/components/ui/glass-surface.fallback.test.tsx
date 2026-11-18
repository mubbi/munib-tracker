import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { GlassControl, GlassSurface, OverlayGlassFill } from "@/components/ui/glass-surface";
import { setMockBlurTarget } from "@/test-support/mocks/blur-target-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Liquid Glass unavailable (iOS < 26 / Android / web): `hasLiquidGlass` is fixed at import.
jest.mock("expo-glass-effect", () => ({
  ...require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
  isLiquidGlassAvailable: () => false,
}));
jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);
jest.mock(
  "@/providers/blur-target-provider",
  () => require("@/test-support/mocks/blur-target-provider").blurTargetProviderMock,
);

type SurfaceProps = Parameters<typeof GlassSurface>[0];

const renderSurface = (props: SurfaceProps = {}) =>
  renderWithTheme(
    <GlassSurface {...props}>
      <Text>Chrome</Text>
    </GlassSurface>,
  );

const blur = () => screen.getByTestId("blur-view");

afterEach(() => setMockBlurTarget(null));

describe("GlassSurface without Liquid Glass", () => {
  it("falls back to a dark chrome blur with the default wash", async () => {
    await renderSurface();

    expect(blur().props).toMatchObject({ tint: "systemChromeMaterialDark", intensity: 40 });
    expect(flattenStyle(blur().props.style).backgroundColor).toEqual(expect.any(String));
  });

  it("honours tint, intensity and a zero wash", async () => {
    await renderSurface({ tint: "light", intensity: 10, washOpacity: 0 });

    expect(blur().props).toMatchObject({ tint: "light", intensity: 10 });
    expect(flattenStyle(blur().props.style).backgroundColor).toBeUndefined();
  });

  it("does not pass a blur target off Android", async () => {
    await renderSurface({ backdropCapture: true });

    expect(blur().props.blurTarget).toBeUndefined();
  });
});

describe("GlassSurface on Android", () => {
  usePlatform({ OS: "android" });

  it("captures the root blur target for backdrop chrome", async () => {
    const target = { current: null };
    setMockBlurTarget(target);
    await renderSurface({ backdropCapture: true });

    expect(blur().props).toMatchObject({
      blurMethod: "dimezisBlurViewSdk31Plus",
      blurTarget: target,
    });
  });

  it("prefers a screen-local blur target ref", async () => {
    const local = { current: null };
    await renderSurface({ blurTargetRef: local });

    expect(blur().props.blurTarget).toBe(local);
  });

  it("skips the blur method without a target", async () => {
    await renderSurface();

    expect(blur().props.blurMethod).toBeUndefined();
  });
});

describe("GlassSurface on TV", () => {
  usePlatform({ isTV: true });

  it("renders an opaque view instead of a live blur", async () => {
    await renderSurface();

    expect(screen.queryByTestId("blur-view")).toBeNull();
    expect(flattenStyle(screen.getByText("Chrome").parent!.props.style).backgroundColor).toEqual(
      expect.any(String),
    );
  });
});

describe("OverlayGlassFill", () => {
  it("blurs with a thin material plus a card wash on native", async () => {
    await renderWithTheme(<OverlayGlassFill cardWashAlpha={0.5} />);

    expect(blur().props).toMatchObject({ tint: "systemThinMaterialDark", intensity: 72 });
    expect(blur().props.blurTarget).toBeUndefined();
  });
});

describe("OverlayGlassFill on Android", () => {
  usePlatform({ OS: "android" });

  it("captures the root blur target when present", async () => {
    setMockBlurTarget({ current: null });
    await renderWithTheme(<OverlayGlassFill cardWashAlpha={0.5} intensity={30} />);

    expect(blur().props).toMatchObject({ blurMethod: "dimezisBlurViewSdk31Plus", intensity: 30 });
  });
});

describe("OverlayGlassFill on web", () => {
  usePlatform({ OS: "web" });

  it("uses a CSS backdrop filter instead of BlurView", async () => {
    await renderWithTheme(<OverlayGlassFill cardWashAlpha={0.5} />);

    expect(screen.queryByTestId("blur-view")).toBeNull();
    const frost = screen.container.queryAll(
      (node) => flattenStyle(node.props.style).backdropFilter !== undefined,
    );
    expect(frost).toHaveLength(1);
  });
});

describe("GlassControl without Liquid Glass", () => {
  it("renders its control untouched", async () => {
    await renderWithTheme(
      <GlassControl radius={12}>
        <Text>Play</Text>
      </GlassControl>,
    );

    expect(screen.getByText("Play")).toBeTruthy();
    expect(screen.queryByTestId("glass-view")).toBeNull();
  });
});
