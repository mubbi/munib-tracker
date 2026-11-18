import { renderHook } from "@testing-library/react-native";
import type { ScrollViewInstance } from "react-native";

import { usePlatform } from "@/test-support/platform";

import { useHorizontalWheelScroll } from "./use-horizontal-wheel-scroll";

type Wheel = { deltaX: number; deltaY: number; preventDefault: jest.Mock };

function makeNode(scrollWidth = 1000, clientWidth = 300) {
  let onWheel: ((event: Wheel) => void) | undefined;
  const node = {
    scrollWidth,
    clientWidth,
    scrollLeft: 0,
    addEventListener: jest.fn((_type: string, cb: (event: Wheel) => void) => {
      onWheel = cb;
    }),
    removeEventListener: jest.fn(),
  };
  const scroll = { getScrollableNode: () => node } as unknown as ScrollViewInstance;
  const wheel = (deltaX: number, deltaY: number) => {
    const event = { deltaX, deltaY, preventDefault: jest.fn() };
    onWheel?.(event);
    return event;
  };
  return { node, scroll, wheel };
}

async function setup() {
  const { result } = await renderHook(() => useHorizontalWheelScroll());
  return result.current;
}

describe("useHorizontalWheelScroll on web", () => {
  usePlatform({ OS: "web" });

  it("turns vertical wheel gestures into horizontal scrolling", async () => {
    const ref = await setup();
    const { node, scroll, wheel } = makeNode();
    ref(scroll);
    expect(node.addEventListener).toHaveBeenCalledWith("wheel", expect.any(Function), {
      passive: false,
    });
    const event = wheel(0, 120);
    expect(node.scrollLeft).toBe(120);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("leaves horizontal gestures alone", async () => {
    const ref = await setup();
    const { node, scroll, wheel } = makeNode();
    ref(scroll);
    expect(wheel(50, 10).preventDefault).not.toHaveBeenCalled();
    expect(node.scrollLeft).toBe(0);
  });

  it("leaves rows that do not overflow alone", async () => {
    const ref = await setup();
    const { node, scroll, wheel } = makeNode(300, 300);
    ref(scroll);
    wheel(0, 120);
    expect(node.scrollLeft).toBe(0);
  });

  it("detaches from the previous node when the ref changes or clears", async () => {
    const ref = await setup();
    const first = makeNode();
    ref(first.scroll);
    ref(null);
    expect(first.node.removeEventListener).toHaveBeenCalledWith("wheel", expect.any(Function));
  });

  it("ignores scroll views without a DOM node", async () => {
    const ref = await setup();
    expect(() => ref({} as ScrollViewInstance)).not.toThrow();
  });
});

describe("useHorizontalWheelScroll on native", () => {
  it("does nothing", async () => {
    const ref = await setup();
    const { node, scroll } = makeNode();
    ref(scroll);
    expect(node.addEventListener).not.toHaveBeenCalled();
  });
});
