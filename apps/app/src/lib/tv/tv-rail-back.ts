/**
 * Coordinates the TV side rail with the root Back/Menu policy.
 *
 * - {@link WideAppTabs} registers a handler that expands + focuses the rail when
 *   Back is pressed while D-pad focus is in tab content.
 * - It also publishes whether the rail is currently expanded, so
 *   {@link TvRemoteBridge} knows when Back/Menu should fall through to the
 *   system (Android TV home screen / tvOS Home) — required by Android TV
 *   quality guideline TV-DB and the tvOS HIG (no exit confirmation).
 */

type RailBackHandler = () => boolean;

let handler: RailBackHandler | null = null;
let railExpanded = true;
const listeners = new Set<() => void>();

export function registerTvRailBackHandler(next: RailBackHandler | null): void {
  handler = next;
}

/** Returns true when the rail was collapsed and has now been expanded + focused. */
export function tryExpandTvRailOnBack(): boolean {
  return handler?.() ?? false;
}

export function setTvRailExpanded(expanded: boolean): void {
  if (expanded === railExpanded) return;
  railExpanded = expanded;
  for (const listener of listeners) listener();
}

export function isTvRailExpanded(): boolean {
  return railExpanded;
}

export function subscribeTvRailExpanded(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
