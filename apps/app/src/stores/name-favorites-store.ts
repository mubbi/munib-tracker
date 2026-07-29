import { DB_KEYS } from "@/db/keys";

import { createFavoritesStore, type FavoritesBlob } from "./create-favorites-store";

/** Ordered favorite-name id list for the 99 names (syncs as a last-write-wins blob). */
export type NameFavoritesBlob = FavoritesBlob;

const api = createFavoritesStore(DB_KEYS.nameFavorites, DB_KEYS.nameFavoritesUpdatedAt);

export const nameFavoritesStore = api.store;
export const readNameFavoritesBlob = api.readBlob;
export const applyRemoteNameFavorites = api.applyRemote;
export const useEnsureNameFavoritesLoaded = api.useEnsureLoaded;
export const useFavoriteNameIds = api.useFavoriteIds;
export const useIsFavoriteName = api.useIsFavorite;
export const useNameFavoritesActions = api.useActions;
