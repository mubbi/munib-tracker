import { DB_KEYS } from "@/db/keys";

import { createFavoritesStore, type FavoritesBlob } from "./create-favorites-store";

/**
 * Standalone favorites store for duas — an ordered id list persisted to
 * AsyncStorage (mirrors the zikr-favorites approach) plus a sync watermark, so
 * the change stays additive and cross-platform (no native rebuild).
 */
export type DuaFavoritesBlob = FavoritesBlob;

const api = createFavoritesStore(DB_KEYS.duaFavorites, DB_KEYS.duaFavoritesUpdatedAt);

export const duaFavoritesStore = api.store;
export const readDuaFavoritesBlob = api.readBlob;
export const applyRemoteDuaFavorites = api.applyRemote;
export const useEnsureDuaFavoritesLoaded = api.useEnsureLoaded;
export const useFavoriteDuaIds = api.useFavoriteIds;
export const useIsFavoriteDua = api.useIsFavorite;
export const useDuaFavoritesActions = api.useActions;
