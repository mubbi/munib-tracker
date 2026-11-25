import { screen } from "@testing-library/react-native";
import { View } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { Skeleton, SkeletonPlaceholder } from "@/components/ui/skeleton";
import { captureAnimatedStyles } from "@/test-support/reanimated";
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

  it("stays static under reduced motion (hydration-safe: settles after mount)", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    const styles = captureAnimatedStyles();
    const cancel = jest.spyOn(Reanimated, "cancelAnimation");
    await renderSkeleton();

    expect(cancel).toHaveBeenCalled();
    expect(styles.latest()).toEqual({ opacity: 0.4 + 0.5 * 0.4 });
  });

  it("is decorative on its own", async () => {
    await renderWithTheme(<Skeleton />);

    expect(
      screen.container.queryAll((n) => n.props.importantForAccessibility === "no-hide-descendants"),
    ).not.toHaveLength(0);
  });
});

describe("SkeletonPlaceholder", () => {
  it.each(["rows", "card", "tiles"] as const)(
    "announces one busy loading stop for %s",
    async (preset) => {
      await renderWithTheme(<SkeletonPlaceholder preset={preset} count={2} />);

      const group = screen.getByRole("progressbar", { name: "Loading…" });
      expect(group.props.accessibilityState).toEqual({ busy: true });
    },
  );

  it("takes a specific loading label", async () => {
    await renderWithTheme(<SkeletonPlaceholder accessibilityLabel="Loading duas…" />);

    expect(screen.getByRole("progressbar", { name: "Loading duas…" })).toBeTruthy();
  });
});
