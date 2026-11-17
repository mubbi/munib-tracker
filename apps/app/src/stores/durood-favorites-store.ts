import { DB_KEYS } from "@/db/keys";

import {
  createFavoritesStore,
  type FavoritesActions,
  type FavoritesBlob,
  useEnsureFavoritesLoaded,
  useFavoritesOrder,
  useIsInFavorites,
} from "./create-favorites-store";

/** Ordered favorite-durood id list (syncs as a single last-write-wins blob). */
export type DuroodFavoritesBlob = FavoritesBlob;

const api = createFavoritesStore(DB_KEYS.duroodFavorites, DB_KEYS.duroodFavoritesUpdatedAt);

export const duroodFavoritesStore = api.store;
export const readDuroodFavoritesBlob = api.readBlob;
export const applyRemoteDuroodFavorites = api.applyRemote;

export function useEnsureDuroodFavoritesLoaded(): void {
  useEnsureFavoritesLoaded(api);
}

export function useFavoriteDuroodIds(): string[] {
  return useFavoritesOrder(api);
}

export function useIsFavoriteDurood(id: string): boolean {
  return useIsInFavorites(api, id);
}

export function useDuroodFavoritesActions(): FavoritesActions {
  return api.actions;
}
