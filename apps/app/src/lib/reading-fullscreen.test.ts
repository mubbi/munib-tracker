import {
  getReadingFullscreenActive,
  setReadingFullscreenActive,
  subscribeReadingFullscreen,
} from "@/lib/reading-fullscreen";

describe("reading-fullscreen store", () => {
  beforeEach(() => {
    setReadingFullscreenActive(false);
  });

  it("starts inactive", () => {
    expect(getReadingFullscreenActive()).toBe(false);
  });

  it("notifies subscribers when active flips", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeReadingFullscreen(listener);

    setReadingFullscreenActive(true);
    expect(getReadingFullscreenActive()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    setReadingFullscreenActive(true);
    expect(listener).toHaveBeenCalledTimes(1);

    setReadingFullscreenActive(false);
    expect(getReadingFullscreenActive()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    setReadingFullscreenActive(true);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
