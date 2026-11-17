import { useSharedValue } from "react-native-reanimated";

/**
 * Web stub: browsers handle the on-screen keyboard without Reanimated insets.
 * Native builds track RN `Keyboard` events; web has no equivalent signal.
 */
export function useAnimatedKeyboardHeight() {
  return useSharedValue(0);
}
