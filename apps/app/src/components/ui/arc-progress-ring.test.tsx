import { render } from "@testing-library/react-native";

import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { progressSweepRtl } from "@/lib/chart-rtl";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByType } from "@/test-support/queries";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/chart-rtl", () => ({
  ...jest.requireActual("@/lib/chart-rtl"),
  progressSweepRtl: jest.fn(() => false),
}));

type Props = Parameters<typeof ArcProgressRing>[0];

const renderRing = (props: Partial<Props> = {}) =>
  render(
    <ArcProgressRing
      size={100}
      stroke={10}
      progress={0.5}
      fillColor="#00ff00"
      trackColor="#cccccc"
      surfaceColor="#ffffff"
      {...props}
    />,
  );

const innerDiscs = () =>
  queryHostsByType("View").filter(
    (node) => flattenStyle(node.props.style).backgroundColor === "#ffffff",
  );

describe("ArcProgressRing on native", () => {
  afterEach(() => jest.mocked(progressSweepRtl).mockReturnValue(false));

  it("draws the track and a progress arc", async () => {
    await renderRing({ surfaceShadow: true, style: { opacity: 1 } });

    expect(queryHostsByType("RNSVGCircle")).toHaveLength(1);
    expect(queryHostsByType("RNSVGPath")).toHaveLength(1);
  });

  it("omits the arc at zero progress", async () => {
    jest.mocked(progressSweepRtl).mockReturnValue(true);
    await renderRing({ progress: -2 });

    expect(queryHostsByType("RNSVGPath")).toHaveLength(0);
  });

  it("punches out the centre with the surface colour", async () => {
    await renderRing();

    expect(innerDiscs()).toHaveLength(1);
  });
});

describe("ArcProgressRing on web", () => {
  usePlatform({ OS: "web" });

  it("uses a conic gradient instead of SVG", async () => {
    await renderRing({ progress: 2 });

    expect(queryHostsByType("RNSVGPath")).toHaveLength(0);
    expect(innerDiscs()).toHaveLength(1);
  });
});
