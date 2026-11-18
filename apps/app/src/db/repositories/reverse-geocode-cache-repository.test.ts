import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ReverseGeocodeCacheRepository,
  reverseGeocodeCacheKey,
} from "./reverse-geocode-cache-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("ReverseGeocodeCacheRepository", () => {
  it("buckets coordinates to two decimals", () => {
    expect(reverseGeocodeCacheKey(24.86071, 67.00114)).toBe("24.86:67.00");
  });

  it("returns a place cached for a nearby coordinate", async () => {
    await ReverseGeocodeCacheRepository.set(24.861, 67.001, { city: "Karachi" });
    await expect(ReverseGeocodeCacheRepository.get(24.8604, 67.0049)).resolves.toEqual({
      city: "Karachi",
    });
  });

  it("returns null on a miss and after clear", async () => {
    await ReverseGeocodeCacheRepository.set(1, 1, { city: "x" });
    await ReverseGeocodeCacheRepository.clear();
    await expect(ReverseGeocodeCacheRepository.get(1, 1)).resolves.toBeNull();
  });

  it("swallows storage failures on set", async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("quota"));
    await expect(ReverseGeocodeCacheRepository.set(1, 1, { city: "x" })).resolves.toBeUndefined();
  });
});
