import { render, screen } from "@testing-library/react-native";

import { SkyGradientLayer } from "@/components/sky-gradient-layer";
import { flattenStyle } from "@/test-support/style";

describe("SkyGradientLayer (native)", () => {
  it("clips an oversized gradient layer that the motion style drifts", async () => {
    await render(
      <SkyGradientLayer gradient={{ backgroundColor: "#123456" }} motionStyle={{ opacity: 0.5 }} />,
    );

    const clip = screen.container.children[0] as { props: { style: unknown }; children: unknown[] };
    const overscan = clip.children[0] as { props: { style: unknown } };
    expect(flattenStyle(clip.props.style)).toMatchObject({
      position: "absolute",
      overflow: "hidden",
    });
    expect(flattenStyle(overscan.props.style)).toMatchObject({ width: "140%", opacity: 0.5 });
    expect(
      screen.container.queryAll((n) => flattenStyle(n.props.style).backgroundColor === "#123456"),
    ).toHaveLength(1);
  });
});
