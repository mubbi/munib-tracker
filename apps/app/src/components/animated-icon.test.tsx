import { screen } from "@testing-library/react-native";

import { useSplashDismissal } from "@/hooks/use-splash-dismissal";
import { installKeyframeStub } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/hooks/use-splash-dismissal", () => ({ useSplashDismissal: jest.fn() }));

installKeyframeStub();
const { AnimatedIcon, AnimatedSplashOverlay } =
  require("@/components/animated-icon") as typeof import("@/components/animated-icon");

const images = () => screen.container.queryAll((node) => node.props.source !== undefined);

describe("AnimatedSplashOverlay (native)", () => {
  it("covers the app with the splash image until dismissed", async () => {
    jest.mocked(useSplashDismissal).mockReturnValue({ dismissed: false, opacity: 1 } as never);
    await renderWithTheme(<AnimatedSplashOverlay />);

    expect(images()).toHaveLength(1);
  });

  it("stays mounted but inert after dismissal", async () => {
    jest.mocked(useSplashDismissal).mockReturnValue({ dismissed: true, opacity: 0 } as never);
    await renderWithTheme(<AnimatedSplashOverlay />);

    const host = screen.container.queryAll(
      (node) => node.props.importantForAccessibility != null,
    )[0];
    expect(images()).toHaveLength(0);
    expect(host.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(flattenStyle(host.props.style)).toMatchObject({
      pointerEvents: "none",
      backgroundColor: "transparent",
    });
  });
});

describe("AnimatedIcon (native)", () => {
  it("layers the logo over its glow", async () => {
    await renderWithTheme(<AnimatedIcon />);

    expect(images()).toHaveLength(2);
  });
});
