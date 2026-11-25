import { useEffect, useState } from "react";

import { loadAyahArabic } from "@/lib/recite-to-find/ayah-text";
import type { ReciteCandidate } from "@/lib/recite-to-find/reducer";

/**
 * Bundled Arabic for each recite-to-find candidate (its first ayah), keyed by
 * `surah:ayah`. Text already loaded is kept while the list changes.
 */
export function useReciteCandidateArabic(
  candidates: readonly Pick<ReciteCandidate, "surah" | "ayah">[],
): Record<string, string> {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const wanted = candidates.map((c) => `${c.surah}:${c.ayah}`).join(",");

  useEffect(() => {
    if (!wanted) return;
    let cancelled = false;
    const keys = wanted.split(",");
    void (async () => {
      const found: Record<string, string> = {};
      for (const key of keys) {
        const [surah, ayah] = key.split(":").map(Number);
        found[key] = await loadAyahArabic(surah, ayah);
      }
      if (cancelled) return;
      setTexts((prev) => {
        const missing = keys.some((k) => prev[k] !== found[k]);
        return missing ? { ...prev, ...found } : prev;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [wanted]);

  return texts;
}
