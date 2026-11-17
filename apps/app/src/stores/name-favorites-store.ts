import { DB_KEYS } from "@/db/keys";

import {
  createFavoritesStore,
  type FavoritesActions,
  type FavoritesBlob,
  useEnsureFavoritesLoaded,
  useFavoritesOrder,
  useIsInFavorites,
} from "./create-favorites-store";

/** Ordered favorite-name id list for the 99 names (syncs as a last-write-wins blob). */
export type NameFavoritesBlob = FavoritesBlob;

const api = createFavoritesStore(DB_KEYS.nameFavorites, DB_KEYS.nameFavoritesUpdatedAt);

export const nameFavoritesStore = api.store;
export const readNameFavoritesBlob = api.readBlob;
export const applyRemoteNameFavorites = api.applyRemote;

export function useEnsureNameFavoritesLoaded(): void {
  useEnsureFavoritesLoaded(api);
}

export function useFavoriteNameIds(): string[] {
  return useFavoritesOrder(api);
}

export function useIsFavoriteName(id: string): boolean {
  return useIsInFavorites(api, id);
}

export function useNameFavoritesActions(): FavoritesActions {
  return api.actions;
}
