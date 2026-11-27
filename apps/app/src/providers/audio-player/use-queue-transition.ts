import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

/** Safety net: end a seamless hop even if the next source never reports loaded/playing. */
const TRANSITION_SAFETY_MS = 2500;

/** Minimum time a hop is held before the settle check may lift it. */
const TRANSITION_MIN_HOLD_MS = 150;

/**
 * Whether a seamless hop can end: the new source's clock has genuinely reset
 * (or there was no meaningful prior time to begin with) and the hop has been
 * held for at least {@link TRANSITION_MIN_HOLD_MS}.
 */
export function hasTransitionSettled(
  fromSeconds: number,
  nowSeconds: number,
  elapsedMs: number,
): boolean {
  const clockReset = fromSeconds <= 0.75 || nowSeconds < fromSeconds - 0.5;
  return clockReset && elapsedMs >= TRANSITION_MIN_HOLD_MS;
}

/**
 * Seamless queue hop state: while transitioning, play/progress UI holds steady
 * and raw engine pause events are ignored.
 */
export function useQueueTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);
  // Engine time at the moment a transition began. Lets us detect when the new
  // source's clock has genuinely reset (vs. still reporting the outgoing track).
  const fromTimeRef = useRef(0);
  /** Last rendered engine position (written during render by the provider). */
  const lastEngineTimeRef = useRef(0);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const clearTransition = useCallback(() => {
    transitionRef.current = false;
    setIsTransitioning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const beginTransition = useCallback(() => {
    transitionRef.current = true;
    startedAtRef.current = Date.now();
    fromTimeRef.current = lastEngineTimeRef.current;
    setIsTransitioning(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(clearTransition, TRANSITION_SAFETY_MS);
  }, [clearTransition]);

  return {
    isTransitioning,
    transitionRef,
    startedAtRef,
    fromTimeRef,
    lastEngineTimeRef,
    beginTransition,
    clearTransition,
  };
}

/**
 * End the seamless transition only once the new source's clock has genuinely
 * reset. After a swap/replace the engine can briefly report the outgoing
 * track's near-end time; lifting the hold then would make the queue bar jump
 * to the end of the incoming track and snap back.
 */
export function useSettleTransition({
  isTransitioning,
  isLoaded,
  currentTime,
  startedAtRef,
  fromTimeRef,
  clearTransition,
}: {
  isTransitioning: boolean;
  isLoaded: boolean;
  currentTime: number | undefined;
  startedAtRef: RefObject<number>;
  fromTimeRef: RefObject<number>;
  clearTransition: () => void;
}) {
  useEffect(() => {
    if (!isTransitioning || !isLoaded) return;
    const elapsed = Date.now() - startedAtRef.current;
    if (!hasTransitionSettled(fromTimeRef.current, currentTime ?? 0, elapsed)) return;
    clearTransition();
  }, [isTransitioning, isLoaded, currentTime, clearTransition, startedAtRef, fromTimeRef]);
}
