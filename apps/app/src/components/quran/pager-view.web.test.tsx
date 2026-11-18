import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { Text } from "react-native";

import type { PagerViewHandle, PagerViewProps } from "@/components/quran/pager-view-types";

// jest-expo resolves `pager-view` to the native file on iOS, so load the web
// implementation by its explicit path.
const PagerView = require("./pager-view.web").default as typeof import("./pager-view").default;

const mockPendingAnimations: Array<(finished: boolean) => void> = [];

// Stable shared values (so the width written in onLayout survives renders) and
// a `withTiming` that parks its completion callback for the test to fire.
jest.mock("react-native-reanimated", () => {
  const { createElement, forwardRef, useRef } = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View: forwardRef((props: Record<string, unknown>, ref: unknown) =>
        createElement(View, { ...props, ref }),
      ),
    },
    useSharedValue: (initial: unknown) => useRef({ value: initial }).current,
    useAnimatedStyle: (worklet: () => unknown) => worklet(),
    withTiming: (toValue: unknown, _config: unknown, done?: (finished: boolean) => void) => {
      if (done) mockPendingAnimations.push(done);
      return toValue;
    },
    Easing: { out: () => () => 0, cubic: () => 0 },
  };
});

async function renderPager(overrides: Partial<PagerViewProps> = {}) {
  const ref = createRef<PagerViewHandle>();
  const onPageSelected = jest.fn();
  await render(
    <PagerView ref={ref} onPageSelected={onPageSelected} {...overrides}>
      <Text>page zero</Text>
      <Text>page one</Text>
      <Text>page two</Text>
    </PagerView>,
  );
  return { ref, onPageSelected };
}

async function layOut(width = 320) {
  let host = screen.getByText(/^page /).parent;
  while (host && typeof host.props.onLayout !== "function") host = host.parent;
  if (!host) throw new Error("pager container not found");
  await fireEvent(host, "layout", { nativeEvent: { layout: { width, height: 600 } } });
}

async function finishAnimation(finished = true) {
  const done = mockPendingAnimations.pop();
  await act(async () => done?.(finished));
}

describe("PagerView (web)", () => {
  beforeEach(() => {
    mockPendingAnimations.length = 0;
  });

  it("mounts only the initial page", async () => {
    await renderPager({ initialPage: 1 });
    expect(screen.getByText("page one")).toBeTruthy();
    expect(screen.queryByText("page zero")).toBeNull();
  });

  it("jumps straight to a clamped page before layout", async () => {
    const { ref, onPageSelected } = await renderPager();
    await act(async () => ref.current?.setPage(9));
    expect(onPageSelected).toHaveBeenCalledWith({ nativeEvent: { position: 2 } });
    expect(screen.getByText("page two")).toBeTruthy();
  });

  it("ignores setPage to the current page", async () => {
    const { ref, onPageSelected } = await renderPager({ initialPage: 2 });
    await act(async () => ref.current?.setPage(2));
    expect(onPageSelected).not.toHaveBeenCalled();
  });

  it("mounts both pages while sliding", async () => {
    const { ref, onPageSelected } = await renderPager();
    await layOut();
    await act(async () => ref.current?.setPage(1));
    expect(screen.getByText("page zero")).toBeTruthy();
    expect(screen.getByText("page one")).toBeTruthy();
    expect(onPageSelected).not.toHaveBeenCalled();
  });

  it("settles on the target page when the slide finishes", async () => {
    const { ref, onPageSelected } = await renderPager();
    await layOut();
    await act(async () => ref.current?.setPage(1));
    await finishAnimation();
    expect(onPageSelected).toHaveBeenCalledWith({ nativeEvent: { position: 1 } });
    expect(screen.queryByText("page zero")).toBeNull();
  });

  it("stays mid-transition when a backwards slide is interrupted", async () => {
    const { ref, onPageSelected } = await renderPager({ initialPage: 1 });
    await layOut();
    await act(async () => ref.current?.setPage(0));
    await finishAnimation(false);
    expect(onPageSelected).not.toHaveBeenCalled();
    expect(screen.getByText("page zero")).toBeTruthy();
    expect(screen.getByText("page one")).toBeTruthy();
  });

  it("renders an empty pager without children", async () => {
    await render(<PagerView />);
    expect(screen.queryByText(/page/)).toBeNull();
  });
});
