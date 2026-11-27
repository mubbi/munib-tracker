import * as navigation from "@/lib/navigation";

/** Tolerates suites that stub `@/lib/navigation` without the pathname tracker. */
function currentPath(): string | null {
  return typeof navigation.getCurrentPathname === "function"
    ? navigation.getCurrentPathname()
    : null;
}

/**
 * TV focus memory (P10-05). React Native has no "which view has D-pad focus"
 * API, so focusable primitives (`PressableScale` and everything built on it)
 * report their own focus here. `Sheet` reads it when it opens and puts focus
 * back on that control after it closes — no `returnFocusRef` needed at the
 * ~70 call sites.
 */
export type TvFocusHandle = {
  /** Moves D-pad focus to the control. */
  focus: () => void;
  /** False once the control unmounted (its focus can no longer be restored). */
  isMounted: () => boolean;
};

type Entry = { handle: TvFocusHandle; pathname: string | null };

let last: Entry | null = null;

/** Records `handle` as the focused control (called from `onFocus` on TV). */
export function noteTvFocus(handle: TvFocusHandle): void {
  last = { handle, pathname: currentPath() };
}

/** Forgets `handle` when it unmounts, so a closed sheet's buttons never count as focused. */
export function forgetTvFocus(handle: TvFocusHandle): void {
  if (last?.handle === handle) last = null;
}

/** The control that last took D-pad focus and is still mounted, or `null`. */
export function lastTvFocus(): TvFocusHandle | null {
  if (!last?.handle.isMounted()) return null;
  return last.handle;
}

/**
 * The focused control to return to when an overlay closes: still mounted and
 * focused on the current route (not one left behind on a screen underneath).
 */
export function captureTvFocusOrigin(): TvFocusHandle | null {
  const handle = lastTvFocus();
  if (!handle || last?.pathname !== currentPath()) return null;
  return handle;
}

/**
 * Puts focus back on `origin` after an overlay closed, unless the route changed
 * since it opened or another live control already holds focus (the caller, the
 * native focus engine or a new screen moved it on purpose).
 */
export function restoreTvFocus(origin: TvFocusHandle | null, openedOnPath: string | null): void {
  if (!origin?.isMounted()) return;
  if (currentPath() !== openedOnPath) return;
  const current = lastTvFocus();
  if (current && current !== origin) return;
  origin.focus();
}

/** Test helper: clears the remembered focus. */
export function resetTvFocusMemory(): void {
  last = null;
}
