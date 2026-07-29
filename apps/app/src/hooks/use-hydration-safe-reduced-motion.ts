import { useEffect, useState } from "react";
import { useReducedMotion } from "react-native-reanimated";

/**
 * Like Reanimated's `useReducedMotion`, but always returns `false` during SSR
 * and the first client paint so static HTML matches hydration (React #418).
 * After mount it reflects the real OS setting.
 */
export function useHydrationSafeReducedMotion(): boolean {
  const system = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready && system;
}
