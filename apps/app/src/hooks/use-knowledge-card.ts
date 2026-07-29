import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { pickKnowledgeCard, type ResolvedKnowledgeCard } from "@/lib/knowledge-card";
import { usePreferences } from "@/stores/preferences-store";

function nextSeed(): number {
  return Date.now() ^ (Math.random() * 0x7fffffff);
}

const FALLBACK_CARD: ResolvedKnowledgeCard = {
  key: "fallback",
  kind: "motivation",
  topic: "steadfastness",
  titleKey: "home.knowledgeKind.motivation",
  body: "",
  icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
  palette: "accent",
};

/**
 * Returns a fresh knowledge card whenever the home screen gains focus or the
 * app returns to the foreground.
 */
export function useKnowledgeCard(): {
  card: ResolvedKnowledgeCard;
  refresh: () => void;
} {
  const [seed, setSeed] = useState(nextSeed);
  const [card, setCard] = useState<ResolvedKnowledgeCard>(FALLBACK_CARD);
  const mounted = useRef(false);
  const prefs = usePreferences();

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

  useEffect(() => {
    let cancelled = false;
    void pickKnowledgeCard(seed, new Date(), prefs).then((resolved) => {
      if (!cancelled) setCard(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [seed, prefs]);

  return { card, refresh };
}
