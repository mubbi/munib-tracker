import { screen } from "@testing-library/react-native";
import { Text } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { FocusHighlight } from "@/components/ui/focus-highlight";
import { parentOf } from "@/test-support/queries";
import { captureAnimatedStyles } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Omit<Parameters<typeof FocusHighlight>[0], "children">;

const highlight = (props: Props) => (
  <FocusHighlight {...props}>
    <Text>Target</Text>
  </FocusHighlight>
);

const ring = () =>
  parentOf(screen.getByText("Target")).children[1] as { props: { style: unknown } };

describe("FocusHighlight", () => {
  let withDelay: jest.SpyInstance;
  beforeEach(() => {
    withDelay = jest.spyOn(Reanimated, "withDelay");
  });
  afterEach(() => jest.restoreAllMocks());

  it("draws the ring in the given colour", async () => {
    await renderWithTheme(
      highlight({ active: true, borderColor: "#ff00ff", style: { marginTop: 2 } }),
    );

    expect(flattenStyle(ring().props.style).borderColor).toBe("#ff00ff");
  });

  it("holds the ring before fading it when active", async () => {
    await renderWithTheme(highlight({ active: true }));

    expect(withDelay).toHaveBeenCalledWith(2500, expect.anything());
  });

  it("does not pulse while inactive", async () => {
    await renderWithTheme(highlight({ active: false, borderRadius: 4 }));

    expect(withDelay).not.toHaveBeenCalled();
    expect(flattenStyle(parentOf(screen.getByText("Target")).props.style).borderRadius).toBe(4);
  });

  it("pulses again each time it becomes active", async () => {
    const { rerender } = await renderWithTheme(highlight({ active: false }));
    await rerender(highlight({ active: true }));
    await rerender(highlight({ active: false }));

    expect(withDelay).toHaveBeenCalledTimes(1);
  });

  it("shows the ring fully while it holds", async () => {
    const animated = captureAnimatedStyles();
    withDelay.mockReturnValueOnce(1);
    await renderWithTheme(highlight({ active: true }));

    expect(animated.latest()).toEqual({ opacity: 1 });
  });

  it("keeps the ring invisible while inactive", async () => {
    const animated = captureAnimatedStyles();
    await renderWithTheme(highlight({ active: false }));

    expect(animated.latest()).toEqual({ opacity: 0 });
  });
});
