import { useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { blurActiveElement } from "@/lib/blur-active-element";

type RouteLike = { key?: string; name?: string; state?: StateLike };
type StateLike = { index?: number; routes?: readonly RouteLike[] };

/** Key of the deepest focused route — what the user is actually looking at. */
export function focusedLeafRouteKey(state: StateLike | undefined): string | undefined {
  let current = state;
  let key: string | undefined;
  while (current?.routes && current.routes.length > 0) {
    const route = current.routes[current.index ?? current.routes.length - 1];
    if (!route) break;
    key = route.key ?? route.name;
    current = route.state;
  }
  return key;
}

/**
 * Web-only: release DOM focus when the **focused route changes**, so React
 * Navigation can `aria-hidden` the outgoing screen without trapping focus in it.
 *
 * This is the single place focus is blurred for navigation — `PressableScale`
 * no longer blurs on every press (E-01 / F-41), so in-place actions (toggling
 * a chip, stepping a counter, opening a sheet) keep keyboard focus. State
 * updates that keep the same focused route (`setParams`, nested state churn)
 * leave focus alone.
 */
export function WebNavigationFocusManager() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (Platform.OS !== "web") return;
    let previousKey = navigationRef.isReady?.()
      ? focusedLeafRouteKey(navigationRef.getRootState?.() as StateLike | undefined)
      : undefined;
    const unsubscribe = navigationRef.addListener("state", (event) => {
      const state = (event as { data?: { state?: StateLike } } | undefined)?.data?.state;
      const nextKey = focusedLeafRouteKey(state);
      // Unknown previous/next route (first event, missing payload): blur, as
      // before — harmless at start-up, safe when the shape is unexpected.
      if (nextKey === undefined || previousKey === undefined || nextKey !== previousKey) {
        blurActiveElement();
      }
      previousKey = nextKey;
    });
    return unsubscribe;
  }, [navigationRef]);

  return null;
}
