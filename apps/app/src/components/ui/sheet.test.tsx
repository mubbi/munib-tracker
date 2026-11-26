import { act, fireEvent, screen } from "@testing-library/react-native";
import { createRef } from "react";
import {
  PanResponder,
  type PanResponderCallbacks,
  type PanResponderGestureState,
  Text,
} from "react-native";
import * as Reanimated from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { resetTvFocusMemory } from "@/components/ui/tv-focus-memory";
import { setCurrentPathname } from "@/lib/navigation";
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

  it("keeps the frosted backdrop for solid sheets (solid only makes the card opaque)", async () => {
    setMockWindowSize(1400, 900);
    await renderSheet({ variant: "bottom", solid: true, scrollable: false });

    expect(screen.getByTestId("blur-view", hidden)).toBeTruthy();
    expect(screen.getByText("Sheet body")).toBeTruthy();
  });

  it("frosts the backdrop behind centered dialogs too", async () => {
    await renderSheet({ variant: "center" });

    expect(screen.getByTestId("blur-view", hidden)).toBeTruthy();
  });

  it("never frosts a fullscreen surface", async () => {
    await renderSheet({ variant: "fullscreen" });

    expect(screen.queryByTestId("blur-view", hidden)).toBeNull();
  });
});

describe("Sheet on web", () => {
  usePlatform({ OS: "web" });

  it("uses a CSS frost layer instead of native blur", async () => {
    await renderSheet({ variant: "bottom" });

    expect(screen.queryByTestId("blur-view", hidden)).toBeNull();
    expect(screen.queryByTestId("glass-view", hidden)).toBeNull();
  });

  it("hides the drag grabber from assistive tech (Escape and the scrim close)", async () => {
    await renderSheet({ variant: "bottom" });

    expect(screen.queryByLabelText("Drag down to close")).toBeNull();
  });
});

