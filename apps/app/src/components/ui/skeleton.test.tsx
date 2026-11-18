import { screen } from "@testing-library/react-native";
import { View } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { Skeleton } from "@/components/ui/skeleton";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Skeleton>[0];

const renderSkeleton = async (props: Props = {}) => {
  await renderWithTheme(
    <View testID="host">
      <Skeleton {...props} />
    </View>,
  );
  const placeholder = screen.getByTestId("host").children[0] as { props: { style: unknown } };
  return flattenStyle(placeholder.props.style);
};

describe("Skeleton", () => {
  afterEach(() => jest.restoreAllMocks());

  it("defaults to a full-width 16pt bar", async () => {
    expect(await renderSkeleton()).toMatchObject({ width: "100%", height: 16 });
  });

  it("applies custom dimensions", async () => {
    expect(await renderSkeleton({ width: 40, height: 10, radius: 2 })).toMatchObject({
      width: 40,
      height: 10,
      borderRadius: 2,
    });
  });

  it("starts a repeating pulse", async () => {
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderSkeleton();

    expect(withRepeat).toHaveBeenCalled();
  });

  it("stays static under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    const withRepeat = jest.spyOn(Reanimated, "withRepeat");
    await renderSkeleton();

    expect(withRepeat).not.toHaveBeenCalled();
  });
});
