import { type ReactNode, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/run-when-idle";

/**
 * Mounts children once the JS thread is idle so the cold-start tree can paint a
 * thin shell first. Uses {@link runWhenIdle} (Jest runs the task synchronously).
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
    const handle = runWhenIdle(() => setReady(true));
    return () => handle.cancel();
  }, []);

  if (!ready) return fallback;
  return children;
}
