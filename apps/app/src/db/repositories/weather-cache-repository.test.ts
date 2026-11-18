import AsyncStorage from "@react-native-async-storage/async-storage";

import { buildWeatherSnapshot } from "@/test-support/fixtures/weather";

import { WeatherCacheRepository } from "./weather-cache-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("WeatherCacheRepository", () => {
  it("stores one reading per coordinate bucket", async () => {
    await WeatherCacheRepository.set(buildWeatherSnapshot());
    await expect(WeatherCacheRepository.get(24.831, 67.069)).resolves.toMatchObject({
      condition: "rain",
    });
  });

  it("clear empties the cache", async () => {
    await WeatherCacheRepository.set(buildWeatherSnapshot());
    await WeatherCacheRepository.clear();
    await expect(WeatherCacheRepository.get(24.83, 67.07)).resolves.toBeNull();
  });

  it("swallows storage failures on set", async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("quota"));
    await expect(WeatherCacheRepository.set(buildWeatherSnapshot())).resolves.toBeUndefined();
  });
});
