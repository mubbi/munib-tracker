/**
 * Web-only media-element / Media Session plumbing for the global audio player
 * (`providers/audio-player-provider.tsx`). Callers gate on `Platform.OS === "web"`.
 */

/**
 * On web, expo-audio's fire-and-forget `play()` calls `HTMLMediaElement.play()`
 * without awaiting the promise it returns. When playback is interrupted by a
 * near-immediate `pause()`/`replace()` (rapid toggling or switching tracks) that
 * promise rejects with a benign AbortError. Since expo-audio drops the promise,
 * the rejection is unhandled and surfaces as an error (both in the browser and
 * through React Native's own promise-rejection tracker, which a DOM
 * `preventDefault` alone can't suppress). Patch `play()` at the source so the
 * returned promise always swallows that specific benign rejection; keep the
 * `unhandledrejection` listener as a belt-and-suspenders fallback.
 *
 * Returns the cleanup that removes the listener and restores `play()`.
 */
export function installWebPlayAbortGuard(): () => void {
  let restorePlay: (() => void) | undefined;
  const mediaProto =
    typeof HTMLMediaElement !== "undefined" ? HTMLMediaElement.prototype : undefined;
  if (mediaProto && !(mediaProto.play as { __munibPatched?: boolean }).__munibPatched) {
    const originalPlay = mediaProto.play;
    const patchedPlay = function patchedPlay(this: HTMLMediaElement) {
      const result = originalPlay.call(this);
      // The rejection only ever originates from a media-element play() here, so
      // swallowing the benign AbortError (interrupted by pause) is safe; other
      // errors still propagate.
      if (result && typeof result.then === "function") {
        return result.catch((error: { name?: string }) => {
          if (error?.name === "AbortError") return;
          throw error;
        });
      }
      return result;
    } as typeof mediaProto.play & { __munibPatched?: boolean };
    patchedPlay.__munibPatched = true;
    mediaProto.play = patchedPlay;
    restorePlay = () => {
      if (mediaProto.play === patchedPlay) mediaProto.play = originalPlay;
    };
  }

  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason as { name?: string; message?: string } | undefined;
    if (reason?.name === "AbortError" && /play\(\)/.test(String(reason.message ?? ""))) {
      event.preventDefault();
    }
  };
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("unhandledrejection", onRejection);
    restorePlay?.();
  };
}

/**
 * Point the Media Session next/previous-track actions at the queue, or clear
 * them (`null`). Errors from browsers without these actions are ignored.
 */
export function setMediaSessionQueueHandlers(
  handlers: { next: () => void; previous: () => void } | null,
): void {
  try {
    navigator.mediaSession.setActionHandler("nexttrack", handlers?.next ?? null);
    navigator.mediaSession.setActionHandler("previoustrack", handlers?.previous ?? null);
  } catch {
    // ignore
  }
}
