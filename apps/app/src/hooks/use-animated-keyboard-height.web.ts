import { useSharedValue } from "react-native-reanimated";

/**
 * Web stub: browsers handle the on-screen keyboard without Reanimated insets.
 * Avoids calling `useAnimatedKeyboard`, which is unsupported on web.
 */
export function useAnimatedKeyboardHeight() {
  return useSharedValue(0);
}
