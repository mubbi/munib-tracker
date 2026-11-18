import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { readJSON, writeJSON } from "@/db/store";
import type { FavoritesActions, FavoritesBlob } from "@/stores/create-favorites-store";
import type { Store } from "@/stores/create-store";

export type FavoritesBindingsSpec = {
  store: Store<{ order: string[]; updatedAt?: string; isReady: boolean }>;
  storageKey: string;
  updatedAtKey: string;
  readBlob: () => Promise<FavoritesBlob>;
  applyRemote: (order: string[], updatedAt?: string) => Promise<void>;
  useEnsureLoaded: () => void;
  useIds: () => string[];
  useIsFavorite: (id: string) => boolean;
  useActions: () => FavoritesActions;
};

/**
 * Shared contract for the domain favorites stores (dua, durood, 99 names), which
 * are thin bindings over `createFavoritesStore`. Verifies each binding is wired
 * to its own storage keys; the factory's behaviour lives in its own test.
 */
export function describeFavoritesBindings(name: string, spec: FavoritesBindingsSpec): void {
  describe(name, () => {
    beforeEach(async () => {
      await AsyncStorage.clear();
      spec.store.setState({ order: [], updatedAt: undefined, isReady: false });
    });

    it("readBlob reads the binding's own keys", async () => {
      await writeJSON(spec.storageKey, ["a"]);
      await writeJSON(spec.updatedAtKey, "2026-07-03T00:00:00.000Z");
      await expect(spec.readBlob()).resolves.toEqual({
        order: ["a"],
        updatedAt: "2026-07-03T00:00:00.000Z",
      });
    });

    it("applyRemote merges into the binding's storage key", async () => {
      await spec.applyRemote(["r"], "2026-07-03T00:00:00.000Z");
      expect(await readJSON(spec.storageKey, [])).toEqual(["r"]);
    });

    it("hooks load on mount and toggle favorites", async () => {
      await writeJSON(spec.storageKey, ["a"]);
      const { result } = await renderHook(() => {
        spec.useEnsureLoaded();
        return { ids: spec.useIds(), isB: spec.useIsFavorite("b"), actions: spec.useActions() };
      });
      await waitFor(() => expect(result.current.ids).toEqual(["a"]));

      await act(async () => {
        await result.current.actions.toggle("b");
      });

      expect(result.current.isB).toBe(true);
      expect(await readJSON(spec.storageKey, [])).toEqual(["a", "b"]);
    });
  });
}
