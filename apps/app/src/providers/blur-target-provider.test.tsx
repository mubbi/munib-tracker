import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { BlurTargetProvider, useBlurTarget } from "@/providers/blur-target-provider";
import { usePlatform } from "@/test-support/platform";

jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);

let target: ReturnType<typeof useBlurTarget> | undefined;

function Overlay() {
  target = useBlurTarget();
  return <Text>overlay</Text>;
}

async function renderProvider() {
  target = undefined;
  await render(
    <BlurTargetProvider overlays={<Overlay />}>
      <Text>content</Text>
    </BlurTargetProvider>,
  );
}

describe("BlurTargetProvider", () => {
  it("renders content and overlays without a blur target off Android", async () => {
    await renderProvider();

    expect(screen.getByText("content")).toBeTruthy();
    expect(screen.getByText("overlay")).toBeTruthy();
    expect(screen.queryByTestId("blur-target-view")).toBeNull();
    expect(target).toBeNull();
  });

  describe("on android", () => {
    usePlatform({ OS: "android" });

    it("wraps content in a BlurTargetView and exposes its ref", async () => {
      await renderProvider();

      expect(screen.getByTestId("blur-target-view")).toBeTruthy();
      expect(target).toEqual({ current: expect.anything() });
    });
  });

  it("returns null from useBlurTarget outside the provider", async () => {
    await render(<Overlay />);
    expect(target).toBeNull();
  });
});
