import type { Action } from "expo-quick-actions";
import * as QuickActions from "expo-quick-actions";
import { type Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import {
  resolveQuickActionHref,
  syncAppQuickActions,
} from "@/lib/appSurfaces/quickActions/syncQuickActions";

/**
 * Module-level guard: `expo-quick-actions`'s `useQuickActionRouting` re-runs its
 * effect whenever `router` identity changes and re-navigates to
 * `QuickActions.initial`. For Mark my Salah that re-opens `/mark-current`, which
 * enqueues another mark and (with cascading resolve) completes every Salah.
 * We handle routing ourselves and only honor each cold-start initial once.
 */
let handledInitialQuickActionKey: string | null = null;

function quickActionDedupeKey(action: Action): string {
  const href = typeof action.params?.href === "string" ? action.params.href : "";
  return `${action.id ?? ""}:${href}`;
}

/** Home-screen app-icon quick actions (NF-1.30). Pass `enabled: false` on TV. */
export function useAppQuickActions(enabled = true): void {
  const { t } = useTranslation();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (!enabled || Platform.OS === "web") return;

    let isMounted = true;

    const navigate = (action: Action, fromInitial: boolean) => {
      if (!isMounted) return;
      const href = resolveQuickActionHref(action);
      if (!href) return;

      if (fromInitial) {
        const key = quickActionDedupeKey(action);
        if (handledInitialQuickActionKey === key) return;
        handledInitialQuickActionKey = key;
      }

      // Match expo-quick-actions/router: defer so the navigator is ready.
      setTimeout(() => {
        if (!isMounted) return;
        routerRef.current.navigate(href as Href, { withAnchor: true });
      }, 0);
    };

    if (QuickActions.initial) {
      navigate(QuickActions.initial, true);
    }

    const sub = QuickActions.addListener((event) => navigate(event, false));
    return () => {
      isMounted = false;
      sub?.remove();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || Platform.OS === "web") return;
    void syncAppQuickActions(t);
  }, [enabled, t]);
}

/** Test-only: reset the initial-action dedupe guard between Jest cases. */
export function __resetQuickActionInitialDedupeForTests(): void {
  handledInitialQuickActionKey = null;
}
