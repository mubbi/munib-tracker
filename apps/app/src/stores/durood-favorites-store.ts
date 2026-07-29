import { DB_KEYS } from "@/db/keys";

import { createFavoritesStore, type FavoritesBlob } from "./create-favorites-store";

/** Ordered favorite-durood id list (syncs as a single last-write-wins blob). */
export type DuroodFavoritesBlob = FavoritesBlob;

const api = createFavoritesStore(DB_KEYS.duroodFavorites, DB_KEYS.duroodFavoritesUpdatedAt);

export const duroodFavoritesStore = api.store;
export const readDuroodFavoritesBlob = api.readBlob;
export const applyRemoteDuroodFavorites = api.applyRemote;
export const useEnsureDuroodFavoritesLoaded = api.useEnsureLoaded;
export const useFavoriteDuroodIds = api.useFavoriteIds;
export const useIsFavoriteDurood = api.useIsFavorite;
export const useDuroodFavoritesActions = api.useActions;
