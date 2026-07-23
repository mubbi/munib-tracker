import { act, renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { getReadingFullscreenActive, setReadingFullscreenActive } from "@/lib/reading-fullscreen";

jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => undefined | (() => void)) => {
    // Run mount + cleanup the same way React Navigation would for a focused screen.
    const { useEffect } = require("react");
    useEffect(() => effect(), [effect]);
  },
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: jest.fn(() => false),
}));

import { isTV } from "@/lib/platform/is-tv";

const isTVMock = isTV as jest.MockedFunction<typeof isTV>;

describe("useReadingFullscreen", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    setReadingFullscreenActive(false);
    isTVMock.mockReturnValue(false);
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("supports immersive toggle on iOS", async () => {
    Platform.OS = "ios";
    const { result } = renderHook(() => useReadingFullscreen());

    expect(result.current.supported).toBe(true);
    expect(result.current.active).toBe(false);

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(true);

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(false);
  });

  it("supports immersive toggle on Android", async () => {
    Platform.OS = "android";
    const { result } = renderHook(() => useReadingFullscreen());

    expect(result.current.supported).toBe(true);

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(true);

    await act(async () => {
      await result.current.exit();
    });
    expect(result.current.active).toBe(false);
  });

  it("does not support fullscreen on TV", () => {
    Platform.OS = "android";
    isTVMock.mockReturnValue(true);
    const { result } = renderHook(() => useReadingFullscreen());
    expect(result.current.supported).toBe(false);
  });

  it("exits on blur when exitOnBlur is set", async () => {
    Platform.OS = "ios";
    const { result, unmount } = renderHook(() => useReadingFullscreen({ exitOnBlur: true }));

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(true);

    unmount();
    expect(getReadingFullscreenActive()).toBe(false);
  });
});
