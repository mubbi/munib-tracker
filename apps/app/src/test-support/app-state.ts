import { AppState } from "react-native";

/**
 * Spies on `AppState.addEventListener` and keeps the latest `change` handler,
 * for modules that arm a foreground listener lazily. Call at module scope (before
 * the subject arms its listener); `emit("active")` simulates a foreground.
 */
export function captureAppStateListener() {
  let handler: ((next: string) => void) | undefined;
  const spy = jest.spyOn(AppState, "addEventListener").mockImplementation(((
    _type: string,
    listener: (next: string) => void,
  ) => {
    handler = listener;
    return { remove: jest.fn() };
  }) as unknown as typeof AppState.addEventListener);
  return {
    spy,
    isArmed: () => handler !== undefined,
    emit: (next: string) => handler?.(next),
  };
}
