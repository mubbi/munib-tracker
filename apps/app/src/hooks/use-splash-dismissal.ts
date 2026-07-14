import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  Easing,
  runOnJS,
  type SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColdStartReady } from "@/lib/boot/cold-start";
import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { usePreferencesReady } from "@/stores/preferences-store";

const SPLASH_FAILSAFE_MS = 5000;
const SPLASH_FADE_MS = 450;

type SplashDismissal = {
  dismissed: boolean;
  opacity: SharedValue<number>;
};

/**
 * Holds the branded splash until preferences are hydrated and the first real
 * destination (intro or home) has painted — so tabs/hero never flash underneath.
 * Indexing bots skip the overlay so crawlers see content immediately.
 */
export function useSplashDismissal(): SplashDismissal {
  const prefsReady = usePreferencesReady();
  const painted = useColdStartReady();
  const skipOverlay = Platform.OS === "web" && isIndexingBot();
  const canDismiss = skipOverlay || (prefsReady && painted);

  const [dismissed, setDismissed] = useState(skipOverlay);
  const opacity = useSharedValue(skipOverlay ? 0 : 1);
  const fadingRef = useRef(skipOverlay);

  useEffect(() => {
    void SplashScreen.hideAsync();

    if (skipOverlay) {
      fadingRef.current = true;
      opacity.value = 0;
      setDismissed(true);
      return;
    }

    const finish = () => {
      setDismissed(true);
    };

    const fadeOut = () => {
      if (fadingRef.current) return;
      fadingRef.current = true;
      opacity.value = withTiming(
        0,
        { duration: SPLASH_FADE_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(finish)();
        },
      );
    };

    if (canDismiss) {
      fadeOut();
      return;
    }

    const failsafe = setTimeout(fadeOut, SPLASH_FAILSAFE_MS);
    return () => {
      clearTimeout(failsafe);
    };
  }, [canDismiss, opacity, skipOverlay]);

  return { dismissed, opacity };
}
