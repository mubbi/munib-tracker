import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { consumePendingRtlReloadLocale } from "@/i18n";
import { applyRtlForLocale } from "@/lib/i18n/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Runs a deferred native RTL reload after the first paint so startup hydration
 * (theme + preferences + splash dismiss) is never blocked on reloadAppAsync.
 *
 * Waits for preferences to finish hydrating: `bootstrapAppLocale` queues the
 * pending locale inside `preferencesStore.load()`, which flips `isReady` only
 * afterwards. The UI can mount earlier (ThemeProvider's hydration timeout on a
 * slow cold start), and reading the queue on mount would then miss the reload —
 * leaving RTL strings on an LTR layout, and the retry guard in `changeAppLocale`
 * gives up for good on the next launch.
 */
export function RtlLayoutBootstrap() {
  const started = useRef(false);
  const prefsReady = useStore(preferencesStore, (s) => s.isReady);

  useEffect(() => {
    if (!prefsReady || started.current || Platform.OS === "web") return;

    const locale = consumePendingRtlReloadLocale();
    if (!locale) return;

    started.current = true;
    const task = runWhenIdle(() => {
      void applyRtlForLocale(locale);
    });

    return () => task.cancel();
  }, [prefsReady]);

  return null;
}
