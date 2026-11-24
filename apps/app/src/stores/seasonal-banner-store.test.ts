import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import {
  __resetSeasonalBannerStore,
  SEASONAL_BANNER_DISMISS_CAP,
  seasonalBannerStore,
} from "@/stores/seasonal-banner-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  __resetSeasonalBannerStore();
});

describe("seasonal banner dismissals", () => {
  it("persists a dismissal on this device", async () => {
    await seasonalBannerStore.getState().dismiss("ramadan:1448");

    __resetSeasonalBannerStore();
    await seasonalBannerStore.getState().load();

    expect(seasonalBannerStore.getState().dismissed).toEqual(["ramadan:1448"]);
    expect(
      JSON.parse((await AsyncStorage.getItem(DB_KEYS.seasonalBannerDismissed)) ?? "[]"),
    ).toEqual(["ramadan:1448"]);
  });

  it("ignores duplicates and keeps only the newest keys", async () => {
    const store = seasonalBannerStore.getState();
    for (let year = 1; year <= SEASONAL_BANNER_DISMISS_CAP + 2; year++) {
      await store.dismiss(`eidFitr:${year}`);
    }
    await store.dismiss(`eidFitr:${SEASONAL_BANNER_DISMISS_CAP + 2}`);

    const { dismissed } = seasonalBannerStore.getState();
    expect(dismissed).toHaveLength(SEASONAL_BANNER_DISMISS_CAP);
    expect(dismissed[0]).toBe("eidFitr:3");
    expect(dismissed.at(-1)).toBe(`eidFitr:${SEASONAL_BANNER_DISMISS_CAP + 2}`);
  });

  it("drops malformed stored values", async () => {
    await AsyncStorage.setItem(DB_KEYS.seasonalBannerDismissed, JSON.stringify(["a:1", 4, null]));

    await seasonalBannerStore.getState().load();

    expect(seasonalBannerStore.getState().dismissed).toEqual(["a:1"]);
  });
});
