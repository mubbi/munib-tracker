import { ReadingCard } from "@/components/content/reading-card";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { DUA_CORPUS, getDuaByIdFrom } from "@/lib/content-loaders";
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
  const { items } = useContentCorpus(DUA_CORPUS);
  const dua = getDuaByIdFrom(items, duaId);

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
