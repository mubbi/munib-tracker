/**
 * `requestIdleCallback` replaces React Native's removed `InteractionManager` (gone in
 * RN 0.87). React Native defines it on native, so this is a no-op there; it fills
 * the gap on web browsers without it (Safari). Installed early in app startup (see
 * `index.js`) before navigation or list code runs deferred work.
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
