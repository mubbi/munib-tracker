import { render } from "@testing-library/react-native";

import { SkyGradientLayer } from "@/components/sky-gradient-layer.web";
import { queryHostsByType } from "@/test-support/queries";

const GRADIENT = { backgroundColor: "#123456" };

const shells = () => queryHostsByType("div");

describe("SkyGradientLayer (web)", () => {
  it("wraps the gradient in a clipped, overscanned drift shell", async () => {
    await render(<SkyGradientLayer gradient={GRADIENT} webMotionClass="drift" />);

    expect(shells().map((node) => node.props.className)).toEqual([undefined, "drift"]);
    expect(shells()[0].props.style).toMatchObject({ position: "absolute", overflow: "hidden" });
    expect(shells()[1].props.style).toMatchObject({
      width: "140%",
      left: expect.stringMatching(/^-19\.9+\d*%$|^-20%$/),
    });
  });

  it("nests an inner motion shell when given a second class", async () => {
    await render(
      <SkyGradientLayer gradient={GRADIENT} webMotionClass="drift" webMotionClassInner="breath" />,
    );

    expect(shells().map((node) => node.props.className)).toEqual([undefined, "drift", "breath"]);
  });
});
