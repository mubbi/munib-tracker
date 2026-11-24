import type { DuaItem } from "@munib-tracker/shared/types";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { Spacing } from "@/constants/theme";
import { loadDuaItems } from "@/lib/content-loaders";

/**
 * Renders bundled duas BY REFERENCE (NF-3.4, plan §2 rule 1): looks each id up
 * in the Hisnul Muslim dataset and shows the standard reading card (Arabic,
 * transliteration, the user's translation locale, reference, recorded audio).
 * Nothing is typed here; an unknown id renders nothing.
 */
export function DuaByRef({ ids }: { ids: readonly string[] }) {
  const [items, setItems] = useState<DuaItem[] | null>(null);
  useEffect(() => {
    let active = true;
    void loadDuaItems().then((all) => {
      if (active) setItems(all);
    });
    return () => {
      active = false;
    };
  }, []);
  if (!items || ids.length === 0) return null;
  const duas = ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is DuaItem => item != null);
  if (duas.length === 0) return null;
  return (
    <View style={styles.list}>
      {duas.map((dua) => (
        <ReadingCard
          key={dua.id}
          item={dua}
          sourceHref={`/dua/detail/${dua.id}`}
          enableContextMenu={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three },
});
