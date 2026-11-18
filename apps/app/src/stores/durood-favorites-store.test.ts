import { DB_KEYS } from "@/db/keys";
import { describeFavoritesBindings } from "@/test-support/favorites-store";

import {
  applyRemoteDuroodFavorites,
  duroodFavoritesStore,
  readDuroodFavoritesBlob,
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
  useIsFavoriteDurood,
} from "./durood-favorites-store";

describeFavoritesBindings("duroodFavoritesStore", {
  store: duroodFavoritesStore,
  storageKey: DB_KEYS.duroodFavorites,
  updatedAtKey: DB_KEYS.duroodFavoritesUpdatedAt,
  readBlob: readDuroodFavoritesBlob,
  applyRemote: applyRemoteDuroodFavorites,
  useEnsureLoaded: useEnsureDuroodFavoritesLoaded,
  useIds: useFavoriteDuroodIds,
  useIsFavorite: useIsFavoriteDurood,
  useActions: useDuroodFavoritesActions,
});
