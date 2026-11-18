import { screen } from "@testing-library/react-native";

import { useSplashDismissal } from "@/hooks/use-splash-dismissal";
import { installKeyframeStub } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/hooks/use-splash-dismissal", () => ({ useSplashDismissal: jest.fn() }));

installKeyframeStub();
const { AnimatedIcon, AnimatedSplashOverlay } =
  require("@/components/animated-icon.web") as typeof import("@/components/animated-icon.web");

const images = () => screen.container.queryAll((node) => node.props.source !== undefined);

describe("AnimatedSplashOverlay (web)", () => {
  it("announces a loading overlay until dismissed", async () => {
    jest.mocked(useSplashDismissal).mockReturnValue({ dismissed: false, opacity: 1 } as never);
    await renderWithTheme(<AnimatedSplashOverlay />);

    expect(
      screen.container.queryAll((node) => node.props.accessibilityRole === "progressbar"),
    ).toHaveLength(1);
    expect(images()).toHaveLength(1);
  });

  it("unmounts once dismissed", async () => {
    jest.mocked(useSplashDismissal).mockReturnValue({ dismissed: true, opacity: 0 } as never);
    await renderWithTheme(<AnimatedSplashOverlay />);

    expect(screen.toJSON()).toBeNull();
  });
});

describe("AnimatedIcon (web)", () => {
  it("layers the logo over its glow", async () => {
    await renderWithTheme(<AnimatedIcon />);

    expect(images()).toHaveLength(2);
  });
});
