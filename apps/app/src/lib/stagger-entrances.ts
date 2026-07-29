/** Active Stagger instances to snap visible after locale / layout changes. */
const layoutChangeListeners = new Set<() => void>();

export function registerStaggerLayoutListener(listener: () => void): () => void {
  layoutChangeListeners.add(listener);
  return () => {
    layoutChangeListeners.delete(listener);
  };
}

/**
 * Finishes every in-flight stagger entrance immediately. Called after a locale
 * switch so NativeTabs-retained screens (e.g. home) never stay at opacity 0 when
 * the route pathname flickers across an RTL reload.
 */
export function completeAllStaggerEntrances(): void {
  for (const listener of layoutChangeListeners) {
    listener();
  }
}
