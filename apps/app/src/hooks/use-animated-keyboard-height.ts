import { useEffect } from "react";
import { Keyboard, type KeyboardEvent, Platform } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

const FALLBACK_DURATION_MS = 250;

/**
 * Shared keyboard height for Reanimated styles (native).
 *
 * Reanimated 4 deprecated `useAnimatedKeyboard` (it points to
 * react-native-keyboard-controller). We avoid a new native dependency and drive
 * the shared value from React Native's own `Keyboard` events instead: iOS uses
 * the `Will*` events with the system animation duration so the sheet moves in
 * step with the keyboard; Android only emits `Did*` events.
 *
 * Web resolves `use-animated-keyboard-height.web.ts` (always 0).
 */
export function useAnimatedKeyboardHeight() {
  const height = useSharedValue(0);

  useEffect(() => {
    const isIOS = Platform.OS === "ios";
    const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";

    const animateTo = (value: number, event?: KeyboardEvent) => {
      const duration =
        event?.duration && event.duration > 0 ? event.duration : FALLBACK_DURATION_MS;
      height.value = withTiming(value, {
        duration,
        easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
      });
    };

    const showSub = Keyboard.addListener(showEvent, (event) =>
      animateTo(event.endCoordinates.height, event),
    );
    const hideSub = Keyboard.addListener(hideEvent, (event) => animateTo(0, event));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height]);

  return height;
}
