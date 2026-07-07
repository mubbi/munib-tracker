import AsyncStorage from "@react-native-async-storage/async-storage";

import { countHifzBySurah, hifzStore, listHifzEntries } from "@/stores/hifz-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  await hifzStore.getState().load();
});

describe("hifz store", () => {
  it("cycles an ayah none → review → memorized → none and persists", async () => {
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBe("review");
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBe("memorized");
    await hifzStore.getState().cycle(2, 255);
    expect(hifzStore.getState().statuses["2:255"]).toBeUndefined();
  });

  it("counts memorized and review ayahs per surah", () => {
    const counts = countHifzBySurah({ "1:1": "memorized", "1:2": "review", "2:5": "memorized" });
    expect(counts[1]).toEqual({ memorized: 1, review: 1 });
    expect(counts[2]).toEqual({ memorized: 1, review: 0 });
  });

  it("lists marked ayahs sorted by surah then ayah", () => {
    const entries = listHifzEntries({ "2:5": "memorized", "1:2": "review", "1:1": "memorized" });
    expect(entries.map((e) => e.key)).toEqual(["1:1", "1:2", "2:5"]);
    expect(entries[1]?.status).toBe("review");
  });
});
