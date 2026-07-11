import { type ReactNode, useEffect, useState } from "react";
import { InteractionManager } from "react-native";

/**
 * Mounts children after the first interactions settle so the cold-start tree
 * can paint a thin shell before heavy providers initialize.
 */
export function IdleMount({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => handle.cancel();
  }, []);

  if (!ready) return fallback;
  return children;
}
