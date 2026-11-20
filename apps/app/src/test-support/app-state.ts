import { AppState } from "react-native";

/**
 * Spies on `AppState.addEventListener` and keeps every live `change` handler,
 * for modules that arm foreground/background listeners lazily. Call at module
 * scope (before the subject arms its listener); `emit("active")` simulates a
 * foreground and reaches every listener still subscribed — like React Native,
 * where several subscribers can watch the same app-state changes.
 */
export function captureAppStateListener() {
  const handlers = new Set<(next: string) => void>();
  const spy = jest.spyOn(AppState, "addEventListener").mockImplementation(((
    _type: string,
    listener: (next: string) => void,
  ) => {
    handlers.add(listener);
    return {
      remove: jest.fn(() => {
        handlers.delete(listener);
      }),
    };
  }) as unknown as typeof AppState.addEventListener);
  return {
    spy,
    isArmed: () => handlers.size > 0,
    emit: (next: string) => {
      for (const handler of [...handlers]) handler(next);
    },
  };
}
