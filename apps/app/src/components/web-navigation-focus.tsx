import { useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { blurActiveElement } from "@/lib/blur-active-element";

/**
 * Web-only guard: blur any focused control whenever the navigation tree
 * changes, as a backstop when a raw `Pressable` (not `PressableScale`) fires
 * a transition. Primary prevention lives in `PressableScale` / `AppHeader`.
 */
export function WebNavigationFocusManager() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = navigationRef.addListener("state", () => {
      blurActiveElement();
    });
    return unsubscribe;
  }, [navigationRef]);

  return null;
}
