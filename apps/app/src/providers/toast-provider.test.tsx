import { act, fireEvent, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import {
  AccessibilityInfo,
  PanResponder,
  type PanResponderCallbacks,
  StyleSheet,
} from "react-native";
import * as Reanimated from "react-native-reanimated";

import { Control, ZIndex } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import {
  TOAST_ACTION_DURATION_MS,
  type ToastContextValue,
  ToastHost,
  ToastProvider,
  useToast,
} from "@/providers/toast-provider";
import { pressableProps } from "@/test-support/fiber";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme, ThemeWrapper } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => ({ triggerHaptic: jest.fn() }));

const TOAST_DURATION_MS = 3500;

type Gesture = { dx?: number; dy?: number; vy?: number };

let panConfigs: PanResponderCallbacks[] = [];

/** Theme + toast provider with the banner host mounted after the hook under test. */
function ToastHarness({ children }: { children: ReactNode }) {
  return (
    <ThemeWrapper>
      <ToastProvider>
        {children}
        <ToastHost />
      </ToastProvider>
    </ThemeWrapper>
  );
}

/** Renders the provider + host and hands back a helper that drives the toast API. */
async function setup() {
  const { result } = await renderHook(() => useToast(), { wrapper: ToastHarness });
  const show = async (fn: (toast: ToastContextValue) => void) => {
    await act(async () => fn(result.current));
  };
  return { show, api: () => result.current };
}

const advance = (ms: number) =>
  act(async () => {
    jest.advanceTimersByTime(ms);
  });

/** Invokes a PanResponder callback captured from the most recent toast card. */
function pan(name: keyof PanResponderCallbacks, gesture: Gesture = {}) {
  const config = panConfigs[panConfigs.length - 1];
  const handler = config[name] as (e: unknown, g: unknown) => unknown;
  return handler({}, { dx: 0, dy: 0, vy: 0, ...gesture });
}

