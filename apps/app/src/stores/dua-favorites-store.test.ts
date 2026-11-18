import { DB_KEYS } from "@/db/keys";
import { describeFavoritesBindings } from "@/test-support/favorites-store";

import {
  applyRemoteDuaFavorites,
  duaFavoritesStore,
  readDuaFavoritesBlob,
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useFavoriteDuaIds,
  useIsFavoriteDua,
} from "./dua-favorites-store";

describeFavoritesBindings("duaFavoritesStore", {
  store: duaFavoritesStore,
  storageKey: DB_KEYS.duaFavorites,
  updatedAtKey: DB_KEYS.duaFavoritesUpdatedAt,
  readBlob: readDuaFavoritesBlob,
  applyRemote: applyRemoteDuaFavorites,
  useEnsureLoaded: useEnsureDuaFavoritesLoaded,
  useIds: useFavoriteDuaIds,
  useIsFavorite: useIsFavoriteDua,
  useActions: useDuaFavoritesActions,
});
