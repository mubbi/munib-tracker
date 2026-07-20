import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";

/**
 * App Actions / launcher shortcut / icon quick-action deep link:
 * `munib-tracker://mark-current`
 *
 * Enqueues a single mark-current command then leaves for the tracker.
 * Guarded so React Strict Mode remounts or a re-routed quick action cannot
 * enqueue multiple marks in one visit.
 */
export default function MarkCurrentDeepLinkScreen() {
  const router = useRouter();
  const enqueuedRef = useRef(false);

  useEffect(() => {
    if (enqueuedRef.current) return;
    enqueuedRef.current = true;

    void (async () => {
      await nativeEnqueueCommand({ type: "mark-current-obligatory", source: "deeplink" });
      router.replace("/(tabs)/tracker");
    })();
  }, [router]);

  return null;
}
