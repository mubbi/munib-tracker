import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { pickKnowledgeCard, type ResolvedKnowledgeCard } from "@/lib/knowledge-card";
import { usePreferences } from "@/stores/preferences-store";

function nextSeed(): number {
  return Date.now() ^ (Math.random() * 0x7fffffff);
}

/**
 * Returns a fresh knowledge card whenever the home screen gains focus or the
 * app returns to the foreground.
 */
export function useKnowledgeCard(): {
  card: ResolvedKnowledgeCard;
  refresh: () => void;
} {
  const [seed, setSeed] = useState(nextSeed);
  const mounted = useRef(false);

  const refresh = useCallback(() => {
    setSeed(nextSeed());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (mounted.current) refresh();
      else mounted.current = true;
    }, [refresh]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (status) => {
      if (status === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const prefs = usePreferences();
  const card = useMemo(() => pickKnowledgeCard(seed, new Date(), prefs), [seed, prefs]);

  return { card, refresh };
}
