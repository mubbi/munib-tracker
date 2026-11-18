import { DB_KEYS } from "@/db/keys";
import { describeFavoritesBindings } from "@/test-support/favorites-store";

import {
  applyRemoteNameFavorites,
  nameFavoritesStore,
  readNameFavoritesBlob,
  useEnsureNameFavoritesLoaded,
  useFavoriteNameIds,
  useIsFavoriteName,
  useNameFavoritesActions,
} from "./name-favorites-store";

describeFavoritesBindings("nameFavoritesStore", {
  store: nameFavoritesStore,
  storageKey: DB_KEYS.nameFavorites,
  updatedAtKey: DB_KEYS.nameFavoritesUpdatedAt,
  readBlob: readNameFavoritesBlob,
  applyRemote: applyRemoteNameFavorites,
  useEnsureLoaded: useEnsureNameFavoritesLoaded,
  useIds: useFavoriteNameIds,
  useIsFavorite: useIsFavoriteName,
  useActions: useNameFavoritesActions,
});
