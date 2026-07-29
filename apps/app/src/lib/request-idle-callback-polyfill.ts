/**
 * React Native does not ship `requestIdleCallback`. RN 0.86 deprecates
 * `InteractionManager` in favour of this API, so we polyfill it early in app
 * startup (see `index.js`) before navigation or list code runs deferred work.
 */
export function installRequestIdleCallbackPolyfill(): void {
  if (typeof globalThis.requestIdleCallback === "function") return;

  const requestIdleCallbackPolyfill = (callback: IdleRequestCallback): number => {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1) as unknown as number;
  };

  const cancelIdleCallbackPolyfill = (handle: number): void => {
    clearTimeout(handle);
  };

  globalThis.requestIdleCallback =
    requestIdleCallbackPolyfill as typeof globalThis.requestIdleCallback;
  globalThis.cancelIdleCallback =
    cancelIdleCallbackPolyfill as typeof globalThis.cancelIdleCallback;
}

installRequestIdleCallbackPolyfill();
