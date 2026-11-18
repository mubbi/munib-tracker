import { act, fireEvent, screen } from "@testing-library/react-native";
import {
  PanResponder,
  type PanResponderCallbacks,
  type PanResponderGestureState,
  Text,
} from "react-native";

import { Sheet } from "@/components/ui/sheet";
import { setMockBlurTarget } from "@/test-support/mocks/blur-target-provider";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "@/components/ui/glass-surface",
  () => require("@/test-support/mocks/glass-surface").glassSurfaceMock,
);
jest.mock(
  "expo-glass-effect",
  () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
);
jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

jest.mock(
  "@/providers/blur-target-provider",
  () => require("@/test-support/mocks/blur-target-provider").blurTargetProviderMock,
);

type SheetProps = Parameters<typeof Sheet>[0];

const renderSheet = async (props: Partial<SheetProps> = {}) => {
  const onClose = jest.fn();
  const ui = (overrides: Partial<SheetProps> = {}) => (
    <Sheet visible onClose={onClose} {...props} {...overrides}>
      {overrides.children ?? <Text>Sheet body</Text>}
    </Sheet>
  );
  const { rerender } = await renderWithTheme(ui());
  return { onClose, rerender: (o: Partial<SheetProps>) => rerender(ui(o)) };
};

/** The bottom card is `accessibilityViewIsModal`, which hides its siblings from RNTL queries. */
const hidden = { includeHiddenElements: true };

afterEach(() => {
  setMockLiquidGlass(false);
  resetMockWindowSize();
  setMockBlurTarget(null);
});

describe("Sheet (center dialog)", () => {
  it("renders its content without a drag handle", async () => {
    await renderSheet();

    expect(screen.getByText("Sheet body")).toBeTruthy();
    expect(screen.queryByLabelText("Drag down to close")).toBeNull();
  });

  it("closes from the scrim", async () => {
    const { onClose } = await renderSheet();

    await fireEvent.press(screen.getByLabelText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps showing the last visible content while animating closed", async () => {
    const { rerender } = await renderSheet();

    await rerender({ visible: false, children: <Text>Cleared</Text> });

    expect(screen.queryByText("Cleared")).toBeNull();
  });
});

describe("Sheet (bottom sheet frost)", () => {
  it("shows a drag handle over a blur fallback", async () => {
    await renderSheet({ variant: "bottom" });

    expect(screen.getByLabelText("Drag down to close")).toBeTruthy();
    expect(screen.getByTestId("blur-view", hidden)).toBeTruthy();
  });

  it("uses Liquid Glass when available", async () => {
    setMockLiquidGlass(true);
    await renderSheet({ variant: "bottom" });

    expect(screen.getByTestId("glass-view", hidden)).toBeTruthy();
  });

  it("skips frost for solid, non-scrolling sheets centred on wide windows", async () => {
    setMockWindowSize(1400, 900);
    await renderSheet({ variant: "bottom", solid: true, scrollable: false });

    expect(screen.queryByTestId("blur-view", hidden)).toBeNull();
    expect(screen.getByText("Sheet body")).toBeTruthy();
  });
});

describe("Sheet on web", () => {
  usePlatform({ OS: "web" });

  it("uses a CSS frost layer instead of native blur", async () => {
    await renderSheet({ variant: "bottom" });

    expect(screen.queryByTestId("blur-view", hidden)).toBeNull();
    expect(screen.queryByTestId("glass-view", hidden)).toBeNull();
  });
});

describe("Sheet on Android", () => {
  usePlatform({ OS: "android" });

  it("captures the root blur target", async () => {
    setMockBlurTarget({ current: null });
    await renderSheet({ variant: "bottom" });

    expect(screen.getByTestId("blur-view", hidden).props.blurMethod).toBe(
      "dimezisBlurViewSdk31Plus",
    );
  });

  it("elevates centred dialogs above the scrim", async () => {
    await renderSheet({ contentStyle: { padding: 2 } });

    const elevated = queryHostsByType("View").filter(
      (node) => flattenStyle(node.props.style).elevation === 24,
    );
    expect(elevated).toHaveLength(1);
  });
});

describe("Sheet on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the scrim out of D-pad focus", async () => {
    await renderSheet({ variant: "bottom", solid: true });

    expect(screen.getByLabelText("Close", hidden).props.focusable).toBe(false);
  });
});

describe("Sheet drag to dismiss", () => {
  let config: PanResponderCallbacks;
  const evt = {} as never;
  const gesture = (g: Partial<PanResponderGestureState>) =>
    ({ dx: 0, dy: 0, vy: 0, ...g }) as PanResponderGestureState;

  beforeEach(() => {
    const create = PanResponder.create.bind(PanResponder);
    jest.spyOn(PanResponder, "create").mockImplementation((next) => {
      config = next;
      return create(next);
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it("claims vertical drags but not horizontal ones", async () => {
    await renderSheet({ variant: "bottom" });

    expect(config.onStartShouldSetPanResponder?.(evt, gesture({}))).toBe(true);
    expect(config.onMoveShouldSetPanResponder?.(evt, gesture({ dy: 10, dx: 2 }))).toBe(true);
    expect(config.onMoveShouldSetPanResponder?.(evt, gesture({ dy: 2, dx: 10 }))).toBe(false);
    expect(config.onPanResponderTerminationRequest?.(evt, gesture({}))).toBe(false);
  });

  it("springs back after a short, slow drag", async () => {
    const { onClose } = await renderSheet({ variant: "bottom" });

    await act(async () => {
      config.onPanResponderMove?.(evt, gesture({ dy: 30 }));
      config.onPanResponderMove?.(evt, gesture({ dy: -5 }));
      config.onPanResponderRelease?.(evt, gesture({ dy: 20, vy: 0.1 }));
      config.onPanResponderTerminate?.(evt, gesture({}));
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([
    ["a long drag", { dy: 100 }],
    ["a fast flick", { dy: 10, vy: 2 }],
  ])("closes after %s", async (_case, release) => {
    const { onClose } = await renderSheet({ variant: "bottom" });

    await act(async () => config.onPanResponderRelease?.(evt, gesture(release)));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
