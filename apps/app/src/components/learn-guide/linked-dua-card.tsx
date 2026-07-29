import type { DuaItem } from "@munib-tracker/shared/types";
import { useEffect, useState } from "react";
import { ReadingCard } from "@/components/content/reading-card";
import { getDuaByIdFrom, loadDuaItems } from "@/lib/content-loaders";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";

/**
 * Loads a bundled `DUA_ITEMS` entry by id and renders it with the shared
 * ReadingCard (Arabic, transliteration, translation, audio, favorites).
 */
export function LinkedDuaCard({ duaId, sourceHref }: { duaId: string; sourceHref?: string }) {
  const [dua, setDua] = useState<DuaItem | undefined>();
  useEffect(() => {
    let cancelled = false;
    void loadDuaItems().then((items) => {
      if (cancelled) return;
      setDua(getDuaByIdFrom(items, duaId));
    });
    return () => {
      cancelled = true;
    };
  }, [duaId]);

  useEnsureDuaFavoritesLoaded();
  const isFavorite = useIsFavoriteDua(duaId);
  const { toggle } = useDuaFavoritesActions();

  if (!dua) return null;

  return (
    <ReadingCard
      item={{
        id: dua.id,
        title: dua.title,
        arabic: dua.arabic,
        transliteration: dua.transliteration,
        translation: dua.translation,
        translations: dua.translations,
        virtues: dua.virtues,
        reference: dua.reference,
        audioUri: dua.audioUri,
      }}
      sourceHref={sourceHref}
      surface="jannah"
      isFavorite={isFavorite}
      onToggleFavorite={() => toggle(dua.id)}
    />
  );
}
