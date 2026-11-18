import AsyncStorage from "@react-native-async-storage/async-storage";

import { PreferencesRepository } from "./preferences-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("setFavoriteOrder", () => {
  it("stores the order and stamps favoritesUpdatedAt", async () => {
    const prefs = await PreferencesRepository.setFavoriteOrder(["b", "a"]);
    expect(prefs.favoriteZikrOrder).toEqual(["b", "a"]);
    expect(prefs.favoritesUpdatedAt).toEqual(expect.any(String));
  });
});

describe("applyRemotePreferences", () => {
  it("ignores an older remote blob", async () => {
    await PreferencesRepository.update({
      hapticsEnabled: false,
      updatedAt: "2026-07-02T00:00:00Z",
    });
    await PreferencesRepository.applyRemotePreferences({
      hapticsEnabled: true,
      updatedAt: "2026-07-01T00:00:00Z",
    });
    expect((await PreferencesRepository.get()).hapticsEnabled).toBe(false);
  });

  it("applies a newer blob but never its favorites", async () => {
    await PreferencesRepository.toggleFavorite("z1");
    await PreferencesRepository.applyRemotePreferences({
      hapticsEnabled: false,
      favoriteZikrIds: ["remote"],
      favoriteZikrOrder: ["remote"],
      updatedAt: "2999-01-01T00:00:00Z",
    });
    const prefs = await PreferencesRepository.get();
    expect(prefs).toMatchObject({
      hapticsEnabled: false,
      favoriteZikrIds: ["z1"],
      favoriteZikrOrder: ["z1"],
      updatedAt: "2999-01-01T00:00:00Z",
    });
  });
});

describe("applyRemoteFavorites", () => {
  it("ignores older remote favorites", async () => {
    await PreferencesRepository.toggleFavorite("local");
    const { favoritesUpdatedAt } = await PreferencesRepository.get();
    await PreferencesRepository.applyRemoteFavorites(["r"], ["r"], "2000-01-01T00:00:00Z");
    expect(await PreferencesRepository.get()).toMatchObject({
      favoriteZikrIds: ["local"],
      favoritesUpdatedAt,
    });
  });

  it("applies newer remote favorites", async () => {
    await PreferencesRepository.applyRemoteFavorites(
      ["r1", "r2"],
      ["r2", "r1"],
      "2999-01-01T00:00:00Z",
    );
    expect(await PreferencesRepository.get()).toMatchObject({
      favoriteZikrIds: ["r1", "r2"],
      favoriteZikrOrder: ["r2", "r1"],
      favoritesUpdatedAt: "2999-01-01T00:00:00Z",
    });
  });
});
