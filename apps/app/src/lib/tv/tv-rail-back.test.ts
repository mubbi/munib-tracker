import {
  isTvKeyDown,
  isTvMenuOrBackEvent,
  isTvNextEvent,
  isTvPlayPauseEvent,
  isTvPreviousEvent,
} from "@/hooks/use-tv-event-handler";
import {
  isTvRailExpanded,
  registerTvRailBackHandler,
  setTvRailExpanded,
  subscribeTvRailExpanded,
  tryExpandTvRailOnBack,
} from "@/lib/tv/tv-rail-back";

describe("tv rail back coordination", () => {
  afterEach(() => {
    registerTvRailBackHandler(null);
    setTvRailExpanded(true);
  });

  it("returns false when no rail is mounted so Back reaches the system", () => {
    expect(tryExpandTvRailOnBack()).toBe(false);
  });

  it("delegates to the registered rail handler", () => {
    registerTvRailBackHandler(() => true);
    expect(tryExpandTvRailOnBack()).toBe(true);
  });

  it("notifies subscribers only when the expanded state changes", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeTvRailExpanded(listener);

    setTvRailExpanded(true); // unchanged default
    expect(listener).not.toHaveBeenCalled();

    setTvRailExpanded(false);
    expect(isTvRailExpanded()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setTvRailExpanded(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("tv remote event classification", () => {
  const ev = (eventType: string, eventKeyAction?: number) => ({ eventType, eventKeyAction });

  it("treats Android key-up as not key-down and Apple TV (no action) as key-down", () => {
    expect(isTvKeyDown(ev("select", 0))).toBe(false);
    expect(isTvKeyDown(ev("select", 1))).toBe(true);
    expect(isTvKeyDown(ev("select"))).toBe(true);
  });

  it("classifies media keys", () => {
    expect(isTvPlayPauseEvent(ev("playPause"))).toBe(true);
    expect(isTvNextEvent(ev("fastForward"))).toBe(true);
    expect(isTvNextEvent(ev("next"))).toBe(true);
    expect(isTvPreviousEvent(ev("rewind"))).toBe(true);
    expect(isTvPreviousEvent(ev("previous"))).toBe(true);
    expect(isTvNextEvent(ev("right"))).toBe(false);
  });

  it("classifies menu / back", () => {
    expect(isTvMenuOrBackEvent(ev("menu"))).toBe(true);
    expect(isTvMenuOrBackEvent(ev("back"))).toBe(true);
    expect(isTvMenuOrBackEvent(ev("select"))).toBe(false);
  });
});
