/**
 * Coordinates the TV side rail with the root Back/Menu policy.
 *
 * - {@link WideAppTabs} registers a handler that, on Back,
 *   1. expands + focuses the rail when D-pad focus is in tab content, then
 *   2. returns to the Home tab when another tab is selected.
 * - It also publishes the rail state and whether Home is the selected tab, so
 *   {@link TvRemoteBridge} knows when Back/Menu should fall through to the
 *   system (Android TV home screen / tvOS Home). That only happens from the
 *   expanded rail on Home: Android TV wants the app's home destination to be
 *   the last screen before the launcher (TV-DB, "Navigation on TV"), and the
 *   tvOS HIG asks Back to open the parent screen. No exit confirmation.
 */

type RailBackHandler = () => boolean;

let handler: RailBackHandler | null = null;
let railExpanded = true;
let onHomeTab = true;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function registerTvRailBackHandler(next: RailBackHandler | null): void {
  handler = next;
}

/**
 * Runs the rail's Back step. Returns true when the rail handled it (expanded
 * the rail or switched to the Home tab); false means Back belongs to the system.
 */
export function tryExpandTvRailOnBack(): boolean {
  return handler?.() ?? false;
}

export function setTvRailExpanded(expanded: boolean): void {
  if (expanded === railExpanded) return;
  railExpanded = expanded;
  notify();
}

export function isTvRailExpanded(): boolean {
  return railExpanded;
}

/** Published by the rail: is the Home tab the selected tab? */
export function setTvOnHomeTab(home: boolean): void {
  if (home === onHomeTab) return;
  onHomeTab = home;
  notify();
}

/** True when the next Back at a tab root should leave the app (rail open on Home). */
export function isTvBackAtSystemRoot(): boolean {
  return railExpanded && onHomeTab;
}

export function subscribeTvRailExpanded(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
