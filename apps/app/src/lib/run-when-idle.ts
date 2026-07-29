import { installRequestIdleCallbackPolyfill } from "@/lib/request-idle-callback-polyfill";

export type IdleTaskHandle = {
  cancel: () => void;
};

type IdleRequest = (callback: () => void) => number;
type IdleCancel = (id: number) => void;

installRequestIdleCallbackPolyfill();

const requestIdle: IdleRequest = globalThis.requestIdleCallback.bind(globalThis);
const cancelIdle: IdleCancel = globalThis.cancelIdleCallback.bind(globalThis);

/**
 * Run work when the JS thread is idle — replaces deprecated
 * `InteractionManager.runAfterInteractions` for heavy deferred tasks.
 */
export function runWhenIdle(task: () => void): IdleTaskHandle {
  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    task();
  };

  const id = requestIdle(run);
  return {
    cancel: () => {
      cancelled = true;
      cancelIdle(id);
    },
  };
}