function hostTop(): number | undefined {
  const host = screen.container.queryAll(
    (node) => StyleSheet.flatten(node.props.style)?.zIndex === ZIndex.toast,
  )[0];
  return StyleSheet.flatten(host?.props.style)?.top;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.mocked(triggerHaptic).mockClear();
  // RN's jest setup ships AccessibilityInfo as shared jest.fn()s — reset per test.
  jest.mocked(AccessibilityInfo.announceForAccessibility).mockClear();
  panConfigs = [];
  const create = PanResponder.create.bind(PanResponder);
  jest.spyOn(PanResponder, "create").mockImplementation((config) => {
    panConfigs.push(config);
    return create(config);
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("useToast", () => {
  it("throws outside ToastProvider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useToast())).rejects.toThrow(
      "useToast must be used within ToastProvider",
    );
  });
});

describe("ToastHost", () => {
  it("renders nothing outside ToastProvider", async () => {
    await renderWithTheme(<ToastHost />);
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("renders nothing while there are no toasts", async () => {
    await setup();
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it.each([
    ["success", "success"],
    ["error", "error"],
    ["warning", "warning"],
    ["info", "light"],
  ] as const)("shows a %s toast and fires the %s haptic", async (type, haptic) => {
    const { show } = await setup();
    await show((toast) => toast[type]("Saved", "All good"));

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("All good")).toBeTruthy();
    expect(triggerHaptic).toHaveBeenCalledWith(haptic);
  });

  it("defaults show() to an info toast without a subtitle", async () => {
    const { show } = await setup();
    await show((toast) => toast.show("Plain"));

    expect(screen.getByText("Plain")).toBeTruthy();
    expect(triggerHaptic).toHaveBeenCalledWith("light");
  });

  it("keeps only the three most recent toasts", async () => {
    const { show } = await setup();
    await show((toast) => {
      for (const title of ["one", "two", "three", "four"]) toast.info(title);
    });

    expect(screen.queryByText("one")).toBeNull();
    expect(screen.getByText("four")).toBeTruthy();
    expect(screen.getAllByLabelText("Dismiss")).toHaveLength(3);
  });

  it("auto-dismisses after the toast duration", async () => {
    const { show } = await setup();
    await show((toast) => toast.success("Bye"));

    await act(async () => {
      jest.advanceTimersByTime(TOAST_DURATION_MS);
    });

    expect(screen.queryByText("Bye")).toBeNull();
  });

  it("dismisses when the close button is pressed", async () => {
    const { show } = await setup();
    await show((toast) => toast.error("Oops"));

    await fireEvent.press(screen.getByLabelText("Dismiss"));

    expect(screen.queryByText("Oops")).toBeNull();
  });

  it("offsets below the safe-area inset on native", async () => {
    const { show } = await setup();
    await show((toast) => toast.info("Top"));
    expect(hostTop()).toBe(8);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("uses the fixed web top offset", async () => {
      const { show } = await setup();
      await show((toast) => toast.info("Top"));
      expect(hostTop()).toBe(72);
    });
  });

  describe("on android", () => {
    usePlatform({ OS: "android" });

    it("still renders the toast card", async () => {
      const { show } = await setup();
      await show((toast) => toast.warning("Careful"));
      expect(screen.getByText("Careful")).toBeTruthy();
    });
  });
});

describe("toast swipe gesture", () => {
  async function showOne() {
    const { show } = await setup();
    await show((toast) => toast.info("Swipe me"));
  }

  it("ignores taps and only claims mostly-upward drags", async () => {
    await showOne();
    expect(pan("onStartShouldSetPanResponder")).toBe(false);
    expect(pan("onPanResponderTerminationRequest")).toBe(false);
    expect(pan("onMoveShouldSetPanResponder", { dy: -10, dx: 2 })).toBe(true);
    expect(pan("onMoveShouldSetPanResponder", { dy: -2, dx: 10 })).toBe(false);
    expect(pan("onMoveShouldSetPanResponder", { dy: 5 })).toBe(false);
  });

  it("tracks drags in both directions without dismissing", async () => {
    await showOne();
    pan("onPanResponderMove", { dy: -20 });
    pan("onPanResponderMove", { dy: 20 });
    expect(screen.getByText("Swipe me")).toBeTruthy();
  });

  it("springs back on a short release or a termination", async () => {
    await showOne();
    const spring = jest.spyOn(Reanimated, "withSpring");

    pan("onPanResponderRelease", { dy: -10, vy: -0.1 });
    pan("onPanResponderTerminate");

    expect(spring).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Swipe me")).toBeTruthy();
  });

  it.each([
    ["a long drag", { dy: -60, vy: 0 }],
    ["a fast flick", { dy: -5, vy: -1 }],
  ])("dismisses after %s once the exit animation finishes", async (_label, gesture) => {
    await showOne();
    jest.spyOn(Reanimated, "withTiming").mockImplementation(((
      value: number,
      _config: unknown,
      done?: (f: boolean) => void,
    ) => {
      done?.(true);
      return value;
    }) as unknown as typeof Reanimated.withTiming);
    const spring = jest.spyOn(Reanimated, "withSpring");

    await act(async () => {
      pan("onPanResponderRelease", gesture);
    });
    pan("onPanResponderTerminate");

    expect(screen.queryByText("Swipe me")).toBeNull();
    expect(spring).not.toHaveBeenCalled();
  });

  it("stays visible when the exit animation is interrupted", async () => {
    await showOne();
    jest.spyOn(Reanimated, "withTiming").mockImplementation(((
      value: number,
      _config: unknown,
      done?: (f: boolean) => void,
    ) => {
      done?.(false);
      return value;
    }) as unknown as typeof Reanimated.withTiming);

    await act(async () => {
      pan("onPanResponderRelease", { dy: -60 });
    });

    expect(screen.getByText("Swipe me")).toBeTruthy();
  });
});

describe("toast action", () => {
  it("shows an accessible action that runs once, dismisses the toast and lasts longer", async () => {
    const onPress = jest.fn();
    const { show } = await setup();
    await show((toast) =>
      toast.show("Logged", { type: "success", action: { label: "Undo", onPress } }),
    );

    // Still visible after the normal duration: there is time to reach the action.
    await act(async () => {
      jest.advanceTimersByTime(TOAST_DURATION_MS + 100);
    });
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Logged")).toBeNull();
  });

  it("auto-dismisses an action toast after the longer duration", async () => {
    const { show } = await setup();
    await show((toast) => toast.show("Logged", { action: { label: "Undo", onPress: jest.fn() } }));
    await act(async () => {
      jest.advanceTimersByTime(TOAST_ACTION_DURATION_MS + 100);
    });
    expect(screen.queryByText("Logged")).toBeNull();
  });
});

describe("ToastProvider unmount", () => {
  it("clears pending dismiss timers", async () => {
    const { show } = await setup();
    await show((toast) => toast.info("Pending"));
    const clear = jest.spyOn(globalThis, "clearTimeout");

    await act(async () => {
      screen.unmount();
    });

    expect(clear).toHaveBeenCalled();
  });
});

describe("toast accessibility", () => {
  it("announces title and subtitle to VoiceOver / TalkBack", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const { show } = await setup();

    await show((toast) => toast.success("Note saved", "Synced to your account"));

    expect(announce).toHaveBeenCalledWith("Note saved. Synced to your account");
  });

  it("speaks each native toast exactly once (announce only, no live region)", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    announce.mockClear();
    const { show } = await setup();
    await show((toast) => toast.info("Saved"));
    await show((toast) => toast.error("Couldn't save"));

    // A live region on top of the explicit announcement makes TalkBack read twice.
    const regions = screen.container
      .queryAll((node) => node.props.accessibilityLiveRegion != null)
      .map((node) => node.props.accessibilityLiveRegion);
    expect(regions.every((r) => r === "none")).toBe(true);
    expect(announce.mock.calls.map(([text]) => text)).toEqual(["Saved", "Couldn't save"]);
  });

  it("gives the dismiss control a button role and a 44pt target", async () => {
    const { show } = await setup();
    await show((toast) => toast.info("Saved"));

    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    const style = flattenStyle(
      pressableProps<{ style: (state: { pressed: boolean }) => object }>(dismiss).style({
        pressed: false,
      }),
    );
    expect(style.minWidth).toBeGreaterThanOrEqual(Control.minTouch);
    expect(style.minHeight).toBeGreaterThanOrEqual(Control.minTouch);
  });

  it("keeps error toasts until they are dismissed", async () => {
    const { show } = await setup();
    await show((toast) => toast.error("Couldn't sync"));

    await advance(TOAST_ACTION_DURATION_MS * 3);

    expect(screen.getByText("Couldn't sync")).toBeTruthy();
  });

  it("does not auto-dismiss an action toast while a screen reader is on", async () => {
    jest.spyOn(AccessibilityInfo, "isScreenReaderEnabled").mockResolvedValueOnce(true);
    const { show } = await setup();
    await act(async () => {});

    await show((toast) =>
      toast.show("Marked Fajr", { action: { label: "Undo", onPress: jest.fn() } }),
    );
    await advance(TOAST_ACTION_DURATION_MS * 3);

    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
  });
});

describe("toast lifecycle", () => {
  it("returns an id that dismiss() accepts, calling onDismiss once", async () => {
    const onDismiss = jest.fn();
    const { show, api } = await setup();
    let id = "";
    await show((toast) => {
      id = toast.show("Removed", { onDismiss });
    });

    await act(async () => api().dismiss(id));
    await act(async () => api().dismiss(id));

    expect(screen.queryByText("Removed")).toBeNull();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when the toast times out or is pushed out", async () => {
    const timedOut = jest.fn();
    const pushedOut = jest.fn();
    const { show } = await setup();
    await show((toast) => toast.show("first", { onDismiss: pushedOut }));
    await show((toast) => {
      for (const title of ["two", "three", "four"]) toast.info(title);
    });
    expect(pushedOut).toHaveBeenCalledTimes(1);

    await show((toast) => toast.show("later", { onDismiss: timedOut }));
    await advance(TOAST_DURATION_MS);
    expect(timedOut).toHaveBeenCalledTimes(1);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("drops the action (toasts take no D-pad focus) but still shows the toast", async () => {
      const { show } = await setup();
      await show((toast) =>
        toast.show("Marked", { action: { label: "Undo", onPress: jest.fn() } }),
      );

      expect(screen.getByText("Marked")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    });
  });
});

describe("toast on web", () => {
  usePlatform({ OS: "web" });

  it("writes messages into live regions mounted before the first toast", async () => {
    const { show } = await setup();
    expect(screen.container.queryAll((n) => n.props.role === "status")).toHaveLength(1);

    await show((toast) => toast.success("Saved"));
    const status = screen.container.queryAll((n) => n.props.role === "status");
    expect(String(status[0]?.props.children)).toContain("Saved");

    await show((toast) => toast.error("Couldn't save"));
    const alert = screen.container.queryAll(
      (n) => n.props.role === "alert" && n.props["aria-live"] === "assertive",
    );
    expect(String(alert[0]?.props.children)).toContain("Couldn't save");
  });

  it("does not announce through the native API", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const { show } = await setup();
    await show((toast) => toast.info("Saved"));
    expect(announce).not.toHaveBeenCalled();
  });

  it("pauses the auto-dismiss while focus is inside the toast", async () => {
    const { show } = await setup();
    await show((toast) => toast.info("Hold on"));
    const card = screen.container.queryAll(
      (n) => typeof n.props.onFocus === "function" && typeof n.props.onBlur === "function",
    )[0];

    await act(async () => card?.props.onFocus());
    await advance(TOAST_DURATION_MS * 2);
    expect(screen.getByLabelText("Dismiss")).toBeTruthy();

    await act(async () => card?.props.onBlur());
    await advance(TOAST_DURATION_MS);
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });
});
