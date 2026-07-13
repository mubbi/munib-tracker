import { useEffect, useState } from "react";
import {
  InteractionManager,
  Platform,
  RefreshControl,
  type RefreshControlProps,
  StyleSheet,
  View,
} from "react-native";

/**
 * Android `SwipeRefreshLayout.getChildDrawingOrder` can return a stale
 * `mCircleViewIndex` (≥ childCount) during cold-start layout races — the exact
 * `getChildDrawingOrder() returned invalid index N (child count is N)` fatal
 * (Sentry REACT-NATIVE-6). Defer attaching the native control until after
 * interactions so splash/overlays settle first. iOS is unchanged.
 */
export function useDeferredAndroidRefreshReady(): boolean {
  const [ready, setReady] = useState(Platform.OS !== "android");

  useEffect(() => {
    if (Platform.OS !== "android") return;

    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  return ready;
}

/**
 * Drop-in `RefreshControl` for `ScrollView.refreshControl`.
 *
 * On Android, `ScrollView` clones this element as the
 * `AndroidSwipeRefreshLayout` wrapper around the native scroll view — so we must
 * still render `children` while deferred (never return `null`).
 */
export function SafeRefreshControl({ children, style, ...props }: RefreshControlProps) {
  const ready = useDeferredAndroidRefreshReady();

  if (Platform.OS === "android" && !ready) {
    return <View style={[styles.androidHost, style]}>{children}</View>;
  }

  return (
    <RefreshControl style={style} {...props}>
      {children}
    </RefreshControl>
  );
}

const styles = StyleSheet.create({
  androidHost: { flex: 1 },
});
