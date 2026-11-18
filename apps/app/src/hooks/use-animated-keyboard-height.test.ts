import { act, renderHook } from "@testing-library/react-native";
import { Keyboard, type KeyboardEvent } from "react-native";

import { usePlatform } from "@/test-support/platform";

import { useAnimatedKeyboardHeight } from "./use-animated-keyboard-height";
import { useAnimatedKeyboardHeight as useWebKeyboardHeight } from "./use-animated-keyboard-height.web";

type Listener = (event: KeyboardEvent) => void;

const listeners = new Map<string, Listener>();
const remove = jest.fn();

/** Shared values are recreated by the global Reanimated mock, so keep the first one. */
async function setup() {
  const { result, unmount } = await renderHook(() => useAnimatedKeyboardHeight());
  return { height: result.current, unmount };
}

function keyboardEvent(height: number, duration?: number) {
  return { endCoordinates: { height }, duration } as unknown as KeyboardEvent;
}

beforeEach(() => {
  listeners.clear();
  remove.mockClear();
  jest.spyOn(Keyboard, "addListener").mockImplementation(((event: string, listener: Listener) => {
    listeners.set(event, listener);
    return { remove };
  }) as unknown as typeof Keyboard.addListener);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useAnimatedKeyboardHeight on iOS", () => {
  usePlatform({ OS: "ios" });

  it("follows the keyboard's will-show / will-hide events", async () => {
    const { height } = await setup();
    expect(height.value).toBe(0);
    await act(async () => listeners.get("keyboardWillShow")?.(keyboardEvent(300, 120)));
    expect(height.value).toBe(300);
    await act(async () => listeners.get("keyboardWillHide")?.(keyboardEvent(0, 0)));
    expect(height.value).toBe(0);
  });

  it("removes its listeners on unmount", async () => {
    const { unmount } = await setup();
    await unmount();
    expect(remove).toHaveBeenCalledTimes(2);
  });
});

describe("useAnimatedKeyboardHeight on Android", () => {
  usePlatform({ OS: "android" });

  it("follows the did-show / did-hide events", async () => {
    const { height } = await setup();
    await act(async () => listeners.get("keyboardDidShow")?.(keyboardEvent(280)));
    expect(height.value).toBe(280);
    await act(async () => listeners.get("keyboardDidHide")?.(keyboardEvent(0)));
    expect(height.value).toBe(0);
  });
});

describe("useAnimatedKeyboardHeight (web)", () => {
  it("is always zero", async () => {
    const { result } = await renderHook(() => useWebKeyboardHeight());
    expect(result.current.value).toBe(0);
  });
});
