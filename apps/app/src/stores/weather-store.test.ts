import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";

import { WeatherCacheRepository } from "@/db/repositories/weather-cache-repository";
import { DEFAULT_LOCATION } from "@/lib/location";
import { fetchCurrentWeather } from "@/lib/weather/fetch-weather";
import { locationStore } from "@/stores/location-store";
import {
  isSameWeatherView,
  resolveWeatherEffects,
  useWeatherActions,
  useWeatherSnapshot,
  useWeatherStatus,
  weatherStore,
} from "@/stores/weather-store";
import { deferred } from "@/test-support/async";
import { buildWeatherSnapshot as baseSnapshot } from "@/test-support/fixtures/weather";

jest.mock("@/lib/weather/fetch-weather", () => ({
  ...jest.requireActual("@/lib/weather/fetch-weather"),
  fetchCurrentWeather: jest.fn(),
}));

const mockFetchWeather = fetchCurrentWeather as jest.Mock;

describe("resolveWeatherEffects", () => {
  it("returns a stable empty array when effects are disabled", () => {
    const a = resolveWeatherEffects(baseSnapshot(), { effectsEnabled: false, unit: "celsius" });
    const b = resolveWeatherEffects(baseSnapshot(), { effectsEnabled: false, unit: "celsius" });
    expect(a).toBe(b);
    expect(a).toEqual([]);
  });

  it("returns the same array instance for the same condition", () => {
    const prefs = { effectsEnabled: true, unit: "celsius" as const };
    const a = resolveWeatherEffects(baseSnapshot(), prefs);
    const b = resolveWeatherEffects(baseSnapshot({ fetchedAt: "2026-08-01T19:00:00.000Z" }), prefs);
    expect(a).toBe(b);
    expect(a).toEqual(["rain"]);
  });

  it("includes windy when flagged", () => {
    const effects = resolveWeatherEffects(baseSnapshot({ isWindy: true }), {
      effectsEnabled: true,
      unit: "celsius",
    });
    expect(effects).toEqual(["rain", "windy"]);
  });
});

describe("isSameWeatherView", () => {
  it("ignores fetchedAt and provider for hero equality", () => {
    const a = baseSnapshot({ fetchedAt: "2026-08-01T18:00:00.000Z", provider: "open-meteo" });
    const b = baseSnapshot({ fetchedAt: "2026-08-01T21:00:00.000Z", provider: "met-no" });
    expect(isSameWeatherView(a, b)).toBe(true);
  });

  it.each([
    ["temperature", { temperatureCelsius: 32 }],
    ["condition", { condition: "cloudy" as const }],
    ["wind", { isWindy: true }],
  ])("detects a %s change", (_label, overrides) => {
    expect(isSameWeatherView(baseSnapshot(), baseSnapshot(overrides))).toBe(false);
  });

  it("treats a missing side as different and identical refs as same", () => {
    const a = baseSnapshot();
    expect(isSameWeatherView(a, a)).toBe(true);
    expect(isSameWeatherView(null, a)).toBe(false);
    expect(isSameWeatherView(a, null)).toBe(false);
  });
});

describe("weatherStore", () => {
  const HERE = { ...DEFAULT_LOCATION, latitude: 24.83, longitude: 67.07 };
  const fresh = (overrides = {}) =>
    baseSnapshot({ fetchedAt: new Date().toISOString(), ...overrides });

  beforeEach(async () => {
    await AsyncStorage.clear();
    mockFetchWeather.mockReset();
    locationStore.setState({ location: HERE });
    weatherStore.setState({ snapshot: null, status: "idle" });
  });

  const state = () => weatherStore.getState();

  it("load shows a fresh cached reading without fetching", async () => {
    await WeatherCacheRepository.set(fresh());
    await state().load();
    expect(state()).toMatchObject({ status: "ready", snapshot: { temperatureCelsius: 31 } });
    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it("load fetches and caches when the cache is stale", async () => {
    await WeatherCacheRepository.set(baseSnapshot({ fetchedAt: "2000-01-01T00:00:00.000Z" }));
    mockFetchWeather.mockResolvedValue(fresh({ temperatureCelsius: 20 }));
    await state().load();
    expect(state().snapshot?.temperatureCelsius).toBe(20);
    expect((await WeatherCacheRepository.get(24.83, 67.07))?.temperatureCelsius).toBe(20);
  });

  it("sync reports an error when the first fetch fails", async () => {
    mockFetchWeather.mockRejectedValue(new Error("offline"));
    await state().sync();
    expect(state().status).toBe("error");
  });

  it("sync recovers from an error state with no reading", async () => {
    weatherStore.setState({ snapshot: null, status: "error" });
    mockFetchWeather.mockResolvedValue(fresh());
    await state().sync();
    expect(state().status).toBe("ready");
  });

  it("sync keeps the previous reading when a refresh fails", async () => {
    weatherStore.setState({ snapshot: fresh(), status: "error" });
    mockFetchWeather.mockRejectedValue(new Error("offline"));
    await state().sync({ force: true });
    expect(state()).toMatchObject({ status: "ready", snapshot: { temperatureCelsius: 31 } });
  });

  it("sync skips the update when the hero would not change", async () => {
    const shown = fresh();
    weatherStore.setState({ snapshot: shown, status: "ready" });
    mockFetchWeather.mockResolvedValue(fresh({ provider: "met-no" }));
    await state().sync({ force: true });
    expect(state().snapshot).toBe(shown);
  });

  it("sync updates a ready store when the reading changed", async () => {
    weatherStore.setState({ snapshot: fresh(), status: "ready" });
    mockFetchWeather.mockResolvedValue(fresh({ temperatureCelsius: 10 }));
    await state().sync({ force: true });
    expect(state().snapshot?.temperatureCelsius).toBe(10);
  });

  it("concurrent syncs share one fetch unless forced", async () => {
    const job = deferred<ReturnType<typeof fresh>>();
    mockFetchWeather
      .mockReturnValueOnce(job.promise)
      .mockResolvedValue(fresh({ temperatureCelsius: 5 }));

    const first = state().sync();
    const second = state().sync();
    const forced = state().sync({ force: true });
    job.resolve(fresh());
    await Promise.all([first, second, forced]);

    expect(mockFetchWeather).toHaveBeenCalledTimes(2);
    expect(state().snapshot?.temperatureCelsius).toBe(5);
  });

  it("hooks expose snapshot and status and route actions", async () => {
    mockFetchWeather.mockResolvedValue(fresh());
    const { result } = await renderHook(() => ({
      snapshot: useWeatherSnapshot(),
      status: useWeatherStatus(),
      actions: useWeatherActions(),
    }));

    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.sync({ force: true });
    });

    expect(result.current.status).toBe("ready");
    expect(result.current.snapshot?.condition).toBe("rain");
  });
});
