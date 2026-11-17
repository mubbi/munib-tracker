/**
 * Safe-area insets for every platform.
 *
 * Native: `react-native-safe-area-context` (horizontal insets matter on iPhone Duo,
 * where the system rail sits on the left or right edge).
 * Web: see `use-app-safe-area-insets.web.ts` — from Expo SDK 58 the router stops
 * measuring web insets, so they come from CSS `env(safe-area-inset-*)` instead.
 */
export { useSafeAreaInsets as useAppSafeAreaInsets } from "react-native-safe-area-context";
