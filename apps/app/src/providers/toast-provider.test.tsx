import { act, fireEvent, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { PanResponder, type PanResponderCallbacks, StyleSheet } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { triggerHaptic } from "@/lib/haptics";
import {
  type ToastContextValue,
  ToastHost,
  ToastProvider,
  useToast,
} from "@/providers/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme, ThemeWrapper } from "@/test-support/render";

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
  return { show };
}

/** Invokes a PanResponder callback captured from the most recent toast card. */
function pan(name: keyof PanResponderCallbacks, gesture: Gesture = {}) {
  const config = panConfigs[panConfigs.length - 1];
  const handler = config[name] as (e: unknown, g: unknown) => unknown;
  return handler({}, { dx: 0, dy: 0, vy: 0, ...gesture });
}

function hostTop(): number | undefined {
  const host = screen.container.queryAll(
    (node) => StyleSheet.flatten(node.props.style)?.zIndex === 10002,
  )[0];
  return StyleSheet.flatten(host?.props.style)?.top;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.mocked(triggerHaptic).mockClear();
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
    expect(screen.queryByText("✕")).toBeNull();
  });

  it("renders nothing while there are no toasts", async () => {
    await setup();
    expect(screen.queryByText("✕")).toBeNull();
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
    expect(screen.getAllByText("✕")).toHaveLength(3);
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
