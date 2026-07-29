import { useAnimatedKeyboard } from "react-native-reanimated";

/**
 * Shared keyboard height for Reanimated styles (native).
 * Web resolves `use-animated-keyboard-height.web.ts` instead — Reanimated's
 * `useAnimatedKeyboard` is not implemented on web and logs a WARN if called.
 */
export function useAnimatedKeyboardHeight() {
  return useAnimatedKeyboard().height;
}
