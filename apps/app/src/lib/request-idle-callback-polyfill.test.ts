import { installRequestIdleCallbackPolyfill } from "@/lib/request-idle-callback-polyfill";

describe("installRequestIdleCallbackPolyfill", () => {
  const g = globalThis as Record<string, unknown>;
  const original = { request: g.requestIdleCallback, cancel: g.cancelIdleCallback };

  /** Remove the idle APIs (as in Safari) and install the polyfill. */
  function setup() {
    delete g.requestIdleCallback;
    delete g.cancelIdleCallback;
    installRequestIdleCallbackPolyfill();
    return { requestIdleCallback, cancelIdleCallback };
  }

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    g.requestIdleCallback = original.request;
    g.cancelIdleCallback = original.cancel;
  });

  it("keeps a native implementation", () => {
    const native = jest.fn();
    g.requestIdleCallback = native;
    installRequestIdleCallbackPolyfill();
    expect(g.requestIdleCallback).toBe(native);
  });

  it("runs the callback on the next tick with an idle deadline", () => {
    const { requestIdleCallback } = setup();
    const callback = jest.fn();
    requestIdleCallback(callback);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    const deadline = callback.mock.calls[0][0] as IdleDeadline;
    expect(deadline.didTimeout).toBe(false);
    expect(deadline.timeRemaining()).toBeGreaterThan(0);
    jest.advanceTimersByTime(100);
    expect(deadline.timeRemaining()).toBe(0);
  });

  it("cancels a pending callback", () => {
    const { requestIdleCallback, cancelIdleCallback } = setup();
    const callback = jest.fn();
    cancelIdleCallback(requestIdleCallback(callback));
    jest.advanceTimersByTime(10);
    expect(callback).not.toHaveBeenCalled();
  });
});
