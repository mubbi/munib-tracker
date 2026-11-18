import { render, renderHook, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  SafeRefreshControl,
  useDeferredAndroidRefreshReady,
} from "@/components/ui/safe-refresh-control";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByType } from "@/test-support/queries";

const renderControl = () =>
  render(
    <SafeRefreshControl refreshing={false} onRefresh={jest.fn()} style={{ flex: 2 }}>
      <Text>Body</Text>
    </SafeRefreshControl>,
  );

const nativeControl = () => queryHostsByType("RCTRefreshControl")[0];

describe("SafeRefreshControl on iOS", () => {
  it("is ready immediately", async () => {
    const { result } = await renderHook(() => useDeferredAndroidRefreshReady());

    expect(result.current).toBe(true);
  });

  it("renders the native control straight away", async () => {
    await renderControl();

    expect(nativeControl()).toBeDefined();
  });
});

describe("SafeRefreshControl on Android", () => {
  usePlatform({ OS: "android" });
  let animation: ReturnType<typeof captureAnimationFrames>;
  beforeEach(() => {
    animation = captureAnimationFrames();
  });
  afterEach(() => jest.restoreAllMocks());

  it("keeps children in a plain host until the next frame", async () => {
    await renderControl();

    expect(screen.getByText("Body")).toBeTruthy();
    expect(nativeControl()).toBeUndefined();
  });

  it("attaches the native control after the deferred frame", async () => {
    await renderControl();
    await animation.flush(0);

    expect(nativeControl()).toBeDefined();
  });

  it("ignores the deferred frame after unmount", async () => {
    const { result, unmount } = await renderHook(() => useDeferredAndroidRefreshReady());
    await unmount();
    await animation.flush(0);

    expect(result.current).toBe(false);
  });
});