describe("Sheet assistive-tech dismissal", () => {
  it.each(["decrement", "activate"])("the grabber's %s action closes", async (actionName) => {
    const { onClose } = await renderSheet({ variant: "bottom" });

    await fireEvent(screen.getByLabelText("Drag down to close"), "accessibilityAction", {
      nativeEvent: { actionName },
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each(["bottom", "center"] as const)(
    "the VoiceOver escape gesture closes a %s sheet",
    async (variant) => {
      const { onClose } = await renderSheet({ variant });

      await fireEvent(screen.getByText("Sheet body"), "accessibilityEscape");

      expect(onClose).toHaveBeenCalledTimes(1);
    },
  );
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

  it("drops the drag handle — remotes cannot drag, Back closes", async () => {
    await renderSheet({ variant: "bottom", solid: true });

    expect(screen.getByText("Sheet body")).toBeTruthy();
    expect(screen.queryByLabelText("Drag down to close", hidden)).toBeNull();
  });

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

describe("Sheet title and close API", () => {
  it("renders the title as a heading that names the dialog", async () => {
    await renderSheet({ title: "Reading settings" });

    const heading = screen.getByRole("header", { name: "Reading settings" });
    expect(heading).toBeTruthy();
    const dialog = queryHostsByType("View").filter(
      (node) => node.props.accessibilityViewIsModal === true,
    );
    expect(dialog).toHaveLength(1);
    expect(dialog[0]?.props.accessibilityLabel).toBe("Reading settings");
  });

  it("lets accessibilityLabel override the dialog name", async () => {
    await renderSheet({ title: "Font", accessibilityLabel: "Reading font" });

    const dialog = queryHostsByType("View").find((n) => n.props.accessibilityViewIsModal);
    expect(dialog?.props.accessibilityLabel).toBe("Reading font");
  });

  it("gives a titled centre dialog a close button (no grabber to drag)", async () => {
    const { onClose } = await renderSheet({ title: "Details" });

    const closes = screen.getAllByRole("button", { name: "Close" });
    // Scrim + header close button.
    expect(closes).toHaveLength(2);
    await fireEvent.press(closes[1] as never);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps the grabber as the close affordance on a native bottom sheet", async () => {
    await renderSheet({ variant: "bottom", title: "Share" });

    expect(screen.getByText("Share", hidden)).toBeTruthy();
    // Only the scrim is a "Close" button.
    expect(screen.getAllByLabelText("Close", hidden)).toHaveLength(1);
  });

  it("can force the close button off", async () => {
    await renderSheet({ title: "Details", showCloseButton: false });

    expect(screen.getAllByLabelText("Close")).toHaveLength(1);
  });
});

describe("Sheet fullscreen variant", () => {
  it("is a modal view with a title and close button but no scrim", async () => {
    const { onClose } = await renderSheet({ variant: "fullscreen", title: "Set PIN" });

    const modal = queryHostsByType("View").filter((n) => n.props.accessibilityViewIsModal);
    expect(modal).toHaveLength(1);
    expect(screen.getByRole("header", { name: "Set PIN" })).toBeTruthy();
    const close = screen.getAllByLabelText("Close");
    expect(close).toHaveLength(1);
    await fireEvent.press(close[0] as never);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("slides in unless reduced motion asks for a fade", async () => {
    await renderSheet({ variant: "fullscreen" });

    expect(queryHostsByType("Modal")[0]?.props.animationType).toBe("slide");
  });
});

describe("Sheet on web: title, scrim and dialog semantics", () => {
  usePlatform({ OS: "web" });

  it("takes the scrim out of the Tab order", async () => {
    await renderSheet();

    const scrim = screen.getByLabelText("Close");
    expect(scrim.props.tabIndex).toBe(-1);
    expect(scrim.props.focusable).toBe(false);
  });

  it("marks the card as an aria-modal dialog named by the title", async () => {
    await renderSheet({ variant: "bottom", title: "Filters" });

    const dialog = queryHostsByType("View").find((n) => n.props.role === "dialog");
    expect(dialog?.props["aria-modal"]).toBe(true);
    expect(dialog?.props.accessibilityLabel).toBe("Filters");
  });

  it("shows a close button on a titled bottom sheet (the grabber is not keyboard-reachable)", async () => {
    await renderSheet({ variant: "bottom", title: "Filters" });

    expect(screen.getAllByLabelText("Close", hidden)).toHaveLength(2);
  });
});

describe("Sheet on TV: close button", () => {
  usePlatform({ isTV: true });

  it("draws no grabber and offers a close button with a title", async () => {
    await renderSheet({ variant: "bottom", solid: true, title: "Reciter" });

    expect(screen.queryByLabelText("Drag down to close", hidden)).toBeNull();
    expect(screen.getAllByLabelText("Close", hidden)).toHaveLength(2);
  });

  it("returns focus to the trigger after closing", async () => {
    jest.useFakeTimers();
    try {
      const trigger = { current: { focus: jest.fn() } };
      const { rerender } = await renderSheet({ returnFocusRef: trigger });

      await rerender({ visible: false });
      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(trigger.current.focus).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});

const opener = createRef<{ focus?: () => void }>();
type HarnessProps = {
  open: boolean;
  mounted?: boolean;
  returnFocusRef?: SheetProps["returnFocusRef"];
};
const Harness = ({ open, mounted = true, returnFocusRef }: HarnessProps) => (
  <>
    <PressableScale ref={opener as never} accessibilityLabel="Reciter" onPress={() => {}} />
    <PressableScale accessibilityLabel="Elsewhere" onPress={() => {}} />
    {mounted ? (
      <Sheet
        visible={open}
        onClose={() => {}}
        accessibilityLabel="Reciters"
        returnFocusRef={returnFocusRef}
      >
        <PressableScale accessibilityLabel="Mishary" onPress={() => {}} />
      </Sheet>
    ) : null}
  </>
);

describe("Sheet on TV: default focus return (P10-05)", () => {
  usePlatform({ isTV: true });

  let focusOpener: jest.Mock;
  /** Focuses the opener, opens the sheet and moves D-pad focus inside it. */
  const openFromOpener = async (props: Partial<HarnessProps> = {}) => {
    const view = await renderWithTheme(<Harness open={false} {...props} />);
    focusOpener = jest.fn();
    (opener.current as { focus?: () => void }).focus = focusOpener;
    await fireEvent(screen.getByLabelText("Reciter"), "focus");
    await view.rerender(<Harness open {...props} />);
    await fireEvent(screen.getByLabelText("Mishary", hidden), "focus");
    return view;
  };
  const settle = () =>
    act(async () => {
      jest.runOnlyPendingTimers();
    });

  beforeEach(() => {
    jest.useFakeTimers();
    resetTvFocusMemory();
    setCurrentPathname("/settings/audio");
  });
  afterEach(() => {
    jest.useRealTimers();
    setCurrentPathname(null);
  });

  it("returns focus to the control that opened it, without a returnFocusRef", async () => {
    const view = await openFromOpener();

    await view.rerender(<Harness open={false} />);
    await settle();

    expect(focusOpener).toHaveBeenCalledTimes(1);
  });

  it("restores focus when the caller unmounts the open sheet", async () => {
    const view = await openFromOpener();

    await view.rerender(<Harness open mounted={false} />);
    await settle();

    expect(focusOpener).toHaveBeenCalledTimes(1);
  });

  it("leaves focus alone when another control took it after closing", async () => {
    const view = await openFromOpener();

    await view.rerender(<Harness open={false} />);
    await fireEvent(screen.getByLabelText("Elsewhere"), "focus");
    await settle();

    expect(focusOpener).not.toHaveBeenCalled();
  });

  it("leaves focus alone when closing navigated to another route", async () => {
    const view = await openFromOpener();

    setCurrentPathname("/settings/fonts");
    await view.rerender(<Harness open={false} />);
    await settle();

    expect(focusOpener).not.toHaveBeenCalled();
  });

  it("lets an explicit returnFocusRef win", async () => {
    const trigger = { current: { focus: jest.fn() } };
    const view = await openFromOpener({ returnFocusRef: trigger });

    await view.rerender(<Harness open={false} returnFocusRef={trigger} />);
    await settle();

    expect(trigger.current.focus).toHaveBeenCalledTimes(1);
    expect(focusOpener).not.toHaveBeenCalled();
  });
});

describe("Sheet drag release while the caller keeps it open (B-29)", () => {
  let config: PanResponderCallbacks;
  beforeEach(() => {
    const create = PanResponder.create.bind(PanResponder);
    jest.spyOn(PanResponder, "create").mockImplementation((next) => {
      config = next;
      return create(next);
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("eases the card back (no spring bounce) when onClose does not hide the sheet", async () => {
    jest.useFakeTimers();
    const { onClose } = await renderSheet({ variant: "bottom" });
    const spring = jest.spyOn(Reanimated, "withSpring");
    const timing = jest.spyOn(Reanimated, "withTiming");

    await act(async () => {
      config.onPanResponderRelease?.({} as never, { dx: 0, dy: 120, vy: 0 } as never);
      jest.runOnlyPendingTimers();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(spring).not.toHaveBeenCalled();
    expect(timing).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: expect.any(Number) }),
    );
  });
});

describe("Sheet orientation (B-12)", () => {
  it("lets the modal follow the device into landscape", async () => {
    await renderSheet({ variant: "fullscreen", title: "Night" });

    expect(queryHostsByType("Modal")[0]?.props.supportedOrientations).toEqual(
      expect.arrayContaining(["portrait", "landscape"]),
    );
  });
});

describe("Sheet motion", () => {
  afterEach(() => jest.restoreAllMocks());

  const openBottom = async () => {
    const { rerender } = await renderSheet({ variant: "bottom", visible: false });
    await rerender({ visible: true, variant: "bottom" });
  };

  it("fades a bottom sheet in — no slide, no spring bounce", async () => {
    const spring = jest.spyOn(Reanimated, "withSpring");

    await openBottom();

    expect(spring).not.toHaveBeenCalled();
    expect(queryHostsByType("Modal")[0]?.props.animationType).toBe("fade");
  });

  it("only fades under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    const spring = jest.spyOn(Reanimated, "withSpring");

    await openBottom();

    expect(spring).not.toHaveBeenCalled();
    expect(queryHostsByType("Modal")[0]?.props.animationType).toBe("fade");
  });

  it("fades a fullscreen surface under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);

    await renderSheet({ variant: "fullscreen" });

    expect(queryHostsByType("Modal")[0]?.props.animationType).toBe("fade");
  });
});
