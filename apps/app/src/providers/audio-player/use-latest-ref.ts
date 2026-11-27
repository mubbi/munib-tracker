import { type RefObject, useRef } from "react";

/**
 * A ref mirrored from `value` on every render, so callbacks and timers read the
 * latest state without re-subscribing. Callers may still write `ref.current`
 * imperatively between renders (the next render re-syncs it from state).
 */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
