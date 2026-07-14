/**
 * Shared reading-fullscreen state for Qur'an (and any future long-form readers).
 *
 * Web drives this from the browser Fullscreen API; native iOS/Android drive it
 * from an in-app toggle that hides the status bar (and Android navigation bar
 * with transient swipe-to-reveal — see expo-navigation-bar's
 * BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE).
 */

type Listener = () => void;

let active = false;
const listeners = new Set<Listener>();

export function getReadingFullscreenActive(): boolean {
  return active;
}

export function subscribeReadingFullscreen(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setReadingFullscreenActive(next: boolean): void {
  if (active === next) return;
  active = next;
  for (const listener of listeners) listener();
}
