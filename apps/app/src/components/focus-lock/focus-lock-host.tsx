import { useEffect, useReducer, useRef, useState } from "react";

import { useFocusPlan } from "@/hooks/use-focus-lock";
import { useForegroundInterval } from "@/hooks/use-foreground-interval";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  drainNativeStatus,
  emergencyLeftNow,
  endWindowIfPrayed,
  syncNativePlan,
} from "@/lib/focus-lock/controller";
import type { NativeFocusTheme } from "@/lib/focus-lock/native";
import { focusLockCapability } from "@/lib/focus-lock/native";
import type { FocusWindow } from "@/lib/focus-lock/plan";
import { IDLE_SESSION, reduceFocusSession } from "@/lib/focus-lock/state";
import { ensureHomeMasjidLoaded } from "@/lib/masjid/home-masjid";
import { isTV } from "@/lib/platform/is-tv";
import { focusLockStore } from "@/stores/focus-lock-store";
import { trackerStore } from "@/stores/tracker-store";

import { FocusSoftPrompt } from "./focus-soft-prompt";

/** Re-arm the native plan at most this often while nothing changes (covers day rollover). */
const RESYNC_MS = 15 * 60_000;

/**
 * NF-3.13 root host (mounted once in `app/_layout.tsx`):
 * - re-plans on prefs / location / tracker / masjid changes, app foreground and
 *   every 15 minutes, and hands the windows to the native scheduler;
 * - marking the salah completed anywhere ends its window (`endWindowNow`);
 * - drains emergency unlocks taken on the shield / overlay into the local log;
 * - shows the soft in-app prompt where the OS can't block (web, iOS without the
 *   entitlement — D17). Hidden on TV.
 */
export function FocusLockHost() {
  if (isTV()) return null;
  return <FocusLockHostInner />;
}

function FocusLockHostInner() {
  const plan = useFocusPlan(15_000);
  const { colors } = useThemeTokens();
  const hard = focusLockCapability() === "hard";
  const previous = useRef<readonly FocusWindow[]>([]);
  const [foregroundTick, setForegroundTick] = useState(0);
  const [session, dispatch] = useReducer(reduceFocusSession, IDLE_SESSION);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const theme: NativeFocusTheme = {
    accent: colors.accent,
    accentForeground: colors.accentForeground,
    background: colors.background,
    foreground: colors.foreground,
    muted: colors.mutedForeground,
  };
  const themeKey = Object.values(theme).join("|");
  const planKey = plan.windows
    .map((w) => `${w.id}@${w.start.getTime()}-${w.end.getTime()}`)
    .join(",");
  const prefsKey = JSON.stringify(plan.prefs);

  useEffect(() => {
    void ensureHomeMasjidLoaded().catch(() => {});
  }, []);
  // Re-plan on foreground and every 15 minutes while open (paused in the background).
  useForegroundInterval(() => setForegroundTick((n) => n + 1), RESYNC_MS, { immediate: false });

  // Marking the salah completed (any surface → tracker store) ends its window.
  useEffect(() => {
    return trackerStore.subscribe(() => {
      void endWindowIfPrayed(previous.current);
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: keys stand in for the plan / prefs / theme objects.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (hard) await drainNativeStatus();
      const snapshot = await syncNativePlan(theme);
      if (!cancelled) previous.current = snapshot.windows;
    })();
    return () => {
      cancelled = true;
    };
  }, [planKey, prefsKey, themeKey, foregroundTick, hard]);

  // Soft prompt session (JS mirror of the native rules).
  const softActive = !hard && plan.prefs.enabled ? plan.active : null;
  useEffect(() => {
    dispatch({ type: "tick", active: softActive });
  }, [softActive]);

  if (hard || !plan.prefs.enabled || session.phase !== "locked" || !plan.active) return null;
  if (dismissedId === plan.active.id) return null;

  const emergencyLeft = emergencyLeftNow(plan.prefs, plan.now);
  return (
    <FocusSoftPrompt
      window={plan.active}
      mode={plan.prefs.unlockMode}
      emergencyLeft={emergencyLeft}
      onDismiss={() => setDismissedId(plan.active?.id ?? null)}
      onUnlock={async (action) => {
        dispatch({ type: "unlock", action, mode: plan.prefs.unlockMode, emergencyLeft });
        const id = plan.active?.id;
        if (!id) return;
        if (action === "emergency") {
          await focusLockStore.getState().recordEmergency([new Date().toISOString()]);
        }
        if (action !== "markedPrayed") await focusLockStore.getState().markEnded(id);
      }}
    />
  );
}
