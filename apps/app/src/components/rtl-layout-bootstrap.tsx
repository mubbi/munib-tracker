import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { consumePendingRtlReloadLocale } from "@/i18n";
import { applyRtlForLocale } from "@/lib/i18n/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";

/**
 * Runs a deferred native RTL reload after the first paint so startup hydration
 * (theme + preferences + splash dismiss) is never blocked on reloadAppAsync.
 */
export function RtlLayoutBootstrap() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current || Platform.OS === "web") return;

    const locale = consumePendingRtlReloadLocale();
    if (!locale) return;

    started.current = true;
    const task = runWhenIdle(() => {
      void applyRtlForLocale(locale);
    });

    return () => task.cancel();
  }, []);

  return null;
}
