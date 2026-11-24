import { fireEvent, screen } from "@testing-library/react-native";
import * as reanimated from "react-native-reanimated";

import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { triggerHaptic } from "@/lib/haptics";
import { useHingePosture } from "@/lib/platform/hinge";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import {
  MOCK_INTERACTIVE_TARGET,
  pressWebKey,
  resetWebKeyHandlerMock,
  webKeyHandlerState,
} from "@/test-support/mocks/web-key-handler";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock(
  "@/hooks/use-web-key-handler",
  () => require("@/test-support/mocks/web-key-handler").webKeyHandlerMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
// Imported transitively (reading typography → audio provider); never played here.
jest.mock("@/lib/platform/hinge", () => ({ useHingePosture: jest.fn(() => null) }));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

const hingeMock = jest.mocked(useHingePosture);

type Props = Parameters<typeof TasbeehCounter>[0];

function buildProps(overrides: Partial<Props> = {}): Props {
  return {
    count: 0,
    target: 33,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
    onReset: jest.fn(),
    ...overrides,
  };
}

async function renderCounter(overrides: Partial<Props> = {}) {
  const props = buildProps(overrides);
  const view = await renderWithTheme(<TasbeehCounter {...props} />);
  return { props, view };
}

const countButtons = () => screen.getAllByRole("button", { name: "Count" });

/** Opens a confirm dialog via `trigger`, then presses the dialog's confirm button. */
async function confirmVia(trigger: string, confirm = trigger) {
  await fireEvent.press(screen.getByRole("button", { name: trigger }));
  const buttons = screen.getAllByRole("button", { name: confirm });
  await fireEvent.press(buttons[buttons.length - 1]);
}

describe("TasbeehCounter", () => {
  let animationFrames: ReturnType<typeof captureAnimationFrames>;

  beforeEach(() => {
    animationFrames = captureAnimationFrames();
    resetWebKeyHandlerMock();
  });

  afterEach(() => {
    jest.mocked(triggerHaptic).mockClear();
    hingeMock.mockReturnValue(null);
    resetMockWindowSize();
    jest.restoreAllMocks();
  });

  it("shows the count, target and remaining copy", async () => {
    await renderCounter({ count: 10 });
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("/ 33")).toBeTruthy();
    expect(screen.getByText("of 33")).toBeTruthy();
    expect(screen.getByText("23 left")).toBeTruthy();
    expect(screen.getByText("Tap the circle to count")).toBeTruthy();
  });

  it("increments with a light haptic on tap", async () => {
    const { props } = await renderCounter({ count: 10 });
    await fireEvent.press(countButtons()[0]);
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("light");
  });

  it("clamps the displayed count to the target", async () => {
    await renderCounter({ count: 50 });
    expect(screen.getByText("33")).toBeTruthy();
    expect(screen.queryByText("50")).toBeNull();
  });

  it("shows the unlimited label and no remaining pill without a target", async () => {
    await renderCounter({ count: 4, target: 0 });
    expect(screen.getByText("unlimited")).toBeTruthy();
    expect(screen.queryByText(/left$/)).toBeNull();
  });

  it("disables undo at zero", async () => {
    await renderCounter({ count: 0 });
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it.each([
    {
      trigger: "Undo",
      title: "Undo last count?",
      message: "This will subtract one from your current count.",
    },
    { trigger: "Reset", title: "Reset counter?", message: "Your count of 5 will be cleared." },
  ])("asks before $trigger", async ({ trigger, title, message }) => {
    await renderCounter({ count: 5 });
    await fireEvent.press(screen.getByRole("button", { name: trigger }));
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(message)).toBeTruthy();
  });

  it("decrements after confirming undo", async () => {
    const { props } = await renderCounter({ count: 5 });
    await confirmVia("Undo");
    expect(props.onDecrement).toHaveBeenCalledTimes(1);
  });

  it("resets with a medium haptic after confirming reset", async () => {
    const { props } = await renderCounter({ count: 5 });
    await confirmVia("Reset");
    expect(props.onReset).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("medium");
  });

  it("does nothing when the dialog is cancelled", async () => {
    const { props } = await renderCounter({ count: 5 });
    await confirmVia("Reset", "Cancel");
    expect(props.onReset).not.toHaveBeenCalled();
    expect(screen.queryByText("Reset counter?")).toBeNull();
  });

  it("celebrates with a success haptic when the target is reached", async () => {
    const { props, view } = await renderCounter({ count: 32 });
    expect(triggerHaptic).not.toHaveBeenCalledWith("success");
    await view.rerender(<TasbeehCounter {...props} count={33} />);
    expect(triggerHaptic).toHaveBeenCalledWith("success");
    expect(screen.getByText("Complete")).toBeTruthy();
    expect(screen.getByText("MashaAllah — target reached")).toBeTruthy();
  });

  it("ignores taps at the limit", async () => {
    const { props } = await renderCounter({ count: 33 });
    await fireEvent.press(countButtons()[0]);
    expect(props.onIncrement).not.toHaveBeenCalled();
  });

  it("starts a new round after confirming Start again", async () => {
    const { props } = await renderCounter({ count: 33 });
    await fireEvent.press(screen.getByText("Start again"));
    expect(screen.getByText("Start again?")).toBeTruthy();
    const again = screen.getAllByRole("button", { name: "Start again" });
    await fireEvent.press(again[again.length - 1]);
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  it("finishes the ring animation within its frames", async () => {
    const { props, view } = await renderCounter({ count: 1 });
    await view.rerender(<TasbeehCounter {...props} count={20} />);
    // Each frame advances 500ms; the 420ms ease must stop scheduling frames.
    for (let ms = 0; animationFrames.frames.length > 0 && ms < 10_000; ms += 500) {
      await animationFrames.flush(ms);
    }
    expect(animationFrames.frames).toHaveLength(0);
  });

  it("cancels the ring animation on unmount", async () => {
    const { props, view } = await renderCounter({ count: 1 });
    await view.rerender(<TasbeehCounter {...props} count={2} />);
    await view.unmount();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  describe("mode bar", () => {
    it("selects a preset mode", async () => {
      const onSelectMode = jest.fn();
      await renderCounter({ count: 3, target: 99, onSelectMode });
      expect(screen.getByRole("tab", { name: "99, count 3" })).toBeSelected();
      await fireEvent.press(screen.getByRole("tab", { name: "unlimited, count 3" }));
      expect(onSelectMode).toHaveBeenCalledWith(0);
    });

    it("opens the custom target picker", async () => {
      const onCustom = jest.fn();
      await renderCounter({ count: 3, target: 99, onSelectMode: jest.fn(), onCustom });
      await fireEvent.press(screen.getByRole("tab", { name: "Custom, count 3" }));
      expect(onCustom).toHaveBeenCalled();
    });

    it("selects the custom segment for a non-preset target", async () => {
      await renderCounter({ count: 1, target: 313, onSelectMode: jest.fn(), onCustom: jest.fn() });
      expect(screen.getByRole("tab", { name: "313, count 1" })).toBeSelected();
    });

    it("omits the custom segment without onCustom", async () => {
      await renderCounter({ target: 0, onSelectMode: jest.fn() });
      expect(screen.getByRole("tab", { name: "unlimited, count 0" })).toBeSelected();
      expect(screen.queryByRole("tab", { name: /Custom/ })).toBeNull();
    });

    it("slides the thumb once the track is measured", async () => {
      await renderCounter({ target: 99, onSelectMode: jest.fn() });
      const [track] = queryHostsByRole("tablist");
      await fireEvent(track, "layout", { nativeEvent: { layout: { width: 320, height: 40 } } });
      // Track children: the animated thumb + one segment per mode.
      expect(track.children).toHaveLength(5);
    });
  });

  it("adds a full-width tap pad in tabletop posture", async () => {
    hingeMock.mockReturnValue("halfOpen");
    const { props } = await renderCounter({ count: 2 });
    expect(countButtons()).toHaveLength(2);
    await fireEvent.press(countButtons()[1]);
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("skips the tabletop pad and keyboard shortcuts", async () => {
      hingeMock.mockReturnValue("halfOpen");
      await renderCounter({ count: 33, onSelectMode: jest.fn() });
      expect(countButtons()).toHaveLength(1);
      expect(screen.getByText("Start again")).toBeTruthy();
      expect(webKeyHandlerState.enabled).toBe(false);
    });

    it("uses the remote-control hint", async () => {
      await renderCounter({ target: 0 });
      expect(screen.getByText("Press Select to count")).toBeTruthy();
    });
  });

  describe("desktop web keyboard", () => {
    usePlatform({ OS: "web" });

    beforeEach(() => setMockWindowSize(1024));

    it("shows the keyboard hint", async () => {
      await renderCounter({ count: 1 });
      expect(screen.getByText("Click the circle or press Space to count")).toBeTruthy();
    });

    it.each([" ", "Enter"])("counts on %j", async (key) => {
      const { props } = await renderCounter({ count: 1 });
      expect(await pressWebKey(key)).toBe(true);
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
    });

    it.each([
      { label: "other keys", key: "a", target: undefined },
      { label: "a focused control", key: " ", target: MOCK_INTERACTIVE_TARGET },
    ])("ignores $label", async ({ key, target }) => {
      const { props } = await renderCounter({ count: 1 });
      expect(await pressWebKey(key, target)).toBeUndefined();
      expect(props.onIncrement).not.toHaveBeenCalled();
    });

    it("does not auto-repeat held keys", async () => {
      const { props } = await renderCounter({ count: 1 });
      const handler = webKeyHandlerState.handler as (event: object) => boolean | undefined;
      expect(handler({ key: " ", repeat: true })).toBe(true);
      expect(props.onIncrement).not.toHaveBeenCalled();
    });

    it.each([
      { label: "the screen opts out", keyboardShortcuts: false, openDialog: false },
      { label: "a confirm dialog is open", keyboardShortcuts: true, openDialog: true },
    ])("disables shortcuts while $label", async ({ keyboardShortcuts, openDialog }) => {
      await renderCounter({ count: 1, keyboardShortcuts });
      if (openDialog) await fireEvent.press(screen.getByRole("button", { name: "Reset" }));
      expect(webKeyHandlerState.enabled).toBe(false);
    });
  });

  it("snaps progress without animation under reduced motion", async () => {
    jest.spyOn(reanimated, "useReducedMotion").mockReturnValue(true);
    const { props, view } = await renderCounter({ count: 10 });
    await view.rerender(<TasbeehCounter {...props} count={11} />);
    expect(animationFrames.frames).toHaveLength(0);
    expect(screen.getByText("22 left")).toBeTruthy();
  });
});
