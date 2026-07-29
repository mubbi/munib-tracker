import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import type { ScrollView } from "react-native";

import { useScrollToActive } from "@/hooks/use-scroll-to-active";

/** Reads `?focus=` from the route and scrolls/highlights the matching section. */
export function useScreenFocus() {
  const params = useLocalSearchParams<{ focus?: string | string[] }>();
  const focusKey = useMemo(() => {
    const raw = params.focus;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  }, [params.focus]);

  const scrollRef = useRef<ScrollView>(null);
  const { register, onScroll } = useScrollToActive(scrollRef, focusKey, 88);

  const isFocused = (key: string) => focusKey === key;

  return { scrollRef, register, onScroll, focusKey, isFocused };
}
