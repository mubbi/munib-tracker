import * as Router from "expo-router";
import { useCallback, useEffect, useState } from "react";

type LeaveAction = unknown;
type NavigationLike = { dispatch: (action: never) => void } | null | undefined;

/**
 * `usePreventRemove` / `useNavigation` come from the router; resolving them at
 * module level (with a no-op fallback) keeps unit tests that stub `expo-router`
 * without them working — the guard simply never triggers there.
 */
type PreventRemoveHook = (
  prevent: boolean,
  onPrevented: (event: { data: { action: LeaveAction } }) => void,
) => void;
const usePreventRemoveSafe: PreventRemoveHook =
  (Router as unknown as { usePreventRemove?: PreventRemoveHook }).usePreventRemove ??
  (() => undefined);
const useNavigationSafe: () => NavigationLike =
  (Router as unknown as { useNavigation?: () => NavigationLike }).useNavigation ?? (() => null);

/**
 * Asks before a stray back / swipe / link discards unsaved work. While `dirty`,
 * any attempt to leave is held; `visible` drives a "Discard?" dialog and
 * `confirm()` lets the held navigation through.
 */
export function useLeaveGuard(dirty: boolean) {
  const navigation = useNavigationSafe();
  const [held, setHeld] = useState<LeaveAction | null>(null);
  const [released, setReleased] = useState(false);

  usePreventRemoveSafe(dirty && !released, (event) => setHeld(event.data.action));

  // Once released the guard is off for this render; replay the held navigation.
  useEffect(() => {
    if (released && held != null) {
      const action = held;
      setHeld(null);
      navigation?.dispatch(action as never);
    }
  }, [released, held, navigation]);

  const confirm = useCallback(() => setReleased(true), []);
  const cancel = useCallback(() => setHeld(null), []);

  return { visible: held != null && !released, confirm, cancel };
}
